import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authUser: AuthenticateUserService;
let createUser: CreateUserService;

describe("AuthenticateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  it("should be able to authenticate user", async () => {
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
    expect(
      authUser.execute({
        email: "sandra@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
