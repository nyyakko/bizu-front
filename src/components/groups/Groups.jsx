import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import { useEffect, useMemo, useRef, useState } from "react";
import { Divider } from "primereact/divider";
import { ContextMenu } from "primereact/contextmenu";
import EditGroup from "./modals/EditGroup";
import { useModal } from "../../contexts/ModalContext";
import { useNavigate } from "react-router";

import { GroupService } from "./services/GroupService";

import "./Groups.css"

export default function Groups()
{
    const navigate = useNavigate();
    const groupService = useMemo(() => new GroupService(), []);
    const { handle: handleModal } = useModal();
    const [groups, setGroups] = useState([]);
    const [selected, setSelected] = useState(null);
    const contextMenu = useRef(null);

    useEffect(() => {
        groupService.list().then((response) => setGroups(response));
    }, [groupService]);

    const contextMenuOptions = [
        {
            label: "Editar",
            icon: "pi pi-pencil",
            command: () => handleModal(<EditGroup element={selected}/>)
        },
        {
            label: "Deletar",
            icon: "pi pi-trash",
            command: () => groupService.remove(selected.id).then(() => window.location.reload())
        },
    ];

    return (
        <div className="groups">
            <div className="groupsList">
                <ContextMenu ref={contextMenu} model={contextMenuOptions} />
                <ScrollPanel style={{width: '50vw', height: '85vh'}}>
                {
                    groups.map((group) => {
                        return (
                            <div key={Math.random()} className="ui-spacer-l">
                                <Card title={group.name} style={{width: '100%'}} onContextMenu={(e) => {
                                    contextMenu.current.show(e);
                                    setSelected(group);
                                }}>
                                    <Button label="Atividades" onClick={() => navigate(`${group.id}/atividades`)} />
                                </Card>
                            </div>
                        );
                    })
                }
                { groups.length ? <Divider /> : null }
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <Button icon="pi pi-plus" label="Novo Grupo" onClick={() => handleModal(<EditGroup onHide={handleModal}/>)} />
                </div>
                </ScrollPanel>
            </div>
        </div>
    );
}
