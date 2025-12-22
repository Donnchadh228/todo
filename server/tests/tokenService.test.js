const jwt = require("jsonwebtoken");
const tokenService = require("../service/tokenService");
const { Token } = require("../models/indexModel.js");
const ApiError = require("../expectations/apiError");

jest.mock("../models/indexModel.js");
jest.mock("jsonwebtoken");

describe("Token test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should generate tokens", () => {
    jwt.sign = jest.fn().mockReturnValueOnce("mock-access-token").mockReturnValueOnce("mock-refresh-token");
    const payload = { userId: 42, email: "test@example.com" };
    const result = tokenService.generateToken(payload);

    expect(jwt.sign).toHaveBeenCalledTimes(2);

    expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.SECRETKEY, { expiresIn: process.env.ACCESS_TOKEN_TIME });
    expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.SECRETKEY_REFRESH, {
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });

    expect(result).toEqual({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    });
  });
  it("Should decode,create expiryDate and save token in db", async () => {
    const userId = 42;
    const refreshToken = "valid.refresh.token.here";

    // Мокаем jwt.decode — возвращаем объект с exp
    jwt.decode.mockReturnValue({
      exp: 1734633600,
      userId: 42,
      iat: 1734547200,
    });

    const expectedExpiryDate = new Date(1734633600 * 1000);

    const mockSavedToken = {
      id: 1,
      refreshToken,
      expiryDate: expectedExpiryDate,
      userId,
    };
    Token.create.mockResolvedValue(mockSavedToken);

    const result = await tokenService.saveToken(userId, refreshToken);

    expect(jwt.decode).toHaveBeenCalledTimes(1);
    expect(jwt.decode).toHaveBeenCalledWith(refreshToken);

    expect(Token.create).toHaveBeenCalledTimes(1);
    expect(Token.create).toHaveBeenCalledWith({
      refreshToken,
      expiryDate: expectedExpiryDate,
      userId,
    });

    expect(result).toEqual(mockSavedToken);
  });
});

describe("tokenService.removeToken", () => {
  it("should remove token from db", async () => {
    const id = 1;
    const refreshToken = "old.refresh.token";

    Token.destroy.mockResolvedValue(1);

    const result = await tokenService.removeToken(id, refreshToken);
    expect(Token.destroy).toHaveBeenCalledTimes(1);
    expect(Token.destroy).toHaveBeenCalledWith({
      where: { id, refreshToken },
    });

    expect(result).toBe(1);
  });

  it("should throw error", async () => {
    Token.destroy.mockResolvedValue(0);

    await expect(tokenService.removeToken(1, "some.token")).rejects.toThrow("Ошибка при удалении токена");

    await expect(tokenService.removeToken(1, "some.token")).rejects.toMatchObject({
      status: 400,
      message: "Ошибка при удалении токена",
    });
  });
});
