import axios from "axios";

export const getAdminUsers = async () =>
  await axios
    .get("/admin/users")
    .then((res) => res)
    .catch((err) => err);

export const adminEditUser = async (userId: any, user: any) =>   
  await axios
    .put(`/admin/users/${userId}`, user)
    .then((res) => res)
    .catch((err) => err);

export const adminCreateUser = async (user: any) =>
  await axios
    .post("/admin/users", user)
    .then((res) => res)
    .catch((err) => err);

export const adminDeleteUser = async (user: any) =>
  await axios
    .delete(`/admin/users/${user.id}`)
    .then((res) => res)
    .catch((err) => err);

export const adminCreateClasses = async (request: any) =>
  await axios
    .post("/admin/classes", request)
    .then((res) => res)
    .catch((err) => err);
