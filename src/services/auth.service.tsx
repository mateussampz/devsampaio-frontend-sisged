import { getAuth } from "firebase/auth";

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("user") !== null && localStorage.getItem("accessToken") !== null;
};

export const logout = async () => {
  await getAuth()
    .signOut()
    .then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      return;
    })
    .catch((error) => {
      console.log("Error on logout", error);
    });
};
