#!/usr/bin/env node
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { assembleCourse } = require('./assemble-course.cjs');
const { buildExercises } = require('./build-exercises.cjs');
const { serveCourse } = require('./serve-course.cjs');

async function main() {
  const args = process.argv.slice(2);
  let courseDir = process.cwd();
  const index = args.indexOf('--course');
  if (index !== -1) {
    if (!args[index + 1] || args[index + 1].startsWith('-')) throw new Error('--course requires a directory.');
    courseDir = path.resolve(args[index + 1]);
    args.splice(index, 2);
  }
  const command = args.shift() ?? 'assemble';
  if (!['assemble', 'build', 'start', 'serve', 'clear', 'typecheck'].includes(command)) {
    throw new Error('Usage: node scripts/course.cjs [--course <directory>] [assemble|build|start|serve|clear|typecheck] [Docusaurus options]');
  }
  let siteDir = path.join(courseDir, '.course');
  if (!['serve', 'clear'].includes(command)) {
    const assembly = await assembleCourse({ courseDir });
    siteDir = assembly.outputDir;
    await buildExercises(siteDir);
    console.log(`Assembled ${assembly.documents.length} documents and ${assembly.exercises.length} exercises into ${siteDir}`);
  }
  if (command === 'assemble') return;
  if (command === 'serve') {
    await serveCourse({ siteDir, args });
    return;
  }
  const cli = command === 'typecheck' ? require.resolve('typescript/bin/tsc')
    : path.join(path.dirname(require.resolve('@docusaurus/core/package.json')), 'bin/docusaurus.mjs');
  const cliArgs = command === 'typecheck' ? args : [command, ...args];
  const result = spawnSync(process.execPath, [cli, ...cliArgs], { cwd: siteDir, stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
