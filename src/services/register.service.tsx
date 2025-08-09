import axios from 'axios';
import type { RegisterInterface } from '../interfaces/register.interface';

export const register = async (request: RegisterInterface) =>
  await axios
    .post('/register', request)
    .then((res) => res.data)
    .catch((err) => err);
