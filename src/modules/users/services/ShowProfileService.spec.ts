import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

import ShowProfileService from "./ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe("ShowProfileService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });
  it("should not be able to show the profile", async () => {
    const user = await fakeUsersRepository.create({
      name: "Gabriel",
      email: "gabriel@gmail.com",
      password: "123456",
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe("Gabriel");
    expect(profile.email).toBe("gabriel@gmail.com");
  });
  it("should not be able to show the profile", async () => {
    await expect(
      showProfileService.execute({
        user_id: "has-no-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
