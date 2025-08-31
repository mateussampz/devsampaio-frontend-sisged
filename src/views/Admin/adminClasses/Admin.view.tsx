import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ConfirmContext } from "@moreirapontocom/npmhelpers";
import { adminDeleteClass, getAdminClasses } from "../../../services/adminClasses.service";
import AdminFormClasses from "../../../components/AdminForm/AdminFormClasses.component";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const AdminClasses = () => {
    useEffect(() => {
        getClasses();
    }, []);

    const convertFirebaseToDate = (date: any) => {
        // se vier como objeto { _seconds, _nanoseconds }
        if (date?._seconds) {
        const jsDate = new Date(date._seconds * 1000); // segundos → ms
        return dayjs(jsDate).tz("America/Sao_Paulo");
        }

        // se já for string ou número
        return dayjs(date).tz("America/Sao_Paulo");
    };
    const navigate: any = useNavigate();
    const {setConfirm} = useContext(ConfirmContext);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([] as any);
    const [show, setShowModal] = useState(false);

    const deleteClasses = async (Classes: any) => {

        const response = await adminDeleteClass(Classes.id);
        if (response instanceof Error && response.message !== "OK") {
            console.error("Error deleting classes", response);
            return;
        }

        const filteredClasses = classes.filter((u: any) => u.id !== Classes.id);
        setClasses(filteredClasses);
    }

    const getClasses = async () => {
        setLoading(true);
        const classes: any = await getAdminClasses().then((res: any) => res).catch((err:any)=> err);

        if (classes.response?.status === 403) {
            setLoading(false);
            return navigate("/panel");
        }

        if (classes instanceof Error && classes.message !== "OK") {
            console.error("Error getting contacts", classes);
            setLoading(false);
            return;
        }

        setClasses(classes.data.classes || []);
        setLoading(false);
    };

    const [selectedClasses, setSelectedClasses] = useState({} as any);

    const closeModal = () => {
        setShowModal(false);
        setSelectedClasses({} as any);
    };

    return <>
        <div>
            <h1>Admin</h1>

            {!loading && <>
                <button
                    className="btn btn-primary m-2"
                    onClick={() => {
                        setSelectedClasses({});
                        setShowModal(true);
                    }}>
                        Cadastrar Aula
                </button>

                <h3>Aulas</h3>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th className="bg-transparent text-muted text-center">
                                <small>#</small>
                            </th>
                            <th className="bg-transparent">Instrutor</th>
                            <th className="bg-transparent">Data</th>
                            <th className="bg-transparent">Hora</th>
                            <th className="bg-transparent">Turno</th>
                            <th className="bg-transparent">Turma</th>
                            <th className="bg-transparent"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((classItem:any, index:any)=>(
                            <tr key={`classes-${index}`}
                                onClick={() => {
                                    setSelectedClasses(classItem);
                                    setShowModal(true);
                                }}
                                className="cursor-pointer"
                            >
                                <td className="bg-transparent text-center text-muted">
                                    <small>{index + 1}</small>
                                </td>
                                <td className="bg-transparent">{classItem.instructor}</td>
                                <td className="bg-transparent">{convertFirebaseToDate(classItem.date).format("DD/MM/YYYY")}</td>
                                <td className="bg-transparent">{convertFirebaseToDate(classItem.date).format("HH:mm")}</td>
                                <td className="bg-transparent">{classItem.shift}</td>
                                <td className="bg-transparent">{classItem.instructorClass}</td>
                                <td className="bg-transparent text-center">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirm({
                                                type: "danger", 
                                                title: "Apagar Usuário",
                                                message: "Você tem certeza que deseja apagar este usuário? Esta ação não pode ser desfeita.",
                                                buttonLabel: "Apagar",
                                                buttonCancelLabel: "Cancelar",
                                                onConfirm: async () => {
                                                    await deleteClasses(classItem);
                                                },
                                            })}}
                                        className="btn btn-outline-primary btn-sm">
                                            <i className="fas fa-trash"></i>
                                    </button>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>}
        </div>


        <Modal show={show} size="lg">
            <Modal.Header closeButton onClick={() => closeModal()}>
                <Modal.Title>Formulario de {selectedClasses.id === "" ? "Criação" : "Edição"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>


                    <AdminFormClasses
                        selectedClasses={selectedClasses}
                        onSetModal={(e: boolean) => setShowModal(e)}
                        onClassesUpdated={(classItem: any) => {
                            const currentClasses: any = classes.find((classItem: any) => classItem.id === selectedClasses.id);

                        if (currentClasses) {
                            Object.assign(currentClasses, classItem);
                            setClasses([...classes]);
                        } else {
                            setClasses([...classes, classItem]);
                        }
                        }} />

            </Modal.Body>
        </Modal>
    </>
};

export default AdminClasses;