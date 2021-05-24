import User from "@modules/users/infra/typeorm/entities/User";

import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

interface Request {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User not found");
    }

    const userByEmail = await this.usersRepository.findByEmail(email);

    if (userByEmail && userByEmail.id !== user_id) {
      throw new AppError("This email is already in use");
    }

    user.name = name;
    user.email = email;

    if (password) {
      if (!old_password) {
        throw new AppError(
          "You need to inform the current password to change to a new one!"
        );
      }
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );

      if (!checkOldPassword) {
        throw new AppError("The current password is incorrect!");
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
