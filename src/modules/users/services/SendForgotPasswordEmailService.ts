import path from "path";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import User from "@modules/users/infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import IUserTokensRepository from "../repositories/IUserTokenRepository";

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("UsersTokensRepository")
    private userTokenRepository: IUserTokensRepository
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User does not exists");
    }

    const { token } = await this.userTokenRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      "../views",
      "forgot_password.hbs"
    );

    await this.mailProvider.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: "[GoBarber] Recuperação de senha",
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3300/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
