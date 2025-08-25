import axios from "axios";

export const getAllInstructors = async () =>   
  await axios
    .get(`/consultations/instructors`)
    .then((res) => res)
    .catch((err) => err);

export const filterInstructors = async (request: any) =>
  await axios
    .post(`/consultations/instructors`, request)
    .then((res) => res)
    .catch((err) => err);