import { describe, expect, test } from "vitest";
import request from "supertest";
import { parse } from "node-html-parser";
import app from "./app.ts";

describe("GET /contact", () => {
    test("should return the contact form", async () => {
        const response = await request(app).get("/contact");
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector("form")).not.toBeNull();
    });
});

describe("POST /contact", () => {
    test("should show a success message when all fields are valid", async () => {
        const response = await request(app).post("/contact").send({
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            message: "Hello!",
            agree: "agree"
        });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        const success = root.querySelector(".success-message");
        expect(success?.text.trim()).toContain("Thank you for contacting us, John!");
        expect(success?.text.trim()).toContain("john@example.com");
    });

    test("should show an error when terms and conditions are not accepted", async () => {
        const response = await request(app).post("/contact").send({
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            message: "Hello!"
        });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector(".error-message")?.text.trim()).toBe("You must agree to the terms and conditions");
    });

    test("should show an error when firstname is empty", async () => {
        const response = await request(app).post("/contact").send({
            firstname: "",
            lastname: "Doe",
            email: "john@example.com",
            message: "Hello!",
            agree: "agree"
        });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector(".error-message")?.text.trim()).toBe("First name cannot be empty!");
    });

    test("should show an error when message is empty", async () => {
        const response = await request(app).post("/contact").send({
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            message: "",
            agree: "agree"
        });
        expect(response.status).toBe(200);
        const root = parse(response.text);
        expect(root.querySelector(".error-message")?.text.trim()).toBe("Message cannot be empty!");
    });
});
