import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";

describe("AuthenticateUser", () => {
  it("should be able to authenticate user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    const response = await authUser.execute({
      email: "gabriel@gmail.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able to authenticate user with wrong password", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    expect(
      authUser.execute({
        email: "gabriel@gmail.com",
        password: "123458",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate user when user not exist", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    expect(
      authUser.execute({
        email: "sandra@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
