import AppError from "@shared/errors/AppError";
import FakeStorageProvider from "@shared/providers/StorageProvider/fakes/FakeStorageProvider";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

describe("UpdateUserAvatar", () => {
  it("should be able to create new avatar for user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: "avatar.jpeg",
    });

    expect(user.avatar).toBe("avatar.jpeg");
  });

  it("should not be able to create new avatar for user not logged in", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    expect(
      updateUserAvatar.execute({
        user_id: "1",
        avatarFileName: "avatar.jpeg",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should delete older avatar and crete a new one", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: "avatar.jpeg",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: "avatar2.jpeg",
    });
    expect(deleteFile).toHaveBeenCalledWith("avatar.jpeg");
    expect(user.avatar).toBe("avatar2.jpeg");
  });
});
