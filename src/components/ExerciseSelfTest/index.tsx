import React, { useMemo, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type { FileSystemTree, WebContainer, WebContainerProcess } from '@webcontainer/api';
import { strFromU8, unzipSync } from 'fflate';
import styles from './styles.module.css';

type Manifest = {
  version: number;
  category: string;
  exercise: string;
  packageJson: Record<string, unknown>;
  tsconfig: string | null;
  tests: Array<{ path: string; contents: string }>;
};

type RunState = 'idle' | 'loading' | 'installing' | 'typechecking' | 'testing' | 'passed' | 'failed';
type MutableTree = Record<string, { file: { contents: string } } | { directory: MutableTree }>;
type ProjectFile = { path: string; contents: string; size: number };
type TestCheck = {
  id: string;
  label: string;
  status: 'passed' | 'failed';
  details?: string;
};
type VitestReport = {
  testResults?: Array<{
    assertionResults?: Array<{
      ancestorTitles?: string[];
      failureMessages?: string[];
      fullName?: string;
      status?: string;
      title?: string;
    }>;
  }>;
};

const TIMEOUTS = {
  manifest: 15_000,
  boot: 45_000,
  mount: 15_000,
  spawn: 10_000,
  install: 120_000,
  typecheck: 45_000,
  tests: 60_000,
  output: 5_000,
};

class OperationTimeoutError extends Error {}

function withTimeout<T>(promise: Promise<T>, milliseconds: number, message: string, onTimeout?: () => void): Promise<T> {
  return new Promise((resolve, reject) => {
    let completed = false;
    const timer = setTimeout(() => {
      if (completed) return;
      completed = true;
      onTimeout?.();
      reject(new OperationTimeoutError(message));
    }, milliseconds);
    promise.then(
      (value) => {
        if (completed) return;
        completed = true;
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        if (completed) return;
        completed = true;
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

let webContainerPromise: Promise<WebContainer> | null = null;

async function getWebContainer(): Promise<WebContainer> {
  if (!webContainerPromise) {
    const boot = import('@webcontainer/api')
      .then(({ WebContainer }) => WebContainer.boot({ coep: 'require-corp' }));
    webContainerPromise = withTimeout(
      boot,
      TIMEOUTS.boot,
      'De testomgeving startte niet binnen 45 seconden. Herlaad de pagina en probeer opnieuw.',
      () => { void boot.then((container) => container.teardown()).catch(() => {}); },
    )
      .catch((error) => {
        if (!(error instanceof OperationTimeoutError)) webContainerPromise = null;
        throw error;
      });
  }
  return webContainerPromise;
}

function setFile(tree: MutableTree, path: string, contents: string) {
  const parts = path.split('/').filter((part) => part && part !== '.');
  if (!parts.length || parts.some((part) => part === '..')) throw new Error(`Ongeldig bestandspad: ${path}`);
  let current = tree;
  for (const part of parts.slice(0, -1)) {
    const entry = current[part];
    if (!entry) current[part] = { directory: {} };
    if (!('directory' in current[part])) throw new Error(`Bestand en map hebben dezelfde naam: ${part}`);
    current = current[part].directory;
  }
  current[parts.at(-1)!] = { file: { contents } };
}

function selectedPath(file: File): string {
  const browserPath = file.webkitRelativePath || file.name;
  const parts = browserPath.split('/').filter(Boolean);
  return parts.length > 1 ? parts.slice(1).join('/') : parts[0];
}

function ignoredPath(path: string) {
  return path.split('/').some((part) => ['node_modules', '.git', '.DS_Store', '__MACOSX'].includes(part));
}

function validateProjectFiles(files: ProjectFile[]) {
  if (files.length > 300) throw new Error('De geselecteerde map bevat meer dan 300 bestanden. Kies alleen de projectmap.');
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > 10 * 1024 * 1024) throw new Error('De geselecteerde map is groter dan 10 MB. Verwijder node_modules en probeer opnieuw.');
  if (!files.length) throw new Error('Er werden geen projectbestanden gevonden.');
  return files;
}

async function filesFromFolder(files: File[]) {
  return validateProjectFiles(await Promise.all(files
    .map((file) => ({ file, path: selectedPath(file) }))
    .filter(({ path }) => path && !ignoredPath(path))
    .map(async ({ file, path }) => ({ path, contents: await file.text(), size: file.size }))));
}

async function filesFromZip(file: File) {
  if (file.size > 10 * 1024 * 1024) throw new Error('De ZIP is groter dan 10 MB. Verwijder node_modules en probeer opnieuw.');
  const archive = unzipSync(new Uint8Array(await file.arrayBuffer()));
  const entries = Object.entries(archive)
    .map(([path, contents]) => ({ path: path.replaceAll('\\', '/').replace(/^\.\//, ''), contents }))
    .filter(({ path }) => path && !path.endsWith('/') && !ignoredPath(path));
  const roots = new Set(entries.map(({ path }) => path.split('/')[0]));
  const stripRoot = roots.size === 1 && entries.every(({ path }) => path.includes('/'));
  return validateProjectFiles(entries.map(({ path, contents }) => ({
    path: stripRoot ? path.split('/').slice(1).join('/') : path,
    contents: strFromU8(contents),
    size: contents.byteLength,
  })));
}

function projectTree(files: ProjectFile[], manifest: Manifest): FileSystemTree {
  const tree: MutableTree = {};
  for (const file of files) setFile(tree, file.path, file.contents);

  setFile(tree, 'package.json', `${JSON.stringify(manifest.packageJson, null, 2)}\n`);
  if (manifest.tsconfig) setFile(tree, 'tsconfig.json', manifest.tsconfig);
  for (const test of manifest.tests) setFile(tree, test.path, test.contents);
  return tree as FileSystemTree;
}

function cleanOutput(text: string) {
  return text
    .replace(/\x1B\][^\x07]*(?:\x07|\x1B\\)/g, '')
    .replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')
    .replaceAll('\r', '')
    .replace(/^[|/\\-]$/gm, '');
}

async function collectOutput(process: WebContainerProcess, milliseconds: number, timeoutMessage: string) {
  let output = '';
  const piping = process.output.pipeTo(new WritableStream({
    write: (text) => { output += cleanOutput(text); },
  }));
  void piping.catch(() => {});
  const exitCode = await withTimeout(process.exit, milliseconds, timeoutMessage, () => process.kill());
  await withTimeout(
    piping,
    TIMEOUTS.output,
    'Het testproces kon niet correct afgesloten worden. Probeer opnieuw.',
    () => process.kill(),
  );
  return { exitCode, output: output.trim() };
}

function conciseFailure(messages: string[] = []) {
  return cleanOutput(messages.join('\n'))
    .split('\n')
    .filter((line) => !/^\s+at\s/.test(line))
    .slice(0, 16)
    .join('\n')
    .trim();
}

function checksFromReport(report: VitestReport): TestCheck[] {
  return (report.testResults ?? []).flatMap((file, fileIndex) =>
    (file.assertionResults ?? []).map((test, testIndex) => {
      const label = test.ancestorTitles?.length
        ? [...test.ancestorTitles, test.title].filter(Boolean).join(' › ')
        : test.fullName || test.title || `Test ${testIndex + 1}`;
      return {
        id: `${fileIndex}-${testIndex}`,
        label,
        status: test.status === 'passed' ? 'passed' : 'failed',
        details: conciseFailure(test.failureMessages),
      };
    }));
}

interface ExerciseSelfTestProps {
  category: string;
  exercise: string;
}

export default function ExerciseSelfTest({ category, exercise }: ExerciseSelfTestProps) {
  const manifestUrl = useBaseUrl(`/exercise-files/${category}/${exercise}/verification.json`);
  const inputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [projectName, setProjectName] = useState('');
  const [state, setState] = useState<RunState>('idle');
  const [checks, setChecks] = useState<TestCheck[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const running = ['loading', 'installing', 'typechecking', 'testing'].includes(state);
  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  const selectProject = async (loader: () => Promise<ProjectFile[]>, name: string) => {
    setChecks([]);
    setErrorMessage('');
    setState('idle');
    try {
      setFiles(await loader());
      setProjectName(name);
    } catch (error) {
      setFiles([]);
      setProjectName('');
      setState('failed');
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  };

  const run = async () => {
    if (!files.length || running) return;
    setChecks([]);
    setErrorMessage('');
    setState('loading');
    try {
      const manifestController = new AbortController();
      const response = await withTimeout(
        fetch(manifestUrl, { signal: manifestController.signal }),
        TIMEOUTS.manifest,
        'De verificatietests konden niet tijdig geladen worden. Controleer je verbinding en probeer opnieuw.',
        () => manifestController.abort(),
      );
      if (!response.ok) throw new Error(`Verification bundle kon niet geladen worden (${response.status}).`);
      const manifest = await response.json() as Manifest;
      if (manifest.version !== 1 || !manifest.tests?.length) throw new Error('Ongeldige verification bundle.');

      const webcontainer = await getWebContainer();
      const workspace = `self-test-${exercise.replace(/[^a-z0-9-]/gi, '-')}-${Date.now()}`;
      await withTimeout(
        webcontainer.mount({ [workspace]: { directory: projectTree(files, manifest) } }),
        TIMEOUTS.mount,
        'Het project kon niet tijdig voorbereid worden. Probeer opnieuw.',
      );
      const cwd = `/${workspace}`;
      const processOptions = {
        cwd,
        env: { CI: 'true', NO_COLOR: '1', FORCE_COLOR: '0', TERM: 'dumb' },
      };

      setState('installing');
      const install = await withTimeout(
        webcontainer.spawn('npm', [
          'install', '--no-package-lock', '--no-audit', '--no-fund', '--ignore-scripts', '--progress=false', '--loglevel=warn',
        ], processOptions),
        TIMEOUTS.spawn,
        'De installatie kon niet gestart worden. Probeer opnieuw.',
      );
      if ((await collectOutput(
        install,
        TIMEOUTS.install,
        'Het installeren van de testafhankelijkheden duurde langer dan 2 minuten en werd gestopt.',
      )).exitCode !== 0) {
        throw new Error('De testomgeving kon niet voorbereid worden. Probeer de zelftest opnieuw.');
      }

      setState('typechecking');
      const typecheck = await withTimeout(
        webcontainer.spawn('npm', ['run', 'typecheck'], processOptions),
        TIMEOUTS.spawn,
        'De TypeScript-controle kon niet gestart worden. Probeer opnieuw.',
      );
      const typecheckResult = await collectOutput(
        typecheck,
        TIMEOUTS.typecheck,
        'De TypeScript-controle duurde langer dan 45 seconden en werd gestopt.',
      );
      if (typecheckResult.exitCode !== 0) {
        setChecks([{
          id: 'typecheck',
          label: 'TypeScript-controle',
          status: 'failed',
          details: conciseFailure([typecheckResult.output]),
        }]);
        setState('failed');
        return;
      }

      setState('testing');
      const tests = await withTimeout(
        webcontainer.spawn('node', [
          'node_modules/vitest/vitest.mjs', 'run', 'verification', '--reporter=json',
          '--outputFile=verification-results.json', '--no-color',
        ], processOptions),
        TIMEOUTS.spawn,
        'Vitest kon niet gestart worden. Probeer opnieuw.',
      );
      const testResult = await collectOutput(
        tests,
        TIMEOUTS.tests,
        'De verificatietests duurden langer dan 60 seconden en werden gestopt.',
      );
      let nextChecks: TestCheck[] = [];
      try {
        const reportText = await withTimeout(
          webcontainer.fs.readFile(`${cwd}/verification-results.json`, 'utf-8'),
          TIMEOUTS.output,
          'De testresultaten konden niet tijdig gelezen worden.',
        );
        const report = JSON.parse(reportText) as VitestReport;
        nextChecks = checksFromReport(report);
      } catch {
        nextChecks = [{
          id: 'vitest',
          label: 'Verificatietests',
          status: 'failed',
          details: conciseFailure([testResult.output]) || 'De testresultaten konden niet gelezen worden.',
        }];
      }
      if (!nextChecks.length) {
        nextChecks = [{ id: 'vitest', label: 'Verificatietests', status: 'failed', details: 'Er werden geen tests gevonden.' }];
      }
      setChecks(nextChecks);
      setState(testResult.exitCode === 0 && nextChecks.every((check) => check.status === 'passed') ? 'passed' : 'failed');
    } catch (error) {
      setState('failed');
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  };

  const progressLabel = state === 'testing' ? 'Tests uitvoeren…' : 'Tests voorbereiden…';

  return (
    <section className={styles.panel} aria-labelledby={`self-test-${exercise}`}>
      <div className={styles.headingRow}>
        <div>
          <h2 id={`self-test-${exercise}`}>Zelftest</h2>
          <p>Selecteer je projectmap of een ZIP-bestand. Je code en de verificatietests worden uitsluitend in je browser uitgevoerd.</p>
        </div>
        <span className={styles.badge}>Vitest</span>
      </div>

      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="file"
        multiple
        {...{ webkitdirectory: '', directory: '' }}
        onChange={(event) => {
          const selected = Array.from(event.currentTarget.files ?? []);
          const name = selected[0]?.webkitRelativePath.split('/')[0] ?? '';
          void selectProject(() => filesFromFolder(selected), name);
        }}
      />
      <input
        ref={zipInputRef}
        className={styles.hiddenInput}
        type="file"
        accept=".zip,application/zip"
        onChange={(event) => {
          const zip = event.currentTarget.files?.[0];
          if (zip) void selectProject(() => filesFromZip(zip), zip.name.replace(/\.zip$/i, ''));
          event.currentTarget.value = '';
        }}
      />
      <div className={styles.actions}>
        <button className="button button--secondary" type="button" disabled={running} onClick={() => inputRef.current?.click()}>
          Projectmap kiezen
        </button>
        <button className="button button--secondary" type="button" disabled={running} onClick={() => zipInputRef.current?.click()}>
          Project-ZIP kiezen
        </button>
        <button className="button button--primary" type="button" disabled={!files.length || running} onClick={run}>
          {running ? 'Zelftest wordt uitgevoerd…' : 'Voer zelftest uit'}
        </button>
      </div>
      {projectName && (
        <p className={styles.selection}>
          <strong>{projectName}</strong> · {files.length} bestand(en) · {Math.ceil(totalSize / 1024)} KB
        </p>
      )}
      <p className={styles.note}>
        Werk je in een Dev Container? Maak of download daar een ZIP van je project en kies <strong>Project-ZIP kiezen</strong>.
        Laat <code>node_modules</code> en <code>.git</code> weg. Alles wordt uitsluitend in je browser uitgepakt en getest.
      </p>

      {(running || checks.length > 0 || errorMessage) && (
        <div className={styles.results} aria-live="polite">
          {running && (
            <div className={styles.progress} role="status">
              <span className={styles.spinner} aria-hidden="true" />
              <span>{progressLabel}</span>
            </div>
          )}
          {checks.length > 0 && (
            <ul className={styles.checkList}>
              {checks.map((check) => (
                <li key={check.id} className={styles.check} data-status={check.status}>
                  <span className={styles.checkIcon} aria-hidden="true">{check.status === 'passed' ? '✓' : '×'}</span>
                  <div>
                    <span className={styles.visuallyHidden}>{check.status === 'passed' ? 'Geslaagd: ' : 'Mislukt: '}</span>
                    <span className={styles.checkLabel}>{check.label}</span>
                    {check.details && (
                      <details className={styles.feedback}>
                        <summary>Bekijk feedback</summary>
                        <pre>{check.details}</pre>
                      </details>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </div>
      )}
    </section>
  );
}
