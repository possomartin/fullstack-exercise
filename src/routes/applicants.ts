import express, { Router, Request, Response } from "express";
import applicantService from "../db/services/applicantService.js";
import { Applicant } from "../db/types/applicant.js";

const applicantRouter: Router = express.Router();
const {
  getApplicant,
  getAllApplicants,
  createApplicant,
  updateApplicant,
  deleteApplicant,
} = applicantService;

applicantRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const foundApplicant = await getApplicant(id);

  if (!!foundApplicant) {
    res.status(200).send(foundApplicant);
  } else {
    res.status(400).json({
      success: false,
      msg: "Could not find any applicant with the give id",
    });
  }
});

applicantRouter.get("/", async (req: Request, res: Response) => {
  const foundApplicants = await getAllApplicants();

  if (!!foundApplicants && foundApplicants.length != 0) {
    res.status(200).send(foundApplicants);
  } else {
    res.status(400).json({ success: false, msg: "There are no applicants" });
  }
});

applicantRouter.post("/", async (req: Request, res: Response) => {
  const applicant: Omit<Applicant, "id"> = {
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    address: { ...req.body.address },
  };

  const applicantCreated = await createApplicant(applicant);

  if (!!applicantCreated) {
    res
      .status(200)
      .json({ success: true, msg: "Applicant Created Successfully!" });
  } else {
    res.status(400).json({
      success: false,
      msg: "Could not create applicant :(",
    });
  }
});

applicantRouter.patch("/", async (req: Request, res: Response) => {
  const applicant: Partial<Applicant> = {
    ...req.body,
  };

  const updatedApplicant = updateApplicant(applicant);

  if (!!updatedApplicant) {
    res
      .status(200)
      .json({ success: true, msg: "Applicant updated Successfully!" });
  } else {
    res.status(400).json({
      success: false,
      msg: "Could not update applicant :(",
    });
  }
});

applicantRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deletedApplicant = deleteApplicant(id);

  if (!!deleteApplicant) {
    res
      .status(200)
      .json({ success: true, msg: "Applicant deleted Successfully!" });
  } else {
    res.status(400).json({
      success: false,
      msg: "Could not delete applicant :(",
    });
  }
});

export default applicantRouter;
