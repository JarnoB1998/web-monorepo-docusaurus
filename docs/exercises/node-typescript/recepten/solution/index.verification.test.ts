import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function runProgram() {
    await import('./index.ts');
    return vi.mocked(console.log).mock.calls.map(([x]) => String(x));
}

describe('Recepten — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('definieert een Ingredient-interface met naam, hoeveelheid en prijs', () => {
        const source = readFileSync('./index.ts', 'utf8');
        expect(source).toMatch(/interface\s+Ingredient\s*{[\s\S]*naam\s*:\s*string[\s\S]*hoeveelheid\s*:\s*string[\s\S]*prijs\s*:\s*number/);
    });
    it('definieert een Recept-interface met alle vereiste properties', () => {
        const source = readFileSync('./index.ts', 'utf8');
        expect(source).toMatch(/interface\s+Recept\s*{[\s\S]*naam\s*:\s*string[\s\S]*beschrijving\s*:\s*string[\s\S]*personen\s*:\s*number[\s\S]*ingredienten\s*:\s*Ingredient\[\]/);
    });
    it('maakt en toont een lasagnerecept', async () => {
        const output = await runProgram();
        expect(output).toContain('Recept: Lasagne');
        expect(output).toContain('Beschrijving: Lekkere lasagne');
        expect(output).toContain('Personen: 4');
    });
    it('toont de ingrediënten van het recept', async () => {
        const output = await runProgram();
        expect(output).toContain('Ingredienten:');
        expect(output.filter((line) => line.startsWith('- '))).toHaveLength(4);
    });
    it('berekent en toont de som van alle ingrediëntenprijzen', async () => {
        expect(await runProgram()).toContain('Totale kostprijs: 10 euro');
    });
});
