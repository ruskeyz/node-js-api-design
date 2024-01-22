import app from "../server";
import supertest from "supertest";

describe("GET /", () => {
  it("should send a data with 200 status", async () => {
    const res = await supertest(app).get("/");

    expect(res.body.message).toBe("hello");
  });
});
