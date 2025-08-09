import { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { register } from '../../services/register.service';

interface RegisterInterface {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterView = () => {
  const navigate = useNavigate();

  const initValues: RegisterInterface = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [loadingRegister, setLoadingRegister] = useState(false);

  const formRegister = useFormik({
    initialValues: initValues,
    validateOnMount: true,
    validationSchema: yup.object({
      username: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
      confirmPassword: yup
        .string()
        .required('Confirmação de senha é obrigatória')
        .oneOf([yup.ref('password')], 'As senhas não coincidem'),
    }),
    onSubmit: async (values) => {
      setLoadingRegister(true);
      console.log('teste', values);

      const responseRegister = await register(values)
        .then((r) => r)
        .catch((e) => e);

      if (responseRegister.message === 'OK') {
        console.log('Cadastro realizado com sucesso');
        setLoadingRegister(false);
        navigate('/login');

        return;
      }

      console.error('Erro ao enviar convite', responseRegister);
      setLoadingRegister(false);
      return;
    },
  });

  return (
    <div className="LoginView mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-3">
          <div className="text-center">
            <img src="../../../public/assets/logo-2-sesi-senai.png" alt="Sesi-senai" className="img-fluid" style={{ width: '400px' }} />
          </div>

          <div className="card bg-white shadow-sm rounded-3 border-0">
            <div className="card-body">
              <div className="text-center">
                <p>
                  <strong>Crie sua conta</strong>
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  formRegister.handleSubmit();
                }}
              >
                <div className="form-group mb-2">
                  <label>Nome</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Digite seu nome"
                    autoComplete="off"
                    className="form-control"
                    value={formRegister.values.username}
                    onChange={formRegister.handleChange}
                    disabled={loadingRegister}
                  />
                </div>
                <div className="form-group mb-4">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Digite seu email"
                    name="email"
                    autoComplete="off"
                    className="form-control"
                    value={formRegister.values.email}
                    onChange={formRegister.handleChange}
                    disabled={loadingRegister}
                  />
                </div>
                <div className="form-group mb-4">
                  <label>Senha</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Digite a senha"
                    autoComplete="off"
                    className="form-control"
                    value={formRegister.values.password}
                    onChange={formRegister.handleChange}
                    disabled={loadingRegister}
                  />
                </div>
                <div className="form-group mb-4">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Digite a senha novamente"
                    autoComplete="off"
                    className="form-control"
                    value={formRegister.values.confirmPassword}
                    onChange={formRegister.handleChange}
                    disabled={loadingRegister}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loadingRegister || !formRegister.isValid}>
                    Registrar-se
                  </button>
                </div>
              </form>

              <Link to="/login" className="link-primary inline no-underscore">
                &laquo; voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterView;
