import AppError from "@shared/errors/AppError";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokenRepository from "../repositories/fakes/FakeUserTokenRepository";
import CreateUserService from "./CreateUserService";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";

let fakeUsersRepository: FakeUsersRepository;
let fakeEmailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe("SendForgotPasswordEmail", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeEmailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
      fakeUserTokenRepository
    );
  });

  it("should be able to recover the password using the email", async () => {
    const sendEmail = jest.spyOn(fakeEmailProvider, "sendEmail");

    await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    await sendForgotPasswordEmail.execute({
      email: "gabriel@gmail.com",
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it("should be able to recover a non-existing user password", async () => {
    const sendEmail = jest.spyOn(fakeEmailProvider, "sendEmail");

    await expect(
      sendForgotPasswordEmail.execute({
        email: "gabriel@gmail.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should generate a forgot password token", async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, "generate");

    await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    await sendForgotPasswordEmail.execute({
      email: "gabriel@gmail.com",
    });

    expect(generateToken).toHaveBeenCalled();
  });
});
