import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { filterInstructors, getAllInstructors } from "../../services/consultations.service";
import { convertFirebaseTimestampToString } from "@moreirapontocom/npmhelpers";

interface ConsultationValues {
  startDate: string;
  endDate: string;
  instructor: string;
  shift: string;
};

const ConsultationsView = () => {
  useEffect(()=> {
    getAllInstructors().then((res) => {
      setInstructors(res.data.instructors);
    }).catch((err: any) => {
      console.error(err);
    });
  }, [])
  const [instructors, setInstructors] = useState([] as any)
  const [responseSearch, setResponseSearch] = useState([] as any)
  const [loading, setLoading] = useState(false);
  console.log("teste",responseSearch);

  const initialValues: ConsultationValues = {
    startDate: "",
    endDate: "",
    instructor: "",
    shift: ""
  }

  const ValidationSchema = yup.object().shape({
    startDate: yup.string().required("Data Inicial é obrigatória"),
    endDate: yup.string().required("Data Final é obrigatória"),
    instructor: yup.string().required("Instrutor é obrigatório"),
    shift: yup.string().required("Usuário é obrigatório")
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const response = await filterInstructors(values)

      if (response instanceof Error && response.message !== "OK") {
        console.error("Error filtering instructors", response);
        setLoading(false);
        return;
      }

      setResponseSearch(response.data.instructors);
      setLoading(false);
    }
  })
  return (
    <div>
      <h2>Consultar Instrutor</h2>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <div className="row form-group p-2">
          <div className="col">
            <span>Data Inicial: </span>
            <input type="date" name="startDate" disabled={loading} className="form-control" onChange={formik.handleChange} value={formik.values.startDate} />
            {formik.errors.startDate && <div>{formik.errors.startDate}</div>}
          </div>

          <div className="col">
            <span>Data Final: </span>
            <input type="date" name="endDate" disabled={loading} className="form-control" onChange={formik.handleChange} value={formik.values.endDate} />
            {formik.errors.endDate && <div>{formik.errors.endDate}</div>}
          </div>

          <div className="col">
            <span>Turno </span>
            <select name="shift" className="form-select" disabled={loading} onChange={formik.handleChange} value={formik.values.shift}>
              <option value="">Selecione um turno</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>
            {formik.errors.shift && <div>{formik.errors.shift}</div>}
          </div>

        </div>

        <div className="form-group p-2 mb-4">
          <span>Instrutor:</span>
          <select name="instructor" id="instructor" disabled={loading} className="form-select" onChange={formik.handleChange} value={formik.values.instructor}>
            <option value="">Selecione um instrutor</option>
            {instructors.filter((instructor: any) => (
              instructor.typeUser === "professor"
            )).map((instructor: any) => (
              <option key={instructor.id} value={instructor.name}>{instructor.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary"><i className="fas fa-search"/> Filtrar</button>
      </form>
      {responseSearch.length > 0 && (
        <div>
          <h3>Resultados da Busca:</h3>
          <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th className="bg-transparent text-muted text-center">
                        <small>#</small>
                    </th>
                    <th className="bg-transparent">Nome</th>
                    <th className="bg-transparent">Data</th>
                    <th className="bg-transparent">Hora</th>
                    <th className="bg-transparent">Turma</th>
                    <th className="bg-transparent">Turno</th>
                </tr>
            </thead>
            <tbody>
                {responseSearch.map((doc:any, index:any)=>(
                    <tr key={`users-${index}`}>
                        <td className="bg-transparent text-center text-muted">
                            <small>{index + 1}</small>
                        </td>
                        <td className="bg-transparent">{doc.instructor}</td>
                        <td className="bg-transparent">{convertFirebaseTimestampToString(doc.date, "DD/MM/YYYY")}</td>
                        <td className="bg-transparent">{convertFirebaseTimestampToString(doc.date, "HH:mm")}</td>
                        <td className="bg-transparent">{doc.instructorClass}</td>
                        <td className="bg-transparent">{doc.shift}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ConsultationsView;