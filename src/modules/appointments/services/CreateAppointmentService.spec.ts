import AppError from "@shared/errors/AppError";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe("CreateAppointment", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to create new appointment", async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: "12542263654",
    });

    expect(appointment).toHaveProperty("id");
    expect(appointment.provider_id).toBe("12542263654");
  });

  it("should not be able to create new appointment with the same date", async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );

    const appointmentDate = new Date(2021, 4, 10, 11);

    const appointment = await createAppointment.execute({
      date: appointmentDate,
      provider_id: "12542263654",
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: "12542263654",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
