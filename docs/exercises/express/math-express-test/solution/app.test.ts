import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "./app.ts";

describe("POST /sum", () => {
    test("should calculate sum of two numbers", async () => {
        const response = await request(app)
            .post("/sum")
            .send({ a: "5", b: "3" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ result: 8 });
    });

    test("should return an error if a non-number is passed", async () => {
        const response = await request(app)
            .post("/sum")
            .send({ a: "five", b: "3" });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Query parameter a is not a number");
    });

    test("should return an error if a parameter is missing", async () => {
        const response = await request(app)
            .post("/sum")
            .send({ a: "5" });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Query parameter b is a mandatory field");
    });
});

describe("GET /sum", () => {
    test("should calculate sum of two numbers", async () => {
        const response = await request(app)
            .get("/sum")
            .query({ a: "5", b: "3" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ result: 8 });
    });

    test("should return an error if a non-number is passed", async () => {
        const response = await request(app)
            .get("/sum")
            .query({ a: "five", b: "3" });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Query parameter a is not a number");
    });

    test("should return an error if a parameter is missing", async () => {
        const response = await request(app)
            .get("/sum")
            .query({ a: "5" });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Query parameter b is a mandatory field");
    });
});