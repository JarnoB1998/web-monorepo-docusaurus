#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const courseDir = path.resolve(__dirname, '..');
const exercisesDir = path.join(courseDir, 'docs', 'exercises');
const verificationTestPattern = /\.verification\.test\.[cm]?[jt]sx?$/;
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function usage() {
  console.log(`Usage: npm run test:exercises -- [options]

Runs only *.verification.test.ts (or .js/.tsx/.jsx) files in exercise solution folders.
Tests that are part of an exercise, such as math.test.ts, are deliberately excluded.

Options:
  --filter <regex>  Run matching solution paths only; may be repeated
  --list            List discovered solution projects without running them
  --keep-temp       Keep the temporary workspace after the run
  --help            Show this help`);
}

function parseArgs(args) {
  const options = { filters: [], list: false, keepTemp: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--filter') {
      const value = args[index + 1];
      if (!value) throw new Error('--filter requires a regular expression.');
      try {
        options.filters.push(new RegExp(value, 'i'));
      } catch (error) {
        throw new Error(`Invalid --filter regular expression: ${error.message}`);
      }
      index += 1;
    } else if (arg === '--list') {
      options.list = true;
    } else if (arg === '--keep-temp') {
      options.keepTemp = true;
    } else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function findVerificationProjects() {
  const projects = new Set();

  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === 'node_modules') continue;
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(entryPath);
        continue;
      }
      if (!verificationTestPattern.test(entry.name)) continue;

      let current = directory;
      while (current.startsWith(exercisesDir) && path.basename(current) !== 'solution') {
        current = path.dirname(current);
      }
      if (path.basename(current) !== 'solution') {
        throw new Error(`Verification test is not inside a solution folder: ${entryPath}`);
      }
      if (!fs.existsSync(path.join(current, 'package.json'))) {
        throw new Error(`Solution with verification tests has no package.json: ${current}`);
      }
      projects.add(current);
    }
  }

  visit(exercisesDir);
  return [...projects].sort();
}

function dependencySignature(projectDir, packageJson) {
  const dependencyConfig = {
    dependencies: packageJson.dependencies ?? {},
    devDependencies: packageJson.devDependencies ?? {},
    optionalDependencies: packageJson.optionalDependencies ?? {},
    peerDependencies: packageJson.peerDependencies ?? {},
    overrides: packageJson.overrides ?? {},
    engines: packageJson.engines ?? {}
  };
  const lockPath = path.join(projectDir, 'package-lock.json');
  const lockContents = fs.existsSync(lockPath) ? fs.readFileSync(lockPath, 'utf8') : '';
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(dependencyConfig))
    .update(lockContents)
    .digest('hex')
    .slice(0, 12);
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, CI: 'true' },
    stdio: 'inherit'
  });
  if (result.error) {
    console.error(result.error.message);
    return 1;
  }
  return result.status ?? 1;
}

function installDependencyGroup(group, dependencyDir) {
  fs.mkdirSync(dependencyDir, { recursive: true });
  const installPackage = { ...group.packageJson, private: true, scripts: {} };
  fs.writeFileSync(
    path.join(dependencyDir, 'package.json'),
    `${JSON.stringify(installPackage, null, 2)}\n`
  );

  const sourceLock = path.join(group.projectDir, 'package-lock.json');
  const hasLock = fs.existsSync(sourceLock);
  if (hasLock) fs.copyFileSync(sourceLock, path.join(dependencyDir, 'package-lock.json'));

  const args = hasLock
    ? ['ci', '--no-audit', '--no-fund']
    : ['install', '--no-package-lock', '--no-audit', '--no-fund'];
  return run(npmCommand, args, dependencyDir);
}

function copyProject(projectDir, scratchDir) {
  const relativePath = path.relative(courseDir, projectDir);
  const destination = path.join(scratchDir, 'projects', relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(projectDir, destination, {
    recursive: true,
    filter: (source) => path.basename(source) !== 'node_modules'
  });
  return destination;
}

function linkDependencies(projectDir, dependencyDir) {
  const target = path.join(dependencyDir, 'node_modules');
  const link = path.join(projectDir, 'node_modules');
  fs.symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const allProjects = findVerificationProjects();
  const projects = allProjects.filter((projectDir) => {
    const relativePath = path.relative(courseDir, projectDir);
    return options.filters.length === 0 || options.filters.some((filter) => filter.test(relativePath));
  });

  if (projects.length === 0) {
    throw new Error('No solution projects with verification tests matched.');
  }

  if (options.list) {
    for (const projectDir of projects) console.log(path.relative(courseDir, projectDir));
    console.log(`\n${projects.length} solution project(s)`);
    return;
  }

  const scratchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'course-exercise-tests-'));
  const groups = new Map();
  const results = [];

  try {
    for (const projectDir of projects) {
      const packageJson = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'));
      const signature = dependencySignature(projectDir, packageJson);
      if (!groups.has(signature)) groups.set(signature, { projectDir, packageJson, projects: [] });
      groups.get(signature).projects.push({ projectDir, packageJson });
    }

    console.log(`Found ${projects.length} solution project(s) in ${groups.size} dependency group(s).`);

    let groupNumber = 0;
    for (const [signature, group] of groups) {
      groupNumber += 1;
      const dependencyDir = path.join(scratchDir, 'dependencies', signature);
      console.log(`\n[dependencies ${groupNumber}/${groups.size}] ${group.projects.length} project(s)`);
      const installStatus = installDependencyGroup(group, dependencyDir);

      if (installStatus !== 0) {
        for (const project of group.projects) {
          results.push({ projectDir: project.projectDir, status: 'FAILED', reason: 'dependency installation' });
        }
        continue;
      }

      for (const project of group.projects) {
        const relativePath = path.relative(courseDir, project.projectDir);
        console.log(`\n[verify] ${relativePath}`);
        const scratchProject = copyProject(project.projectDir, scratchDir);
        linkDependencies(scratchProject, dependencyDir);

        if (project.packageJson.scripts?.typecheck) {
          const typecheckStatus = run(npmCommand, ['run', 'typecheck'], scratchProject);
          if (typecheckStatus !== 0) {
            results.push({ projectDir: project.projectDir, status: 'FAILED', reason: 'typecheck' });
            continue;
          }
        }

        const vitestCli = path.join(dependencyDir, 'node_modules', 'vitest', 'vitest.mjs');
        if (!fs.existsSync(vitestCli)) {
          results.push({ projectDir: project.projectDir, status: 'FAILED', reason: 'Vitest is not installed' });
          continue;
        }

        const testStatus = run(process.execPath, [vitestCli, 'run', 'verification'], scratchProject);
        results.push({
          projectDir: project.projectDir,
          status: testStatus === 0 ? 'PASSED' : 'FAILED',
          reason: testStatus === 0 ? '' : 'verification tests'
        });
      }
    }

    console.log('\nExercise verification summary');
    for (const result of results) {
      const suffix = result.reason ? ` (${result.reason})` : '';
      console.log(`${result.status.padEnd(6)} ${path.relative(courseDir, result.projectDir)}${suffix}`);
    }

    const passed = results.filter((result) => result.status === 'PASSED').length;
    const failed = results.length - passed;
    console.log(`\n${passed} passed, ${failed} failed`);
    if (failed > 0) process.exitCode = 1;
  } finally {
    if (options.keepTemp) {
      console.log(`Temporary workspace kept at ${scratchDir}`);
    } else {
      fs.rmSync(scratchDir, { recursive: true, force: true });
    }
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
