import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Export Interfaces — verificatie', () => {
    beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));
    afterEach(() => { vi.restoreAllMocks(); vi.resetModules(); });

    it('plaatst de interface in types.ts', () => {
        expect(readFileSync('./types.ts', 'utf8')).toMatch(/export\s+interface\s+Student\b/);
    });
    it('declareert de interface niet opnieuw in het gebruiksbestand', () => {
        expect(readFileSync('./index.ts', 'utf8')).not.toMatch(/interface\s+Student\b/);
    });
    it('importeert de interface expliciet als type', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/import\s+type\s*{\s*Student\s*}\s*from\s*['"]\.\/types\.ts['"]/);
    });
    it('gebruikt de geïmporteerde interface als type', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/:\s*Student\s*=/);
    });
    it('blijft uitvoerbare code bevatten die de getypeerde data gebruikt', async () => {
        await import('./index.ts'); expect(console.log).toHaveBeenCalledWith('Alice is 20 years old.');
    });
});
