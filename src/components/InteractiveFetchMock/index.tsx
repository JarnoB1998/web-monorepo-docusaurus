import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { withMaximize } from '../shared/Maximizable';
import { useColorMode } from '@docusaurus/theme-common';
import Editor from '@monaco-editor/react';
import styles from './styles.module.css';

const FETCH_MOCK_TYPES = `
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
interface ExpectResult {
  toBe(expected: any): void;
  toHaveLength(n: number): void;
  toBeDefined(): void;
  rejects: {
    toThrow(message: string): Promise<void>;
  };
}
declare const fetchMock: {
  /** Registreer een nep-antwoord voor een URL */
  get(url: string, response: any): void;
  mockGlobal(): void;
  mockRestore(): void;
};
declare function getPosts(): Promise<Post[]>;
declare function getPost(id: number): Promise<Post>;
declare function expect(value: any): ExpectResult;
`;

const WITH_MOCK_CODE = `// Activeer de mock en registreer de antwoorden
fetchMock.mockGlobal();
fetchMock.get('https://jsonplaceholder.typicode.com/posts', [
  { userId: 1, id: 1, title: "foo", body: "bar" },
  { userId: 1, id: 2, title: "baz", body: "qux" }
]);

const posts = await getPosts();
expect(posts).toHaveLength(2);
expect(posts[0].title).toBe("foo");

// Mock ook een 404 fout
fetchMock.get('https://jsonplaceholder.typicode.com/posts/999', 404);
await expect(getPost(999)).rejects.toThrow("404");`;

const WITHOUT_MOCK_CODE = `// Geen mock — de fetch gaat naar de echte API!
const posts = await getPosts();

// Zal falen: echte API geeft 100 posts terug, niet 2
expect(posts).toHaveLength(2);
// Zal falen: echte titel is anders dan "foo"
expect(posts[0].title).toBe("foo");`;

type SimEvent =
  | { type: 'system'; text: string; nodeId: string }
  | { type: 'log'; level: 'info' | 'error'; text: string }
  | { type: 'network'; url: string; source: 'mock' | 'real'; status: number; data: any; duration: number; nodeId: string }
  | { type: 'assertion'; passed: boolean; message: string; nodeId: string }
  | { type: 'done' };

class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

function stripTypes(src: string): string {
  let r = src.replace(/:\s*[A-Z][A-Za-z0-9_]*(?:<[^>]*>)?\s*(?=[,)=])/g, '');
  r = r.replace(/\)\s*:\s*[A-Za-z][A-Za-z0-9_]*(?:<[^>]*>)?\s*(?=\s*=>|\s*\{)/g, ')');
  return r;
}

async function runSimulation(code: string): Promise<SimEvent[]> {
  const events: SimEvent[] = [];
  const mockRegistry = new Map<string, any>();
  let mockingEnabled = false;

  const mockFetchMock = {
    get: (url: string, response: any) => {
      mockRegistry.set(url, response);
      const short = url.replace('https://jsonplaceholder.typicode.com', '');
      events.push({ type: 'system', text: `Mock geregistreerd: GET ${short}`, nodeId: 'fetchmock' });
    },
    mockGlobal: () => { mockingEnabled = true; },
    mockRestore: () => {
      mockRegistry.clear();
      mockingEnabled = false;
    },
  };

  const simulateFetch = async (url: string) => {
    if (mockingEnabled) {
      if (!mockRegistry.has(url)) {
        throw new Error(`Geen mock geregistreerd voor GET ${url}`);
      }
      const mockResponse = mockRegistry.get(url);
      const isStatus = typeof mockResponse === 'number';
      const data = isStatus ? null : mockResponse;
      const status = isStatus ? mockResponse : 200;
      events.push({ type: 'network', url, source: 'mock', status, data, duration: 0, nodeId: 'response' });
      return { ok: status >= 200 && status < 300, status, json: async () => data };
    } else {
      const short = url.replace('https://jsonplaceholder.typicode.com', '');
      events.push({ type: 'system', text: `Echte fetch: GET ${short}...`, nodeId: 'fetch' });
      const start = Date.now();
      try {
        const res = await fetch(url);
        const data = await res.json();
        const duration = Date.now() - start;
        events.push({ type: 'network', url, source: 'real', status: res.status, data, duration, nodeId: 'response' });
        return { ok: res.ok, status: res.status, json: async () => data };
      } catch (e: any) {
        const duration = Date.now() - start;
        events.push({ type: 'network', url, source: 'real', status: 0, data: null, duration, nodeId: 'response' });
        throw new Error(`Netwerk fout: ${e.message}`);
      }
    }
  };

  const mockGetPosts = async (): Promise<any[]> => {
    events.push({ type: 'system', text: 'getPosts() aangeroepen', nodeId: 'fetch' });
    const res = await simulateFetch('https://jsonplaceholder.typicode.com/posts');
    if (!res.ok) throw new Error(res.status.toString());
    return res.json();
  };

  const mockGetPost = async (id: number): Promise<any> => {
    events.push({ type: 'system', text: `getPost(${id}) aangeroepen`, nodeId: 'fetch' });
    const res = await simulateFetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!res.ok) throw new Error(res.status.toString());
    return res.json();
  };

  const createExpect = (actual: any) => ({
    toBe: (expected: any) => {
      const passed = actual === expected;
      const msg = `expect(${JSON.stringify(actual)}).toBe(${JSON.stringify(expected)})`;
      events.push({ type: 'assertion', passed, message: msg, nodeId: 'test' });
      if (!passed) throw new AssertionError(`Verwacht: ${JSON.stringify(expected)}, ontvangen: ${JSON.stringify(actual)}`);
    },
    toHaveLength: (n: number) => {
      const len = Array.isArray(actual) ? actual.length : -1;
      const passed = len === n;
      const msg = `expect(posts).toHaveLength(${n}) // ontvangen: ${len === -1 ? 'geen array' : len}`;
      events.push({ type: 'assertion', passed, message: msg, nodeId: 'test' });
      if (!passed) throw new AssertionError(`Verwacht lengte: ${n}, ontvangen: ${len}`);
    },
    toBeDefined: () => {
      const passed = actual !== undefined && actual !== null;
      const msg = `expect(value).toBeDefined()`;
      events.push({ type: 'assertion', passed, message: msg, nodeId: 'test' });
      if (!passed) throw new AssertionError(`Verwacht gedefinieerd, ontvangen: ${actual}`);
    },
    rejects: {
      toThrow: async (message: string) => {
        let rejected = false;
        let rejection: unknown;
        try {
          await actual;
        } catch (error) {
          rejected = true;
          rejection = error;
        }
        const passed = rejected && rejection instanceof Error && rejection.message.includes(message);
        events.push({
          type: 'assertion',
          passed,
          message: `expect(promise).rejects.toThrow(${JSON.stringify(message)})`,
          nodeId: 'test',
        });
        if (!passed) {
          throw new AssertionError(rejected
            ? `Verwacht fout met boodschap ${JSON.stringify(message)}, ontvangen: ${String(rejection)}`
            : 'Verwacht een afgewezen Promise, maar de Promise is geslaagd');
        }
      },
    },
  });

  events.push({ type: 'system', text: '--- Test gestart ---', nodeId: 'test' });

  try {
    const stripped = stripTypes(code);
    const fn = new Function('fetchMock', 'getPosts', 'getPost', 'expect', 'console', `
      return (async () => {
        ${stripped}
      })();
    `);
    await fn(
      mockFetchMock,
      mockGetPosts,
      mockGetPost,
      createExpect,
      {
        log: (...a: any[]) => events.push({ type: 'log', level: 'info', text: a.map(String).join(' ') }),
        error: (...a: any[]) => events.push({ type: 'log', level: 'error', text: a.map(String).join(' ') }),
      }
    );
    events.push({ type: 'system', text: '--- Alle tests geslaagd ✓ ---', nodeId: 'test' });
  } catch (e: any) {
    if (e instanceof AssertionError) {
      events.push({ type: 'system', text: `--- Test mislukt: ${e.message} ---`, nodeId: 'test' });
    } else {
      events.push({ type: 'log', level: 'error', text: e.message });
      events.push({ type: 'system', text: '--- Test mislukt ✗ ---', nodeId: 'test' });
    }
  }

  events.push({ type: 'done' });
  return events;
}

const PIPELINE_NODES = [
  { id: 'test', label: 'Test Code' },
  { id: 'fetchmock', label: 'fetchMock' },
  { id: 'fetch', label: 'fetch()' },
  { id: 'response', label: 'Response' },
];

function InteractiveFetchMock() {
  const [code, setCode] = useState(WITH_MOCK_CODE);
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();

  const visibleEvents = useMemo(
    () => (stepIndex >= 0 ? events.slice(0, stepIndex + 1) : []),
    [events, stepIndex]
  );

  const activeNodeId = useMemo(() => {
    for (let i = visibleEvents.length - 1; i >= 0; i--) {
      const ev = visibleEvents[i];
      if ('nodeId' in ev) return (ev as any).nodeId as string;
    }
    return null;
  }, [visibleEvents]);

  const isDone = visibleEvents.some(e => e.type === 'done');

  const networkEntries = useMemo(
    () => visibleEvents.filter(e => e.type === 'network') as Extract<SimEvent, { type: 'network' }>[],
    [visibleEvents]
  );

  const allMocked = networkEntries.length > 0 && networkEntries.every(n => n.source === 'mock');
  const hasRealFetch = networkEntries.some(n => n.source === 'real');

  const terminalEntries = useMemo(
    () => visibleEvents.filter(e => e.type === 'log' || e.type === 'assertion' || e.type === 'system'),
    [visibleEvents]
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying && stepIndex < events.length - 1) {
      timer = setTimeout(() => setStepIndex(prev => prev + 1), 600);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events.length]);

  useLayoutEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    if (networkRef.current) networkRef.current.scrollTop = networkRef.current.scrollHeight;
  }, [terminalEntries, networkEntries]);

  const runTest = async () => {
    setIsRunning(true);
    setEvents([]);
    setStepIndex(-1);
    setIsPlaying(false);
    const newEvents = await runSimulation(code);
    setEvents(newEvents);
    setIsRunning(false);
    setStepIndex(0);
    setIsPlaying(true);
  };

  const loadPreset = (preset: 'mock' | 'nomock') => {
    setCode(preset === 'mock' ? WITH_MOCK_CODE : WITHOUT_MOCK_CODE);
    setEvents([]);
    setStepIndex(-1);
    setIsPlaying(false);
  };

  return (
    <div className={styles.container}>
      {/* Pipeline */}
      <div className={styles.pipeline}>
        {PIPELINE_NODES.map((node, i) => {
          const isActive = activeNodeId === node.id;
          const isFetchMock = node.id === 'fetchmock';
          const intercepted = isFetchMock && isDone && allMocked;
          const bypassed = isFetchMock && isDone && hasRealFetch;
          const nodeIdx = PIPELINE_NODES.findIndex(n => n.id === activeNodeId);
          return (
            <React.Fragment key={node.id}>
              <div className={[
                styles.pipelineNode,
                isActive ? styles.pipelineNodeActive : '',
                intercepted ? styles.pipelineNodeIntercepted : '',
                bypassed ? styles.pipelineNodeBypassed : '',
              ].filter(Boolean).join(' ')}>
                {node.label}
                {isActive && isFetchMock && (
                  <div className={styles.actionBubble}>intercepting</div>
                )}
                {intercepted && !isActive && (
                  <div className={styles.actionBubble}>✓ mocked</div>
                )}
                {bypassed && !isActive && (
                  <div className={`${styles.actionBubble} ${styles.actionBubbleNoMatch}`}>bypassed</div>
                )}
              </div>
              {i < PIPELINE_NODES.length - 1 && (
                <div className={`${styles.pipelineEdge} ${nodeIdx > i ? styles.pipelineEdgeActive : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Editor */}
      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <span>test.ts (Editable)</span>
          <div className={styles.editorActions}>
            <button
              className={styles.presetBtn}
              onClick={() => loadPreset('mock')}
              title="Laad voorbeeld met fetch mock"
            >
              Met mock
            </button>
            <button
              className={`${styles.presetBtn} ${styles.presetBtnReal}`}
              onClick={() => loadPreset('nomock')}
              title="Laad voorbeeld zonder fetch mock"
            >
              Zonder mock
            </button>
            <button
              className={styles.resetBtn}
              onClick={() => loadPreset('mock')}
            >
              Reset
            </button>
          </div>
        </div>
        <div className={styles.editorContent}>
          <Editor
            height="220px"
            path="file:///fetchmock-test.ts"
            language="typescript"
            theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
            value={code}
            onChange={(value) => {
              setCode(value || '');
              setEvents([]);
              setStepIndex(-1);
              setIsPlaying(false);
            }}
            beforeMount={(monaco) => {
              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: false,
              });
              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                allowNonTsExtensions: true,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                noEmit: true,
                allowJs: true,
              });
              monaco.languages.typescript.typescriptDefaults.addExtraLib(
                FETCH_MOCK_TYPES,
                'file:///fetchmock.d.ts'
              );
            }}
            options={{
              readOnly: isRunning || isPlaying,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              automaticLayout: true,
              padding: { top: 10, bottom: 10 },
            }}
          />
        </div>
        <div className={styles.runBar}>
          <button
            className={`${styles.runBtn} ${isRunning ? styles.runBtnLoading : ''}`}
            onClick={runTest}
            disabled={isRunning || isPlaying}
          >
            {isRunning
              ? '⏳ Uitvoeren...'
              : isDone
              ? '↺ Opnieuw uitvoeren'
              : '▶ Test uitvoeren'}
          </button>
        </div>
      </div>

      {/* Bottom panels */}
      <div className={styles.simulators}>
        {/* Terminal */}
        <div className={styles.console}>
          <div className={styles.consoleHeader}>Terminal</div>
          <div className={styles.content} ref={terminalRef}>
            {stepIndex === -1 && !isRunning && (
              <div className={styles.loadingText}>
                Druk op &ldquo;Test uitvoeren&rdquo; om te starten
              </div>
            )}
            {isRunning && stepIndex === -1 && (
              <div className={styles.loadingText}>
                <div className={styles.spinner}>
                  <div className={styles.loadingIcon} />
                  <div>Fetch uitvoeren...</div>
                </div>
              </div>
            )}
            {terminalEntries.map((entry, i) => {
              if (entry.type === 'system') {
                const e = entry as Extract<SimEvent, { type: 'system' }>;
                const isSuccess = e.text.includes('geslaagd');
                const isFail = e.text.includes('mislukt');
                return (
                  <div
                    key={i}
                    className={`${styles.logSystem} ${isSuccess ? styles.logSuccess : ''} ${isFail ? styles.logFail : ''}`}
                  >
                    {e.text}
                  </div>
                );
              }
              if (entry.type === 'log') {
                const e = entry as Extract<SimEvent, { type: 'log' }>;
                return (
                  <div key={i} className={`${styles.logLine} ${e.level === 'error' ? styles.logError : ''}`}>
                    &gt; {e.text}
                  </div>
                );
              }
              if (entry.type === 'assertion') {
                const e = entry as Extract<SimEvent, { type: 'assertion' }>;
                return (
                  <div key={i} className={`${styles.logLine} ${e.passed ? styles.assertPass : styles.assertFail}`}>
                    {e.passed ? '✓' : '✗'} {e.message}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Network Log */}
        <div className={styles.console}>
          <div className={styles.consoleHeader}>
            Network
            {networkEntries.length > 0 && (
              <span className={`${styles.networkSummary} ${allMocked ? styles.networkSummaryMock : styles.networkSummaryReal}`}>
                {allMocked ? '⚡ Alle requests gemocked' : '🌐 Echte fetch naar internet'}
              </span>
            )}
          </div>
          <div className={styles.content} ref={networkRef}>
            {networkEntries.length === 0 && stepIndex === -1 && (
              <div className={styles.loadingText}>Geen netwerkaanvragen</div>
            )}
            {networkEntries.map((entry, i) => {
              const short = entry.url.replace('https://jsonplaceholder.typicode.com', '');
              const isMock = entry.source === 'mock';
              let preview = '—';
              if (entry.data) {
                if (Array.isArray(entry.data)) {
                  const first = entry.data[0];
                  const titlePreview = first?.title
                    ? `"${first.title.slice(0, 18)}${first.title.length > 18 ? '…' : ''}"`
                    : '…';
                  preview = `[{title: ${titlePreview}}${entry.data.length > 1 ? ` +${entry.data.length - 1}` : ''}]`;
                } else {
                  preview = JSON.stringify(entry.data).slice(0, 60);
                }
              }
              return (
                <div key={i} className={styles.networkRow}>
                  <span className={`${styles.sourceBadge} ${isMock ? styles.sourceBadgeMock : styles.sourceBadgeReal}`}>
                    {isMock ? 'MOCK' : 'REAL'}
                  </span>
                  <span className={styles.networkMethod}>GET</span>
                  <span className={styles.networkUrl}>{short}</span>
                  <span className={`${styles.networkStatus} ${entry.status >= 400 ? styles.networkStatusError : ''}`}>
                    {entry.status || '—'}
                  </span>
                  <span className={styles.networkDuration}>{isMock ? '~0ms' : `${entry.duration}ms`}</span>
                  <span className={styles.networkPreview}>{preview}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withMaximize(InteractiveFetchMock);
