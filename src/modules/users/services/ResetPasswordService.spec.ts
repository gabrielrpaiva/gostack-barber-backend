import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokenRepository from "../repositories/fakes/FakeUserTokenRepository";

import ResetPasswordService from "./ResetPasswordService";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHasProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe("ResetPassword", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHasProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHasProvider
    );
  });

  it("should be able to reset the password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "112222",
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const generateHash = await jest.spyOn(fakeHasProvider, "generateHash");

    await resetPasswordService.execute({
      password: "123456",
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith("123456");
    expect(updatedUser?.password).toBe("123456");
  });

  it("should not be able to reset the password with non-existing token", async () => {
    await expect(
      resetPasswordService.execute({
        token: "non-existing-token",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password with non-existing user", async () => {
    const { token } = await fakeUserTokenRepository.generate(
      "non-existing-user"
    );
    await expect(
      resetPasswordService.execute({
        token,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password if past more then 2 hours", async () => {
    const user = await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "112222",
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: "123456",
        token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
