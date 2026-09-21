import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "./index.ts";
import * as data from "./data.ts";
import { type Song, type User } from "./types.ts";

vi.mock("./data.ts");

const mockGetSongs = vi.mocked(data.getSongs);
const mockGetCurrentUser = vi.mocked(data.getCurrentUser);
const mockGetSongById = vi.mocked(data.getSongById);
const mockBuySong = vi.mocked(data.buySong);
const mockAddCredits = vi.mocked(data.addCredits);

const mockSong: Song = {
    id: 1,
    title: "Test Song",
    description: "Test Description",
    credits: 100,
    thumbnail: "http://example.com/thumb.jpg",
    mp3: "http://example.com/song.mp3",
    owned: false,
    more_information: {
        publish_date: "2025-01-01",
        genre: "Rock",
        type: "Music Video",
        youtube: "http://youtube.com",
    },
};

const mockUser: User = { credits: 200, owned: [] };

beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue(mockUser);
    mockGetSongs.mockResolvedValue([mockSong]);
    mockGetSongById.mockResolvedValue(mockSong);
    mockBuySong.mockResolvedValue(undefined);
    mockAddCredits.mockResolvedValue(mockUser);
});

describe("GET /", () => {
    it("redirects to /songs", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/songs");
    });
});

describe("GET /songs", () => {
    it("renders songs with default params", async () => {
        const res = await request(app).get("/songs");
        expect(res.status).toBe(200);
        expect(mockGetSongs).toHaveBeenCalledWith("", "title", "asc");
    });

    it("renders songs with search query", async () => {
        const res = await request(app).get("/songs?q=test");
        expect(res.status).toBe(200);
        expect(mockGetSongs).toHaveBeenCalledWith("test", "title", "asc");
    });

    it("renders songs sorted by owned descending", async () => {
        const res = await request(app).get("/songs?sortField=owned&sortDirection=desc");
        expect(res.status).toBe(200);
        expect(mockGetSongs).toHaveBeenCalledWith("", "owned", "desc");
    });

    it("renders songs sorted by publish_date", async () => {
        const res = await request(app).get("/songs?sortField=publish_date");
        expect(res.status).toBe(200);
        expect(mockGetSongs).toHaveBeenCalledWith("", "publish_date", "asc");
    });

    it("returns 400 for invalid sortField", async () => {
        const res = await request(app).get("/songs?sortField=invalid");
        expect(res.status).toBe(400);
        expect(res.text).toBe("Invalid sort field");
    });

    it("returns 400 for invalid sortDirection", async () => {
        const res = await request(app).get("/songs?sortDirection=invalid");
        expect(res.status).toBe(400);
        expect(res.text).toBe("Invalid sort direction");
    });
});

describe("GET /songs/:id", () => {
    it("renders song page when song is found", async () => {
        const res = await request(app).get("/songs/1");
        expect(res.status).toBe(200);
        expect(mockGetSongById).toHaveBeenCalledWith(1);
    });

    it("renders 404 page when song is not found", async () => {
        mockGetSongById.mockResolvedValue(undefined);
        const res = await request(app).get("/songs/999");
        expect(res.status).toBe(404);
    });
});

describe("GET /billing", () => {
    it("renders billing page with empty error", async () => {
        const res = await request(app).get("/billing");
        expect(res.status).toBe(200);
    });
});

describe("POST /billing", () => {
    it("adds credits and redirects to /songs on valid input", async () => {
        const res = await request(app)
            .post("/billing")
            .send("amount=50")
            .set("Content-Type", "application/x-www-form-urlencoded");
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/songs");
        expect(mockAddCredits).toHaveBeenCalledWith(50);
    });

    it("renders billing with error when amount is NaN", async () => {
        const res = await request(app)
            .post("/billing")
            .send("amount=abc")
            .set("Content-Type", "application/x-www-form-urlencoded");
        expect(res.status).toBe(200);
        expect(res.text).toContain("Amount should be a positive number");
    });

    it("renders billing with error when amount is zero", async () => {
        const res = await request(app)
            .post("/billing")
            .send("amount=0")
            .set("Content-Type", "application/x-www-form-urlencoded");
        expect(res.status).toBe(200);
        expect(res.text).toContain("Amount should be a positive number");
    });

    it("renders billing with error when amount is negative", async () => {
        const res = await request(app)
            .post("/billing")
            .send("amount=-5")
            .set("Content-Type", "application/x-www-form-urlencoded");
        expect(res.status).toBe(200);
        expect(res.text).toContain("Amount should be a positive number");
    });

    it("renders billing with error when addCredits throws", async () => {
        mockAddCredits.mockRejectedValue(new Error("Credits error"));
        const res = await request(app)
            .post("/billing")
            .send("amount=100")
            .set("Content-Type", "application/x-www-form-urlencoded");
        expect(res.status).toBe(200);
        expect(res.text).toContain("Credits error");
    });
});

describe("POST /buy", () => {
    it("buys song and redirects to /songs on valid id", async () => {
        const res = await request(app)
            .post("/buy")
            .send("id=1")
            .set("Content-Type", "application/x-www-form-urlencoded");
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/songs");
        expect(mockBuySong).toHaveBeenCalledWith(1);
    });

    it("renders billing with error when id is not a number", async () => {
        const res = await request(app)
            .post("/buy")
            .send("id=abc")
            .set("Content-Type", "application/x-www-form-urlencoded");
        expect(res.status).toBe(200);
        expect(res.text).toContain("Id must be a number");
    });

    it("renders billing with error when buySong throws", async () => {
        mockBuySong.mockRejectedValue(new Error("Not enough coins"));
        const res = await request(app)
            .post("/buy")
            .send("id=1")
            .set("Content-Type", "application/x-www-form-urlencoded");
        expect(res.status).toBe(200);
        expect(res.text).toContain("Not enough coins");
    });
});
