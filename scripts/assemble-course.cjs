const fs = require('node:fs/promises');
const path = require('node:path');
const {
  loadFreshModule, parseMarkdownFile, DEFAULT_PARSE_FRONT_MATTER,
  createMatcher, GlobExcludeDefault,
} = require('@docusaurus/utils');
// Use the same sidebar normalization and document IDs as our pinned Docusaurus version.
const { normalizeSidebars } = require('@docusaurus/plugin-content-docs/lib/sidebars/normalization.js');
const { DefaultNumberPrefixParser } = require('@docusaurus/plugin-content-docs/lib/numberPrefix.js');

const SOURCE_DIR = path.resolve(__dirname, '..');
const OUTPUT_NAME = '.course';
const MARKER = '.assembled-course.json';
const EXCLUDES = [...GlobExcludeDefault, '**/node_modules/**', '**/{starter,solution}/**'];
const CONFIG_PATTERN = /^docusaurus\.config\.(ts|js|cjs|mjs|mts|cts)$/;
const toPosix = (value) => value.split(path.sep).join('/');

function inside(root, relative, label) {
  if (typeof relative !== 'string' || path.isAbsolute(relative)) {
    throw new Error(`${label} must be a relative path: ${relative}`);
  }
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`${label} must stay inside ${root}: ${relative}`);
  }
  return resolved;
}

async function exists(file) {
  try { await fs.access(file); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

async function canReplaceOutput(outputDir) {
  let stat;
  try { stat = await fs.lstat(outputDir); }
  catch (error) { if (error.code === 'ENOENT') return true; throw error; }
  // Use lstat so even a dangling output symlink is refused.
  if (!stat.isDirectory()) return false;
  try {
    const marker = JSON.parse(await fs.readFile(path.join(outputDir, MARKER), 'utf8'));
    return marker?.generator === 'assemble-course';
  } catch (error) {
    if (error instanceof SyntaxError) return false;
    if (error.code !== 'ENOENT') throw error;
  }
  // Vercel caches nested node_modules without our marker. Accept only that
  // dependency cache (or an empty directory), never unmarked course content.
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  return entries.every((entry) => entry.name === 'node_modules' &&
    (entry.isDirectory() || entry.isSymbolicLink()));
}

async function filesIn(root, relative = '') {
  const files = [];
  for (const entry of await fs.readdir(path.join(root, relative), { withFileTypes: true })) {
    if (['node_modules', '.git', '.DS_Store'].includes(entry.name)) continue;
    const name = path.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Source symlinks are not supported: ${path.join(root, name)}`);
    if (entry.isDirectory()) files.push(...await filesIn(root, name));
    else if (entry.isFile()) files.push(toPosix(name));
  }
  return files.sort();
}

function docsPreset(config) {
  const presets = (config.presets ?? []).filter((preset) =>
    ['classic', '@docusaurus/preset-classic'].includes(Array.isArray(preset) ? preset[0] : preset));
  if (presets.length !== 1 || !Array.isArray(presets[0]) || presets[0][1]?.docs === false) {
    throw new Error('Course assembly requires one classic preset with docs enabled.');
  }
  return presets[0];
}

async function loadConfig(file) {
  const exported = await loadFreshModule(file);
  const config = typeof exported === 'function' ? await exported() : await exported;
  docsPreset(config);
  return config;
}

async function documentIndex(root, options, markdown = {}) {
  const include = createMatcher(options.include ?? ['**/*.{md,mdx}']);
  const exclude = createMatcher([...EXCLUDES, ...(options.exclude ?? [])]);
  const parser = typeof options.numberPrefixParser === 'function' ? options.numberPrefixParser
    : options.numberPrefixParser === false ? (filename) => ({ filename }) : DefaultNumberPrefixParser;
  const index = new Map();
  const files = await filesIn(root);
  for (const file of files.filter((name) => /\.(md|mdx)$/.test(name) && include(name) && !exclude(name))) {
    const filePath = path.join(root, file);
    const { frontMatter } = await parseMarkdownFile({
      filePath, fileContent: await fs.readFile(filePath, 'utf8'),
      parseFrontMatter: markdown.parseFrontMatter ?? DEFAULT_PARSE_FRONT_MATTER,
    });
    const parts = file.replace(/\.(md|mdx)$/, '').split('/');
    const normalized = frontMatter.parse_number_prefixes === false
      ? parts : parts.map((part) => parser(part).filename);
    if (frontMatter.id !== undefined) {
      if (typeof frontMatter.id !== 'string' || frontMatter.id.includes('/')) {
        throw new Error(`Invalid front matter id in ${file}`);
      }
      normalized[normalized.length - 1] = frontMatter.id;
    }
    const id = normalized.join('/');
    if (index.has(id)) throw new Error(`Duplicate document id "${id}": ${index.get(id)} and ${file}`);
    index.set(id, file);
  }
  return { index, files };
}

function selectDocuments(sidebars, index, extraDocs = []) {
  const selected = new Set();
  function add(id) {
    if (!index.has(id)) throw new Error(`Unknown or excluded document id "${id}" in course configuration.`);
    selected.add(index.get(id));
  }
  function visit(item) {
    switch (item.type) {
      case 'doc': case 'ref': add(item.id); break;
      case 'category':
        if (item.link?.type === 'doc') add(item.link.id);
        item.items.forEach(visit);
        break;
      case 'autogenerated': {
        const root = path.resolve('/course-docs');
        const directory = toPosix(path.relative(root, inside(root, item.dirName, 'Autogenerated directory')));
        const matches = [...index.values()].filter((file) => !directory || file.startsWith(`${directory}/`));
        if (!matches.length) throw new Error(`Autogenerated directory "${item.dirName}" has no eligible documents.`);
        matches.forEach((file) => selected.add(file));
        break;
      }
      case 'link': case 'html': break;
      default: throw new Error(`Unsupported sidebar item type: ${item.type}`);
    }
  }
  Object.values(normalizeSidebars(sidebars)).flat().forEach(visit);
  if (!Array.isArray(extraDocs)) throw new Error('customFields.course.extraDocs must be an array of document IDs.');
  extraDocs.forEach(add);
  if (!selected.size) throw new Error('The course does not select any documents.');
  return [...selected].sort();
}

async function copyFile(sourceRoot, targetRoot, file) {
  const target = path.join(targetRoot, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(path.join(sourceRoot, file), target);
}

async function copyTree(source, target, filter = () => true) {
  for (const file of await filesIn(source)) {
    if (filter(file)) await copyFile(source, target, file);
  }
}

function generatedConfig(config, selected) {
  const preset = docsPreset(config);
  return {
    ...config,
    plugins: [...(config.plugins ?? []), browserOnlyWebContainerPlugin],
    presets: config.presets.map((entry) => entry !== preset ? entry : [entry[0], {
      ...entry[1], docs: { ...entry[1].docs, path: 'docs', include: selected },
    }]),
  };
}

function browserOnlyWebContainerPlugin() {
  return {
    name: 'browser-only-webcontainer',
    configureWebpack(_config, isServer) {
      return isServer
        ? { resolve: { alias: { '@webcontainer/api$': false } } }
        : {
            devServer: {
              headers: {
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cross-Origin-Embedder-Policy': 'require-corp',
              },
            },
          };
    },
  };
}

async function assembleCourse({ courseDir, sourceDir = SOURCE_DIR }) {
  courseDir = await fs.realpath(path.resolve(courseDir));
  sourceDir = await fs.realpath(sourceDir);
  const outputDir = path.join(courseDir, OUTPUT_NAME);
  if (!await canReplaceOutput(outputDir)) {
    throw new Error(`Refusing to replace an unrecognized directory: ${outputDir}`);
  }
  const names = await fs.readdir(courseDir);
  const configs = names.filter((name) => CONFIG_PATTERN.test(name));
  if (configs.length !== 1) throw new Error('Expected exactly one docusaurus.config file in the course directory.');
  const staging = await fs.mkdtemp(path.join(courseDir, '.course-tmp-'));
  try {
    // Resolve config imports and Docusaurus packages from the shared installation.
    await fs.symlink(path.join(SOURCE_DIR, 'node_modules'), path.join(staging, 'node_modules'), 'dir');
    const configName = `.course-config${path.extname(configs[0])}`;
    for (const name of names) {
      if (!/\.(ts|js|cjs|mjs|mts|cts|json)$/.test(name) || name.startsWith('.') ||
          ['package.json', 'package-lock.json'].includes(name)) continue;
      const stat = await fs.lstat(path.join(courseDir, name));
      if (!stat.isFile()) continue;
      await fs.copyFile(path.join(courseDir, name), path.join(staging, name === configs[0] ? configName : name));
    }
    // Optional helpers imported by the root configuration modules.
    if (await exists(path.join(courseDir, 'config'))) {
      await copyTree(path.join(courseDir, 'config'), path.join(staging, 'config'));
    }
    const config = await loadConfig(path.join(staging, configName));
    const options = docsPreset(config)[1].docs ?? {};
    const docsRoot = inside(sourceDir, options.path ?? 'docs', 'Docs path');
    const { index, files } = await documentIndex(docsRoot, options, config.markdown);
    const sidebars = options.sidebarPath === undefined || options.sidebarPath === false
      ? { all: [{ type: 'autogenerated', dirName: '.' }] }
      : await loadFreshModule(inside(staging, options.sidebarPath, 'Sidebar path'));
    const selected = selectDocuments(sidebars, index, config.customFields?.course?.extraDocs);
    const selectedSet = new Set(selected);
    const exercises = new Set(selected.filter((file) => /^exercises\/[^/]+\/[^/]+\//.test(file))
      .map((file) => file.split('/').slice(0, 3).join('/')));
    for (const file of files) {
      const exercise = file.split('/').slice(0, 3).join('/');
      const isExercise = file.startsWith('exercises/');
      // Keep shared images and MDX partials, but no unselected lesson pages or exercise payloads.
      const supportFile = !/\.(md|mdx)$/.test(file) || file.split('/').some((part) => part.startsWith('_'));
      if (selectedSet.has(file) || (isExercise ? exercises.has(exercise) : supportFile)) {
        await copyFile(docsRoot, path.join(staging, 'docs'), file);
      }
    }
    for (const directory of ['src', 'static']) {
      await copyTree(path.join(sourceDir, directory), path.join(staging, directory),
        (file) => directory !== 'static' ||
          (!file.startsWith('exercises/') && !file.startsWith('exercise-files/')));
    }
    await fs.copyFile(path.join(SOURCE_DIR, 'package.json'), path.join(staging, 'package.json'));
    await fs.copyFile(path.join(SOURCE_DIR, 'tsconfig.json'), path.join(staging, 'tsconfig.json'));
    const manifest = { generator: 'assemble-course', sourceDir, courseDir, documents: selected, exercises: [...exercises].sort() };
    await fs.writeFile(path.join(staging, MARKER), `${JSON.stringify(manifest, null, 2)}\n`);
    await fs.writeFile(path.join(staging, 'docusaurus.config.cjs'),
      `const { loadConfig, generatedConfig } = require(${JSON.stringify(__filename)});\n` +
      `module.exports = async () => generatedConfig(await loadConfig(require('node:path').join(__dirname, ${JSON.stringify(configName)})), require('./${MARKER}').documents);\n`);
    // Validate and copy everything before replacing an earlier successful assembly.
    await fs.rm(outputDir, { recursive: true, force: true });
    await fs.rename(staging, outputDir);
    return { outputDir, ...manifest };
  } catch (error) {
    await fs.rm(staging, { recursive: true, force: true });
    throw error;
  }
}

module.exports = { assembleCourse, loadConfig, generatedConfig, selectDocuments, documentIndex };
