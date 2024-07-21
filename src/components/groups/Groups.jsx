import { ActivityService } from "./components/activities/services/ActivityService";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ContextMenu } from "primereact/contextmenu";
import { Divider } from "primereact/divider";
import { dueDateToPriority } from "./components/activities/Activities";
import EditGroup from "./modals/EditGroup";
import { GroupService } from "./services/GroupService";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { useMember } from "./contexts/MemberContext";
import { useModal } from "../../contexts/ModalContext";
import { useNavigate } from "react-router";

import "./Groups.css"

export default function Groups()
{
    const navigate = useNavigate();

    const groupService = useMemo(() => new GroupService(), []);
    const activitiesService = new ActivityService();

    const { handle: handleModal } = useModal();
    const { member, setGroup } = useMember();
    const [selected, setSelected] = useState(null);
    const [groups, setGroups] = useState([]);
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

    useEffect(() => {
        setGroup(selected?.id);
    }, [selected]);

    return (
        <div className="groups">
            <div className="groupsList">
                <ContextMenu ref={contextMenu} model={[
                    ["ROLE_OWNER", "ROLE_ADMIN"].includes(member.role) ? [
                        { label: "Editar", icon: "pi pi-pencil", command: () => handleModal(<EditGroup element={selected} onHide={() => listGroups().catch((e) => console.error(e))}/>) },
                        { label: "Criar Convite", icon: "pi pi-link", command: async () => navigator.clipboard.writeText(`${window.location.origin}/grupos/convite?key=${(await groupService.createGroupInvite(selected.id))["value"]}`) }
                    ] : []
                    ,
                    !["ROLE_OWNER"].includes(member.role) ? [
                        { label: "Sair do Grupo", icon: "pi pi-sign-out", command: () => alert("TBD") }
                    ] : []
                ].flat()} />
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
