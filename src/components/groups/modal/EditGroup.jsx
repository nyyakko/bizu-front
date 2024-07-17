import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";

import { GroupService } from "../services/GroupService";

export default function EditGroup({ element })
{
    const groupService = useMemo(() => new GroupService(), []);

    const [isVisible, setVisible] = useState(true);
    const [group, setGroup] = useState(element !== undefined ? element : {
        name: ""
    });

    return (
        <Dialog header="Grupo" style={{width: "500px"}} visible={isVisible} onHide={() => setVisible(!isVisible)}>
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
                    <Button label="Criar" icon="pi pi-check" onClick={() => {
                        groupService.add(group).then(() => window.location.reload());
                    }} />
                )
            }
            </div>
        </Dialog>
    );
}
