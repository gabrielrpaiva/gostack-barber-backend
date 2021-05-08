import User from "@modules/users/infra/typeorm/entities/User";
import ICreateuserDTO from "@modules/users/dtos/ICreateuserDTO";

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateuserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
