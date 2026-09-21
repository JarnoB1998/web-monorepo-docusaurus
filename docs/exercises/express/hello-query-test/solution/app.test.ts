import { describe, expect, test } from "vitest";
import request from "supertest";
import { parse } from "node-html-parser";
import app from "./app.ts";

describe("GET /", () => {
    test("should return Hello World! for language=en", async () => {
        const response = await request(app).get("/").query({ language: "en" });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector("h1")?.text).toBe("Hello World!");
    });

    test("should return ¡Hola Mundo! for language=es", async () => {
        const response = await request(app).get("/").query({ language: "es" });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector("h1")?.text).toBe("¡Hola Mundo!");
    });

    test("should return Bonjour le monde! for language=fr", async () => {
        const response = await request(app).get("/").query({ language: "fr" });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector("h1")?.text).toBe("Bonjour le monde!");
    });

    test("should default to Hello World! for an unknown language", async () => {
        const response = await request(app).get("/").query({ language: "de" });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector("h1")?.text).toBe("Hello World!");
    });

    test("should default to Hello World! when no language is provided", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector("h1")?.text).toBe("Hello World!");
    });
});
