import dbConnection from "../../config/connection.js";
import { Applicant, Address, ApplicantService } from "../types/applicant.js";

const getApplicant = async (id: number): Promise<Applicant | void> => {
  const client = await dbConnection.connect();

  const query = await client.query(
    `SELECT * FROM public."Applicant" Ap INNER JOIN public."Address" AD ON Ap.address = AD.id where Ap.id=$1`,
    [id]
  );

  return query.rows[0];
};

const getAllApplicants = async (): Promise<Applicant[] | void> => {
  const client = await dbConnection.connect();

  const query = await client.query(
    `SELECT * FROM public."Applicant" Ap INNER JOIN public."Address" Ad ON Ad.id = Ap.address`
  );

  const applicants = query.rows;

  if (!!applicants) return applicants;

  return;
};

const createApplicant = async (
  applicant: Omit<Applicant, "id">
): Promise<Applicant | void> => {
  const client = await dbConnection.connect();

  const queryAdd = await client.query(
    `INSERT INTO public."Address"(city, country, zipcode) VALUES ($1, $2, $3) RETURNING *`,
    [
      applicant.address.city,
      applicant.address.country,
      applicant.address.zipcode,
    ]
  );
  const address = queryAdd.rows[0];

  const query = await client.query(
    `INSERT INTO public."Applicant"(name, lastname, email, address) VALUES ($1, $2, $3, $4) RETURNING *`,
    [applicant.name, applicant.lastname, applicant.email, address.id]
  );

  const res = query.rows[0];

  if (!!res) return res;

  return;
};

const updateApplicant = async (
  applicant: Partial<Applicant>
): Promise<Applicant | void> => {
  const client = await dbConnection.connect();
  const entries = Object.entries(applicant).filter(
    ([key, value]) => key !== "id"
  );
  const updatedValues = entries.map(([key, value]) => `${key} = '${value}'`);

  const query = await client.query(
    `UPDATE public."Applicant" SET ${updatedValues.join(
      ","
    )} WHERE id=$1 RETURNING *`,
    [applicant.id]
  );
  const res = query.rows[0];

  if (!!res) return res;

  return;
};

const deleteApplicant = async (id: number): Promise<Applicant | void> => {
  const client = await dbConnection.connect();

  const query = await client.query(
    `DELETE FROM public."Applicant" WHERE id=$1`,
    [id]
  );

  const deletedApplicant = query.rows[0];

  if (!!deletedApplicant) return deletedApplicant;

  return;
};

const applicantService: ApplicantService = {
  getApplicant: getApplicant,
  getAllApplicants: getAllApplicants,
  createApplicant: createApplicant,
  updateApplicant: updateApplicant,
  deleteApplicant: deleteApplicant,
};

export default applicantService;
