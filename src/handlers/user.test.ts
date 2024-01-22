import * as user from "./user";

describe("user handler", () => {
  // run against a local DATABASE
  // beforeEach, afterEach, => delete the upd to the DB
  it("should create a new user", async () => {
    const req = { body: { username: "hello", password: "hi" } };

    const res = {
      json({ token }) {
        expect(token).toBeTruthy();
      },
    };

    // spy look up spy

    const newUser = await user.createNewUser(req as any, res as any, () => {});
  });
});
