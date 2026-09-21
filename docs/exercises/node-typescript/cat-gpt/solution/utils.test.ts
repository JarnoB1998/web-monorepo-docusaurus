import { describe, expect, test } from "vitest";
import { repeatWords } from "./utils.ts";

describe("repeatWords", () => {
    test("herhaalt het woord het juiste aantal keer", () => {
        expect(repeatWords("Meow", 3, " ").split(" ").length).toBe(3);
    });

    test("plaatst de delimiter correct tussen de woorden", () => {
        expect(repeatWords("Meow", 3, "-")).toBe("Meow-Meow-Meow");
    });

    test("geeft bij times 1 enkel het woord terug zonder delimiter", () => {
        expect(repeatWords("Meow", 1, " ")).toBe("Meow");
    });
});
