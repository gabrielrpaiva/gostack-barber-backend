import User from "@modules/users/infra/typeorm/entities/User";
import path from "path";
import uploadConfig from "@config/upload";
import fs from "fs";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import IStoregeProvider from "@shared/container/providers/StorageProvider/models/IStoregeProvider";

interface Request {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StorageProvider")
    private storegeProvider: IStoregeProvider
  ) {}

  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Oly authenticated users can change avatar", 401);
    }

    if (user.avatar) {
      await this.storegeProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storegeProvider.saveFile(avatarFileName);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
