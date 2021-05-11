import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";

describe("CreateUser", () => {
  it("should be able to create new user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe("gabriel@gmail.com");
  });

  it("should not be able to create new user with the same email", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createuser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const userEmail = "gabriel@gmail.com";

    const appointment = await createuser.execute({
      name: "Gabriel",
      email: userEmail,
      password: "123456",
    });

    expect(
      createuser.execute({
        name: "Gabriel",
        email: userEmail,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
