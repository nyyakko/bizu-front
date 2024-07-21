import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import { useEffect, useMemo, useRef, useState } from "react";
import { Divider } from "primereact/divider";
import { ContextMenu } from "primereact/contextmenu";
import EditGroup from "./modals/EditGroup";
import { useModal } from "../../contexts/ModalContext";
import { useNavigate } from "react-router";
import { Badge } from "primereact/badge";

import { GroupService } from "./services/GroupService";
import { ActivityService } from "./components/activities/services/ActivityService";
import { dueDateToPriority } from "./components/activities/Activities";

import "./Groups.css"

export default function Groups()
{
    const navigate = useNavigate();
    const groupService = useMemo(() => new GroupService(), []);
    const activitiesService = new ActivityService();
    const { handle: handleModal } = useModal();
    const [groups, setGroups] = useState([]);
    const [selected, setSelected] = useState(null);
    const contextMenu = useRef(null);

    const listGroups = async () => {
        return groupService.list().then((response) => {
            return Promise.all(response.map(async (group) => {
                const activities = await activitiesService.list(group.id).then((activities) =>
                    activities.filter((activity) => dueDateToPriority(new Date(activity.due).toLocaleDateString("en-GB")).value === "Urgente")
                );
                return (
                    <div key={Math.random()} className="ui-spacer-l" style={{width: "100%", height: "130px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                        {
                            activities.length ? (
                                <i className="p-overlay-badge" style={{width: "95%"}}>
                                    <Badge value={`${activities.length}`} severity="danger" />
                                </i>
                            ) : (
                                null
                            )
                        }
                        <Card title={group.name} style={{width: "95%"}} onContextMenu={(e) => { contextMenu.current.show(e); setSelected(group); }}>
                            <Button label="Atividades" onClick={() => navigate(`${group.id}/atividades`)} />
                        </Card>
                    </div>
                );
            }));
        }).then((groups) => setGroups(groups));
    };

    useEffect(() => {
        listGroups().catch((e) => console.error(e))
    }, [groupService]);

    return (
        <div className="groups">
            <div className="groupsList">
                <ContextMenu ref={contextMenu} model={[
                    { label: "Editar", icon: "pi pi-pencil", command: () => handleModal(<EditGroup element={selected} onHide={() => listGroups().catch((e) => console.error(e))}/>) },
                    { label: "Deletar", icon: "pi pi-trash", command: () => groupService.remove(selected.id).then(() => listGroups().catch((e) => console.error(e))) },
                ]} />
                <ScrollPanel style={{width: "50vw", height: "85vh"}}>
                { groups }
                { groups.length ? <Divider /> : null }
                <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                    <Button icon="pi pi-plus" label="Novo Grupo" onClick={() => handleModal(<EditGroup onHide={() => listGroups().catch((e) => console.error(e))}/>)} />
                </div>
                </ScrollPanel>
            </div>
        </div>
    );
}
