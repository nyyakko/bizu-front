import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { InputText } from 'primereact/inputtext';

export default function SettingsModal({ onHide })
{
    const [visible, setVisible] = useState(true);
    const { user } = useUser();

    return (
        <Dialog header="Configurações" visible={visible} onHide={() => { setVisible(false); if (onHide) onHide(); }} style={{width: '30vw', height: '50vh'}}>
            <TabView>
                <TabPanel header="Conta">
                    <label htmlFor="username"><span style={{fontSize: '13px'}}>Nome de Usuário</span></label>
                    <div className="ui-spacer-s" />
                    <InputText id="username" value={user.name}/>
                    <Divider/>
                    <div style={{display: "flex", justifyContent: "right"}}>
                        <Button label="Salvar" icon="pi pi-check" onClick={() => alert("TBD")}/>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
}
