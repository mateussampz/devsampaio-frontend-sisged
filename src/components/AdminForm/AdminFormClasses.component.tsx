import { useFormik } from "formik"
import { useState } from "react"
import * as yup from "yup"
import { adminCreateClasses } from "../../services/admin.service"

interface ClassesInitialValues {
  instructor: string
  dateTime: string
  instructorClass: string
  shift: string
};
const AdminFormClasses = (props: any) => {
  const { onSetModal, instructors } = props;
  const [loading, setLoading] = useState(false);


  const initialValues: ClassesInitialValues = {
    instructor: "",
    dateTime: "",
    instructorClass: "",
    shift: "",
  };

  const validationSchema: any = yup.object().shape({
    instructor: yup.string().required("Professor é obrigatório"),
    dateTime: yup.string().required("Data é obrigatória"),
    instructorClass: yup.string().required("Turma é obrigatória"),
    shift: yup.string().required("Turno é obrigatório"),
  });

  const formikClasses: any = useFormik({
    initialValues: initialValues,
    validateOnMount: true,
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setLoading(true);

      const responseCreate: any = await adminCreateClasses(values);
      if (responseCreate instanceof Error && responseCreate.message !== "OK") {
        console.error("Error creating class", responseCreate);
          setLoading(false);
          return;
        }

      setLoading(false);
      onSetModal(false);
    }
  })

  return <>
    <form onSubmit={(e) => {
      e.preventDefault();
      formikClasses.handleSubmit();
    }}>

      <div className="form-group mb-4">
        <label>Professor</label>
        <select 
          name="instructor" 
          autoComplete="off"
          className="form-control"
          value={formikClasses.values.instructor} 
          onChange={formikClasses.handleChange}
          disabled={loading} >
          <option value="">Selecione o professor</option>
          {instructors.map((instructor: any) => (
            <option key={instructor.id} value={instructor.name}>{instructor.name}</option>
          ))}
        </select>
      </div>
      <div className="row mb-4">

        <div className="col">
          <div className="form-group">
            <label>Data e Hora</label>
            <input type="datetime-local"
              name="dateTime"
              autoComplete="off"
              className="form-control"
              value={formikClasses.values.dateTime}
              onChange={formikClasses.handleChange}
              disabled={loading} />
          </div>
        </div>

        <div className="col">
          <div className="form-group">
            <label>Turno</label>
            <select 
              name="shift"
              className="form-select"
              value={formikClasses.values.shift} 
              onChange={formikClasses.handleChange} 
              disabled={loading} >
              <option value="">Selecione o turno</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>
          </div>
        </div>

        <div className="col">
          <div className="form-group">
            <label>Turma</label>
            <select 
              name="instructorClass"
              className="form-select"
              onChange={formikClasses.handleChange} 
              disabled={loading} >
              <option value="">Selecione a turma</option>
              <option value="turma1">Turma 1</option>
              <option value="turma2">Turma 2</option>
              <option value="turma3">Turma 3</option>
            </select>
          </div>
        </div>  
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !formikClasses.isValid}>
          {!loading && <i className="fas fa-check me-2"></i>} Salvar
      </button>

      <div className="float-end">
        <button type="button"
          onClick={() => {
            formikClasses.resetForm();
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
    
export default AdminFormClasses;