import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });
  it("should be able to update the profile", async () => {
    const user = await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: "Ana",
      email: "ana@gmail.com",
    });

    expect(updatedUser.name).toBe("Ana");
    expect(updatedUser.email).toBe("ana@gmail.com");
  });

  it("should be able to change to another user email", async () => {
    await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    const user = await fakeUsersRepository.create({
      name: "Ana",
      email: "ana@gmail.com",
      password: "123456",
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: "Ana",
        email: "gabriel@gmail.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update the password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: "Ana",
      email: "ana@gmail.com",
      old_password: "123456",
      password: "55555",
    });

    expect(updatedUser.password).toBe("55555");
  });

  it("should not be able to update the password without old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: "Gabriel",
        email: "gabriel@gmail.com",
        password: "55555",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the password with wrong password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: "Gabriel",
        email: "gabriel@gmail.com",
        old_password: "123457",
        password: "55555",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the profile from non-existing user", async () => {
    await expect(
      updateProfileService.execute({
        user_id: "has-no-id",
        name: "Gabriel",
        email: "gabriel@gmail.com",
        old_password: "123457",
        password: "55555",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
