import { useState } from "react";
import { useFormik } from "formik";
import { adminEditUser, adminCreateUser } from "../../services/admin.service";
import * as yup from "yup";

interface UserInitialValues {
  displayName: string
  name: string
  email: string
  password: string
  confirmPassword: string
  typeUser: string
};

const AdminFormUser = (props: any) => {
  const {
    selectedUser,
    onSetModal,
    onUserUpdated,
  } = props;
  const [loading, setLoading] = useState(false);

  const initialValues: UserInitialValues = {
    displayName: selectedUser.displayName || "",
    name: selectedUser.name || "",
    email: selectedUser.email || "",
    password:  "",
    confirmPassword: "",
    typeUser: "",
  };

  const validationSchema: any = yup.object().shape({
    displayName: yup.string().required("Nome é obrigatório"),
    name: yup.string().required("Nome é obrigatório"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    typeUser: yup.string().required("Tipo é obrigatório"),
    password: yup.string().when([], () => {
      return selectedUser.id === "" ?
        yup.string()
          .required("Senha é obrigatória") :
        yup.string()
          .optional();
    }),
    confirmPassword: yup.string().when([], () => {
      return selectedUser.id === "" ?
        yup.string()
          .required("Confirmação de senha é obrigatória")
          .oneOf([yup.ref("password")], "As senhas não coincidem") :
        yup.string()
          .optional();
    }),
  });

  const formikUser: any = useFormik({
    initialValues: initialValues,
    validateOnMount: true,
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setLoading(true);

      // CREATE USER

      if (!selectedUser.id || selectedUser.id === "") {
        const newValues: any = {
          displayName: values.displayName,
          name: values.name,
          email: values.email,
          password: values.password,
          typeUser: values.typeUser,
        };

        const responseCreate: any = await adminCreateUser(newValues);
        if (responseCreate instanceof Error && responseCreate.message !== "OK") {
          console.error("Error creating user", responseCreate);
          setLoading(false);
          return;
        }

        onUserUpdated({...newValues, id: responseCreate.data.newUserId});
        onSetModal(false);

        formikUser.resetForm();
        setLoading(false);
        return;
      }

      // UPDATE USER

      const newValues: any = {
        displayName: values.displayName,
        name: values.name,
        email: values.email,
      };

      const responseEdit: any = await adminEditUser(selectedUser.id, newValues).then((res: any) => res).catch((err: any) => err);
      if (responseEdit instanceof Error && responseEdit.message !== "OK") {
        console.error("Error editing user", responseEdit);
        setLoading(false);
        return;
      }

      onUserUpdated({...newValues, id: selectedUser.id});
      onSetModal(false);

      formikUser.resetForm();
      setLoading(false);
    },
  });

  return <>
    <form onSubmit={formikUser.handleSubmit}>

      {selectedUser.id === "edit" && <small className="text-muted">
          <strong>ID:</strong> {selectedUser.id}
      </small>}

      <div className="form-group mb-2">
        <label>User</label>
        <input type="text" 
          name="displayName" 
          placeholder="Digite o nome de usuário"
          autoComplete="off"
          className="form-control"
          value={formikUser.values.displayName} 
          onChange={formikUser.handleChange}
          disabled={loading} />
      </div>

      <div className="form-group mb-2">
        <label>Nome</label>
        <input type="text" 
          name="name" 
          placeholder="Digite o nome do usuário"
          autoComplete="off"
          className="form-control"
          value={formikUser.values.name} 
          onChange={formikUser.handleChange}
          disabled={loading} />
      </div>

      <div className="form-group mb-2">
        <label>Email</label>
        <input 
          type="email" 
          name="email"
          placeholder="Digite o email"
          autoComplete="off" 
          className="form-control"
          value={formikUser.values.email} 
          onChange={formikUser.handleChange} 
          disabled={loading} />
      </div>

      {selectedUser.id === "" && <>
        <div className="form-group mb-2">
          <label>Tipo</label>
          <select 
            name="typeUser"
            className="form-select"
            onChange={formikUser.handleChange} 
            disabled={loading} >
            <option value="">Selecione o tipo</option>
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group mb-2 ">
          <label>Senha</label>
          <input type="text"
            name="password" 
            placeholder="Digite a senha"
            autoComplete="off"
            className="form-control"
            value={formikUser.values.password} 
            onChange={formikUser.handleChange}
            disabled={loading} />
        </div>
        <div className="form-group mb-2 ">
          <label>Confirmar senha</label>
          <input type="text"
            name="confirmPassword" 
            placeholder="Digite a senha"
            autoComplete="off"
            className="form-control"
            value={formikUser.values.confirmPassword} 
            onChange={formikUser.handleChange}
            disabled={loading} />
        </div>
      </>}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !formikUser.isValid}>
          {!loading && <i className="fas fa-check me-2"></i>} Salvar
      </button>

      <div className="float-end">
        <button type="button"
          onClick={() => {
            formikUser.resetForm();
            onSetModal(false);
          }}
          className="btn btn-secondary mt-2"
          disabled={loading}>
            Cancelar
        </button>
      </div>
    </form>
  </>
};

export default AdminFormUser;