import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { useEffect, useMemo, useState } from "react";
import { useModal } from "../../../contexts/ModalContext";
import { createPortal } from "react-dom";

import { GroupService } from "../services/GroupService";

export default function EditGroup({ element, onHide })
{
    const groupService = useMemo(() => new GroupService(), []);
    const [group, setGroup] = useState({
        name: ""
    });

    useEffect(() => {
        element !== undefined ? setGroup(element) : null;
    }, [element]);

    const {handle, visible} = useModal();

    return createPortal((
        <Dialog header="Grupo" style={{width: "500px"}} visible={visible} onHide={() => { handle(); if (onHide) onHide(); }}>
            <div>
                <InputText placeholder="Nome" value={group.name} onChange={(e) => setGroup({ ...group, name: e.target.value })} style={{marginTop: "10px", width: "calc(500px - 40px)"}} />
            </div>
            <Divider />
            <div style={{display: "flex", justifyContent: "right"}}>
            {
                element !== undefined ? (
                    <Button label="Salvar" icon="pi pi-check" onClick={() => {
                        alert("GroupService::modify: TBD");
                        // groupService.modify(group).then(() => window.location.reload());
                    }} />
                ) : (
                    <Button label="Criar" icon="pi pi-check" onClick={() => groupService.add(group).then(() => { handle(); if (onHide) onHide(); })} />
                )
            }
            </div>
        </Dialog>
    ), document.querySelector("#modal-root"));
}
