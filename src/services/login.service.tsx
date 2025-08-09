import axios from "axios";
import type { LoginInterface } from "../interfaces/login.interface";

export const login = async (request: LoginInterface) =>
  await axios
    .post("/auth/login", request)
    .then((res) => res.data)
    .catch((err) => err);
