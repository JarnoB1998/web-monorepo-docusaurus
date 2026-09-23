const { createWriteStream, mkdirSync, readdirSync, existsSync, readFileSync, rmSync, writeFileSync } = require("fs");
const { join, dirname, relative } = require("path");

const VERIFICATION_PATTERN = /\.verification\.test\.[cm]?[jt]sx?$/;

function filesIn(sourceDir) {
  const files = [];
  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".DS_Store"].includes(entry.name)) continue;
    const entryPath = join(sourceDir, entry.name);
    if (entry.isDirectory()) files.push(...filesIn(entryPath));
    else if (entry.isFile()) files.push(entryPath);
  }
  return files.sort();
}

function buildVerificationManifest(category, exercise, solutionDir) {
  const tests = filesIn(solutionDir).filter((file) => VERIFICATION_PATTERN.test(file));
  if (tests.length === 0) return null;

  const packagePath = join(solutionDir, "package.json");
  if (!existsSync(packagePath)) {
    throw new Error(`Verification tests require a package.json: ${solutionDir}`);
  }
  const sourcePackage = JSON.parse(readFileSync(packagePath, "utf8"));
  const dependencies = { ...(sourcePackage.dependencies || {}) };
  const devDependencies = { ...(sourcePackage.devDependencies || {}) };
  // Vitest 5 currently loads a Rolldown native binding that is incompatible
  // with WebContainer. The verification tests only use Vitest's stable API.
  delete dependencies.vitest;
  devDependencies.vitest = "3.2.4";
  const packageJson = {
    name: `${sourcePackage.name || exercise}-self-test`,
    version: sourcePackage.version || "1.0.0",
    private: true,
    type: sourcePackage.type || "module",
    scripts: { typecheck: sourcePackage.scripts?.typecheck || "tsc --noEmit" },
    dependencies,
    devDependencies,
  };
  const tsconfigPath = join(solutionDir, "tsconfig.json");

  return {
    version: 1,
    category,
    exercise,
    packageJson,
    tsconfig: existsSync(tsconfigPath) ? readFileSync(tsconfigPath, "utf8") : null,
    tests: tests.map((file) => ({
      path: relative(solutionDir, file).split("\\").join("/"),
      contents: readFileSync(file, "utf8"),
    })),
  };
}

async function zipDir(sourceDir, outFile) {
  const { ZipArchive } = await import("archiver");
  return new Promise((resolve, reject) => {
    mkdirSync(dirname(outFile), { recursive: true });
    const output = createWriteStream(outFile);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
    archive.on("warning", reject);
    archive.pipe(output);
    archive.glob("**/*", { cwd: sourceDir, dot: true, ignore: ["**/node_modules/**", "**/.git/**", "**/.DS_Store"] });
    archive.finalize().catch(reject);
  });
}

async function buildExercises(siteDir = join(__dirname, "..")) {
  const DOCS_DIR = join(siteDir, "docs/exercises");
  // Keep downloads separate from the /exercises/* documentation routes.
  // A shared path makes static folders shadow the exercise pages on static hosts.
  const STATIC_DIR = join(siteDir, "static/exercise-files");
  rmSync(STATIC_DIR, { recursive: true, force: true });
  if (!existsSync(DOCS_DIR)) return;

  const categories = readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const category of categories) {
    const categoryDir = join(DOCS_DIR, category);
    const exercises = readdirSync(categoryDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    for (const exercise of exercises) {
      const exerciseDir = join(categoryDir, exercise);
      const outDir = join(STATIC_DIR, category, exercise);

      if (existsSync(join(exerciseDir, "solution"))) {
        const solutionDir = join(exerciseDir, "solution");
        await zipDir(solutionDir, join(outDir, "solution.zip"));
        const verification = buildVerificationManifest(category, exercise, solutionDir);
        if (verification) {
          mkdirSync(outDir, { recursive: true });
          writeFileSync(join(outDir, "verification.json"), `${JSON.stringify(verification)}\n`);
        }
      }

      if (existsSync(join(exerciseDir, "starter"))) {
        await zipDir(join(exerciseDir, "starter"), join(outDir, "starter.zip"));
      }
    }
  }

}

module.exports = { buildExercises, buildVerificationManifest };

if (require.main === module) {
  buildExercises(process.argv[2]).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
