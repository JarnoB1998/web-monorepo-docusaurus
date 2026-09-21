import { describe, expect, test } from "vitest";
import request from "supertest";
import { parse } from "node-html-parser";
import app from "./app.ts";

describe("GET /", () => {
    test("should return the pet shelter form", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector("form")).not.toBeNull();
    });

    test("should have a name input field", async () => {
        const response = await request(app).get("/");
        const root = parse(response.text);
        expect(root.querySelector("input[name='name']")).not.toBeNull();
    });

    test("should have a dropdown with dog, cat and rabbit options", async () => {
        const response = await request(app).get("/");
        const root = parse(response.text);
        const select = root.querySelector("select[name='animal']");
        expect(select).not.toBeNull();
        expect(select?.querySelector("option[value='dog']")).not.toBeNull();
        expect(select?.querySelector("option[value='cat']")).not.toBeNull();
        expect(select?.querySelector("option[value='rabbit']")).not.toBeNull();
    });
});

describe("POST /", () => {
    test("should return a page with the user's name and chosen animal", async () => {
        const response = await request(app).post("/").send({ name: "John", animal: "cat" });
        expect(response.status).toBe(200);
        expect(response.text).toContain("John");
        expect(response.text).toContain("cat");
    });

    test("should work for all three animal types", async () => {
        for (const animal of ["dog", "cat", "rabbit"]) {
            const response = await request(app).post("/").send({ name: "Jane", animal });
            expect(response.status).toBe(200);
            expect(response.text).toContain("Jane");
            expect(response.text).toContain(animal);
        }
    });

    test("should include an image in the response", async () => {
        const response = await request(app).post("/").send({ name: "John", animal: "dog" });
        const root = parse(response.text);
        expect(root.querySelector("img")).not.toBeNull();
    });
});
