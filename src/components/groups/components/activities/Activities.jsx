import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useRef, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { PanelMenu } from "primereact/panelmenu";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { ContextMenu } from "primereact/contextmenu";
import EditActivity, { FIXME_categories, FIXME_bimester } from "./modal/EditActivity";
import { useModal } from "../../../../contexts/ModalContext";
import { Tag } from "primereact/tag";
import AlertModal from "../../../../modals/AlertModal";

import { ActivityService } from "./services/ActivityService";

import "./Activities.css";

export function dateDifferenceInDays(lhs, rhs)
{
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(lhs.getFullYear(), lhs.getMonth(), lhs.getDate());
    const utc2 = Date.UTC(rhs.getFullYear(), rhs.getMonth(), rhs.getDate());
    return Math.floor((utc2 - utc1) / millisecondsPerDay);
}

export function dueDateToPriority(date)
{
    const days = dateDifferenceInDays(new Date(Date.now()), moment(date, "DD/MM/YYYY").toDate());
    if (days <= 1 * 7) return { value: "Urgente", status: "danger", id: 3 };
    if (days <= 2 * 7) return { value: "Alta", status: "warning", id: 2 };
    if (days <= 2.5 * 7) return { value: "Normal", status: "success", id: 1 };
    return { value: "Baixa", status: null, id: 0 };
}

export default function Activities()
{
    const activityService = useMemo(() => new ActivityService(), []);
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [activities, setActivites] = useState([]);
    const [selected, setSelected] = useState(null);
    const contextMenu = useRef(null);

    const { handle: handleModal } = useModal();

    const listActivities = async (groupId, filterStrategy = () => true) => {
        return activityService.list(groupId).then((response) => {
            setActivites(
                response.filter(filterStrategy).map((activity) => {
                    let result = activity;
                    result.due = new Date(activity.due).toLocaleDateString("en-GB");
                    result.bimester = FIXME_bimester[activity.bimester];
                    result.category = FIXME_categories[activity.category];
                    result.priority = dueDateToPriority(activity.due);
                    return result;
                })
            );
        });
    };

    useEffect(() => {
        listActivities(groupId).catch(() =>
            handleModal(<AlertModal level="Erro" messages={"Você não é membro deste grupo."} onHide={() => navigate("/grupos")} />)
        );
    }, [activityService, groupId]);

    return (
        <div className="activities">
            <div className="content" style={{}}>
                <div className="menubar">
                    <PanelMenu style={{width: "100%", height: "calc(100vh - 6rem)"}} model={[
                        {
                            label: "Filtrar",
                            items: [
                                { label: "Prioridade", items: [
                                    { label: "Todas", command: () => listActivities(groupId) },
                                    { label: "Urgente", command: () => listActivities(groupId, (activity) => dueDateToPriority(new Date(activity.due).toLocaleDateString("en-GB")).value === "Urgente") },
                                    { label: "Alta", command: () => listActivities(groupId, (activity) => dueDateToPriority(new Date(activity.due).toLocaleDateString("en-GB")).value === "Alta") },
                                    { label: "Normal", command: () => listActivities(groupId, (activity) => dueDateToPriority(new Date(activity.due).toLocaleDateString("en-GB")).value === "Normal") },
                                    { label: "Baixa", command: () => listActivities(groupId, (activity) => dueDateToPriority(new Date(activity.due).toLocaleDateString("en-GB")).value === "Baixa") }
                                ]},
                                { label: "Categoria", items: [
                                    { label: "Todas", command: () => listActivities(groupId) },
                                    { label: "Prova", command: () => listActivities(groupId, (activity) => FIXME_categories[activity.category] === "Prova") },
                                    { label: "Trabalho", command: () => listActivities(groupId, (activity) => FIXME_categories[activity.category] === "Trabalho") }
                                ]},
                                { label: "Bimestre", items: [
                                    { label: "Todos", command: () => listActivities(groupId) },
                                    { label: "Primeiro", command: () => listActivities(groupId, (activity) => FIXME_bimester[activity.bimester] === "Primeiro") },
                                    { label: "Segundo", command: () => listActivities(groupId, (activity) => FIXME_bimester[activity.bimester] === "Segundo") },
                                    { label: "Terceiro", command: () => listActivities(groupId, (activity) => FIXME_bimester[activity.bimester] === "Terceiro") },
                                    { label: "Quarto", command: () => listActivities(groupId, (activity) => FIXME_bimester[activity.bimester] === "Quarto") }
                                ]}
                            ]
                        }
                    ]} />
                </div>
                <div className="datatable">
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <Menubar style={{padding: "5px 5px"}} model={[
                            { label: "Nova Atividade", icon: "pi pi-plus", command: () => handleModal(<EditActivity groupId={parseInt(groupId)} onHide={() => listActivities(groupId) }/>) }
                        ]} />
                        <div style={{display: "flex", flexDirection: "row" }}>
                            <Button label="Procurar" style={{ marginRight: "10px"}} icon="pi pi-search" onClick={() => alert("TBD")}/>
                            <InputText style={{width: "calc(30vw)"}} placeholder="Descrição..." />
                        </div>
                    </div>
                    <ContextMenu ref={contextMenu} onHide={() => setSelected(null)} model={[
                        { label: "Editar", icon: "pi pi-pencil", command: () => handleModal(<EditActivity element={selected} groupId={parseInt(groupId)} onHide={() => listActivities(groupId) }/>) },
                        { label: "Concluído", icon: "pi pi-check", command: () => activityService.remove(groupId, selected.id).then(() => listActivities(groupId)) }
                    ]} />
                    <DataTable
                        value={activities}
                        onContextMenu={(e) => contextMenu.current.show(e.originalEvent)}
                        contextMenuSelection={selected}
                        onContextMenuSelectionChange={(e) => setSelected(e.value)}
                        style={{marginTop: "11px"}}
                        emptyMessage="Nenhuma atividade pendente."
                        showGridlines={true}
                    >
                        <Column field="category" header="Categoria" style={{width: "8px"}} />
                        <Column field="subject" header="Matéria" />
                        <Column field="bimester" header="Bimestre" style={{width: "8px"}} />
                        <Column sortable={true} sortField="due" field="due" header="Prazo" />
                        <Column sortable={true} sortField="priority.id" header="Prioridade" style={{width: "8px"}} body={(activity) => <Tag value={activity.priority.value} severity={activity.priority.status}/> } />
                        <Column field="description" header="Descrição" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
