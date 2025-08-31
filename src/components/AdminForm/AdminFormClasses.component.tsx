import { useFormik } from "formik"
import { useEffect, useState } from "react"
import * as yup from "yup"
import { adminCreateClass, adminEditClass } from "../../services/adminClasses.service"
import { getAllInstructors } from "../../services/consultations.service"
import { convertFirebaseTimestampToString } from "@moreirapontocom/npmhelpers"

interface ClassesInitialValues {
  instructor: string
  date: string
  instructorClass: string
  shift: string
};
const AdminFormClasses = (props: any) => {
  useEffect(() => {
    getInstructors();
  }, []);
  const {
    selectedClasses,
    onSetModal,
    onClassesUpdated,
  } = props;
  const [loading, setLoading] = useState(false);

  const [ instructors, setInstructors ] = useState([] as any);

  const getInstructors = async () => {
    const response: any = await getAllInstructors();
    if (response instanceof Error && response.message !== "OK") {
      console.error("Error fetching instructors", response);
      return [];
    }
    setInstructors(response.data.instructors || []);
  };
  const initialValues: ClassesInitialValues = {
    instructor: selectedClasses.instructor || "",
    date: convertFirebaseTimestampToString(selectedClasses.date) || "",
    instructorClass: selectedClasses.instructorClass || "",
    shift: selectedClasses.shift || "",
  };

  const validationSchema: any = yup.object().shape({
    instructor: yup.string().required("Professor é obrigatório"),
    date: yup.string().required("Data é obrigatória"),
    instructorClass: yup.string().required("Turma é obrigatória"),
    shift: yup.string().required("Turno é obrigatório"),
  });

  const formikClasses: any = useFormik({
    initialValues: initialValues,
    validateOnMount: true,
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setLoading(true);

      if (!selectedClasses.id || selectedClasses.id === "") {
        const newValues: any = {
          instructor: values.instructor,
          date: values.date,
          instructorClass: values.instructorClass,
          shift: values.shift,
        };

        const responseCreate: any = await adminCreateClass(newValues);
        if (responseCreate instanceof Error && responseCreate.message !== "OK") {
          console.error("Error creating class", responseCreate);
          setLoading(false);
          return;
        }

        onClassesUpdated({...newValues, id: responseCreate.data.newClassId});
        onSetModal(false);

        formikClasses.resetForm();
        setLoading(false);
        return;
      }

      // UPDATE CLASS

      const newValues: any = {
        instructor: values.instructor,
        date: values.date,
        instructorClass: values.instructorClass,
        shift: values.shift,
      };

      const responseEdit: any = await adminEditClass(selectedClasses.id, newValues).then((res: any) => res).catch((err: any) => err);
      if (responseEdit instanceof Error && responseEdit.message !== "OK") {
        console.error("Error editing class", responseEdit);
        setLoading(false);
        return;
      }

      onClassesUpdated({...newValues, id: selectedClasses.id});
      onSetModal(false);

      formikClasses.resetForm();
      setLoading(false);

      return;
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
          className="form-select"
          value={formikClasses.values.instructor} 
          onChange={formikClasses.handleChange}
          disabled={loading} >
          <option value="">Selecione o professor</option>
          {instructors.filter((instructor: any) => (
            instructor.typeUser === "professor"
          )).map((instructor: any) => (
            <option key={instructor.id} value={instructor.name}>{instructor.name}</option>
          ))}
        </select>
      </div>
      <div className="row mb-4">

        <div className="col">
          <div className="form-group">
            <label>Data e Hora</label>
            <input type="dateTime-local"
              name="date"
              autoComplete="off"
              className="form-control"
              value={formikClasses.values.date}
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
              value={formikClasses.values.instructorClass}
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