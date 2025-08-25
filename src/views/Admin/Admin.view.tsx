import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { adminDeleteUser, getAdminUsers } from "../../services/admin.service";
import { Modal } from "react-bootstrap";
import AdminFormUser from "../../components/AdminForm/AdminFormUser.component";
import AdminFormClasses from "../../components/AdminForm/AdminFormClasses.component";
import { ConfirmContext } from "@moreirapontocom/npmhelpers";

const Admin = () => {
    useEffect(() => {
        getUsers();
    }, []);

    const navigate: any = useNavigate();
    const {setConfirm} = useContext(ConfirmContext);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [users, setUsers] = useState([] as any);
    const [show, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("user");

    const deleteUser = async (user: any) => {

        const response = await adminDeleteUser(user);
        if (response instanceof Error && response.message !== "OK") {
            console.error("Error deleting user", response);
            return;
        }

        const filteredUsers = users.filter((u: any) => u.id !== user.id);
        setUsers(filteredUsers);
    }

    const getUsers = async () => {
        setLoadingUsers(true);
        const users: any = await getAdminUsers().then((res: any) => res).catch((err:any)=> err);

        if (users.response?.status === 403) {
            setLoadingUsers(false);
            return navigate("/panel");
        }

        if (users instanceof Error && users.message !== "OK") {
            console.error("Error getting contacts", users);
            setLoadingUsers(false);
            return;
        }

        setUsers(users.data.users || []);
        setLoadingUsers(false);
    };

    const [selectedUser, setSelectedUser] = useState({} as any);

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser({} as any);
    };

    return <>
        <div>
            <h1>Admin</h1>

            {!loadingUsers && <>
                <button
                    className="btn btn-primary m-2"
                    onClick={() => {
                        setTypeModal("user")
                        setSelectedUser({ id: "", displayName: "", email: "", connectedPhone: "", zid: "", ztoken: "" });
                        setShowModal(true);
                    }}>
                        Criar Usuário
                </button>

                <button
                    className="btn btn-primary m-2"
                    onClick={() => {
                        setTypeModal("classes")
                        setSelectedUser({ id: "", displayName: "", email: "", connectedPhone: "", zid: "", ztoken: "" });
                        setShowModal(true);
                    }}>
                        Cadastrar Aula
                </button>

                <h3>Usuários</h3>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th className="bg-transparent text-muted text-center">
                                <small>#</small>
                            </th>
                            <th className="bg-transparent">User</th>
                            <th className="bg-transparent">Nome</th>
                            <th className="bg-transparent">Email</th>
                            <th className="bg-transparent">Tipo</th>
                            <th className="bg-transparent"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user:any, index:any)=>(
                            <tr key={`users-${index}`}
                                onClick={() => {
                                    setSelectedUser(user);
                                    setShowModal(true);
                                    setTypeModal("user");
                                }}
                                className="cursor-pointer"
                            >
                                <td className="bg-transparent text-center text-muted">
                                    <small>{index + 1}</small>
                                </td>
                                <td className="bg-transparent">{user.displayName}</td>
                                <td className="bg-transparent">{user.name}</td>
                                <td className="bg-transparent">{user.email}</td>
                                <td className="bg-transparent">{user.typeUser}</td>
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
                                                    await deleteUser(user);
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
                <Modal.Title>Formulario de {selectedUser.id === "" ? "Criação" : "Edição"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                {typeModal === "user" ? (
                    <AdminFormUser
                        selectedUser={selectedUser}
                        onSetModal={(e: boolean) => setShowModal(e)}
                        onUserUpdated={(user: any) => {
                            const currentUser: any = users.find((user: any) => user.id === selectedUser.id);

                        if (currentUser) {
                            Object.assign(currentUser, user);
                            setUsers([...users]);
                        } else {
                            setUsers([...users, user]);
                        }

                        setUsers((prevUsers: any) => [...prevUsers].sort((a: any, b: any) => a.displayName.localeCompare(b.displayName)));
                    }} />) : (
                    <AdminFormClasses
                        onSetModal={(e: boolean) => setShowModal(e)}
                        instructors={users}
                    />
                )}

            </Modal.Body>
        </Modal>
    </>
};

export default Admin;