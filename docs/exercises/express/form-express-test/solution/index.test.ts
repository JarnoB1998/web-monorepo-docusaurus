import { describe, expect, it } from "vitest";
import { parse } from "node-html-parser";
import app from "./app.ts";
import request from "supertest";

describe("POST /", () => {
    it("should return the correct age if day is after birthday", async () => {
        const response = await request(app).post("/").send({ birthdate: "1984-12-13", today: "2000-12-14" });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        const message = root.querySelector("#message");
        if (message) { 
            expect(message.text).toBe("You were 16 years old on 14-12-2000");
        }
    });

    it("should return the correct age if day is before birthday", async () => {
        const response = await request(app).post("/").send({ birthdate: "1984-12-13", today: "2000-12-12" });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        const message = root.querySelector("#message");
        if (message) { 
            expect(message.text).toBe("You were 15 years old on 12-12-2000");
        }
    });

    it("should return 0 on your birth date", async () => {
        const response = await request(app).post("/").send({ birthdate: "1984-12-13", today: "1984-12-13" });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        const message = root.querySelector("#message");
        if (message) { 
            expect(message.text).toBe("You were 0 years old on 13-12-1984");
        }
    });
});