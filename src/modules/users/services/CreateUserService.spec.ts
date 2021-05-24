import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe("CreateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  it("should be able to create new user", async () => {
    const user = await createUser.execute({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe("gabriel@gmail.com");
  });

  it("should not be able to create new user with the same email", async () => {
    const userEmail = "gabriel@gmail.com";

    await createUser.execute({
      name: "Gabriel",
      email: userEmail,
      password: "123456",
    });

    await expect(
      createUser.execute({
        name: "Gabriel",
        email: userEmail,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
