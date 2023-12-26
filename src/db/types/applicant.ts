export type Address = {
  id: number;
  city: string;
  country: string;
  zipcode: number;
};

export type Applicant = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  address: Address;
};

export type ApplicantService = {
  getApplicant: (id: number) => Promise<Applicant | void>;
  getAllApplicants: () => Promise<Applicant[] | void>;
  createApplicant: (
    applicant: Omit<Applicant, "id">
  ) => Promise<Applicant | void>;
  updateApplicant: (applicant: Partial<Applicant>) => Promise<Applicant | void>;
  deleteApplicant: (id: number) => Promise<Applicant | void>;
};
