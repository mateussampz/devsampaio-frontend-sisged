import { useState } from "react";
import { useFormik } from "formik";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { login } from "../../services/login.service";
import type { LoginInterface } from "../../interfaces/login.interface";

const LoginView = () => {
  const navigate = useNavigate();

  const requestJWT = async ({ uid, email }: LoginInterface) => {
    const response = await login({ uid, email });

    if (response instanceof Error && response.message !== "OK") {
      console.error("Error getting content", response);
      return false;
    }

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("user", JSON.stringify(response.profile));
    return true;
  };

  const [loadingAuth, setLoadingAuth] = useState(false);

  const formAuthenticationInitialValues: { email: string; password: string } = {
    email: "",
    password: "",
  };

  const formikAuthentication = useFormik({
    initialValues: formAuthenticationInitialValues,
    validationSchema: yup.object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    }),
    onSubmit: (values) => {
      const auth = getAuth();
      setLoadingAuth(true);

      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async (result) => {
          const { uid, email } = result.user;

          const responseRequestJwt = await requestJWT({ uid, email });
          if (responseRequestJwt) {
            setLoadingAuth(false);
            navigate("/panel/");
            return;
          }

          setLoadingAuth(false);
          console.error("Error requesting JWT");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage: string = error.message;
          console.error("Error Email or Password SignIn", errorCode, errorMessage);
          setLoadingAuth(false);
        });
    },
  });

  return (<> 
    <div className="LoginView mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-3">
          <div className="text-center">
            <img
              src="../../../public/assets/logo-2-sesi-senai.png"
              alt="SISGED"
              className="img-fluid"
              style={{ width: "400px" }}
            />
          </div>

          <div className="card bg-white shadow-sm rounded-3 border-0">
            <div className="card-body">
              <div className="text-center">
                <p>
                  <strong>Entrar</strong>
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  formikAuthentication.handleSubmit();
                }}
              >
                <div className="form-group mb-2">
                  <input
                    type="email"
                    name="email"
                    disabled={loadingAuth}
                    placeholder="Digite seu email"
                    autoComplete="off"
                    className="form-control"
                    onChange={formikAuthentication.handleChange}
                    value={formikAuthentication.values.email}
                  />
                </div>
                <div className="form-group mb-4">
                  <input
                    type="password"
                    name="password"
                    disabled={loadingAuth}
                    placeholder="Digite sua senha"
                    autoComplete="off"
                    className="form-control"
                    onChange={formikAuthentication.handleChange}
                    value={formikAuthentication.values.password}
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loadingAuth || !formikAuthentication.isValid}
                  >
                    {!loadingAuth && <i className="fas fa-sign-in-alt me-2"></i>}
                    Entrar
                  </button>
                </div>
              </form>

              <div className="text-center">
                <small className="text-muted">
                  - ou -
                </small>
              </div>

              <div className="d-grid">
                <Link to="/signup" className="btn btn-outline-primary"> 
                  Crie sua conta
                </Link>

                <div className="d-grid">
                  <Link to="/recoverPassword" className="btn btn-sm btn-link text-center link-primary underline-0">Esqueci minha Senha</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </>
  );
};

export default LoginView;
