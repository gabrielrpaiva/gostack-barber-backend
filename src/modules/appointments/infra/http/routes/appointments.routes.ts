import { Router, request, response } from "express";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import AppointmentsController from "../controllers/AppointmentsController";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

const appointmentsController = new AppointmentsController();

/* appointmentsRouter.get("/", async (request, response) => {  
  
  const appointments = await appointmentRepository.find();

  return response.json(appointments);
}); */

appointmentsRouter.post("/", appointmentsController.crate);

export default appointmentsRouter;
