import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const colors = [{ r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0 }, { r: 0, g: 0, b: 255 }];
const rainbowMock = vi.hoisted(() => vi.fn(() => [
    { r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0 }, { r: 0, g: 0, b: 255 }
]));
const bgRgbMock = vi.hoisted(() => vi.fn((r: number, g: number, b: number) => (text: string) => `${r},${g},${b}:${text}`));
vi.mock('rainbow-colors-array-ts', () => ({ rainbow: rainbowMock }));
vi.mock('chalk', () => ({ default: { bgRgb: bgRgbMock } }));

let originalRows: PropertyDescriptor | undefined;
let originalColumns: PropertyDescriptor | undefined;

describe('Rainbow Chalk — verificatie', () => {
    beforeEach(() => {
        vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {});
        originalRows = Object.getOwnPropertyDescriptor(process.stdout, 'rows');
        originalColumns = Object.getOwnPropertyDescriptor(process.stdout, 'columns');
        Object.defineProperty(process.stdout, 'rows', { configurable: true, value: 3 });
        Object.defineProperty(process.stdout, 'columns', { configurable: true, value: 5 });
    });
    afterEach(() => {
        if (originalRows) Object.defineProperty(process.stdout, 'rows', originalRows);
        else Reflect.deleteProperty(process.stdout, 'rows');
        if (originalColumns) Object.defineProperty(process.stdout, 'columns', originalColumns);
        else Reflect.deleteProperty(process.stdout, 'columns');
        vi.restoreAllMocks();
    });

    it('genereert één RGB-kleur per terminalrij', async () => {
        await import('./index.ts'); expect(rainbowMock).toHaveBeenCalledWith(3, 'rgb');
    });
    it('gebruikt iedere RGB-kleur als achtergrondkleur', async () => {
        await import('./index.ts');
        expect(bgRgbMock.mock.calls).toEqual([[255, 0, 0], [0, 255, 0], [0, 0, 255]]);
    });
    it('maakt elke gekleurde regel even breed als de terminal', async () => {
        await import('./index.ts');
        expect(vi.mocked(console.log).mock.calls.map(([value]) => String(value))).toEqual([
            '255,0,0:     ', '0,255,0:     ', '0,0,255:     '
        ]);
    });
    it('print één regel voor elke gegenereerde kleur', async () => {
        await import('./index.ts'); expect(console.log).toHaveBeenCalledTimes(colors.length);
    });
});
