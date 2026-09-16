const { createWriteStream, mkdirSync, readdirSync, existsSync, rmSync } = require("fs");
const { join, dirname } = require("path");

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
  const STATIC_DIR = join(siteDir, "static/exercises");
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
        await zipDir(join(exerciseDir, "solution"), join(outDir, "solution.zip"));
      }

      if (existsSync(join(exerciseDir, "starter"))) {
        await zipDir(join(exerciseDir, "starter"), join(outDir, "starter.zip"));
      }
    }
  }

}

module.exports = { buildExercises };

if (require.main === module) {
  buildExercises(process.argv[2]).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
