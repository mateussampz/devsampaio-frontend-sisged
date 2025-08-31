import axios from "axios";

export const getAdminClasses = async () =>
  await axios
    .get("/admin/classes")
    .then((res) => res)
    .catch((err) => err);

export const adminEditClass = async (classId: any, payload: any) =>
  await axios
    .put(`/admin/classes/${classId}`, payload)
    .then((res) => res)
    .catch((err) => err);

export const adminCreateClass = async (request: any) =>
  await axios
    .post("/admin/classes", request)
    .then((res) => res)
    .catch((err) => err);

export const adminDeleteClass = async (classId: any) =>
  await axios
    .delete(`/admin/classes/${classId}`)
    .then((res) => res)
    .catch((err) => err);

