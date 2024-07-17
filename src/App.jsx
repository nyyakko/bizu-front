import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { useModals } from './contexts/ModalContext';
import SettingsModal from './modals/SettingsModal';
import { useUser } from './contexts/UserContext';

import Home from './components/home/Home';
import Groups from './components/groups/Groups'
import Activities from './components/groups/components/activities/Activities';

import './App.css';

const FIXME_username = "nyyakko";

export default function App()
{
    const { show: showModal, hide: hideModal } = useModals();
    const [sidebar, setSidebar] = useState(false);
    const { setUser } = useUser();

    useEffect(() => {
        setUser({ name: FIXME_username });
    }, []);

    return (
        <div className="app">
            <Sidebar visible={sidebar} onHide={() => setSidebar(false)}>
                <div style={{height: 'calc(100vh - 13rem)', overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
                    <Button style={{margin: '5px 0px'}} label="Inicío" icon="pi pi-home" onClick={() => { setSidebar(!sidebar); window.location.assign("/"); }} />
                    <Divider />
                    <Button label="Grupos" onClick={() => { setSidebar(!sidebar); window.location.assign("/grupos"); }} />
                    <div className="ui-spacer" />
                </div>
                <Divider />
                <Card>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Avatar size="large" icon="pi pi-user" shape="circle" />
                        <div style={{display: 'flex'}}>
                            <Button icon="pi pi-cog" onClick={() => {
                                showModal(<SettingsModal onHide={hideModal}/>)
                            }} />
                            <div className="ui-spacer-h-s"/>
                            <Button icon="pi pi-sign-out" onClick={() => {
                                sessionStorage.removeItem("bizu-auth");
                                window.location.assign("/");
                            }} />
                        </div>
                    </div>
                </Card>
            </Sidebar>
            <div className="masterHead" style={{background: 'rgba(0, 0, 0, .25)', backgroundBlendMode: 'darken'}}>
                <Button icon="pi pi-bars" onClick={() => setSidebar(true)}/>
                <span style={{fontSize: 30}}>Bizu</span>
            </div>
            <Routes>
                <Route path="/*" element={<Home />}/>
                <Route path="/grupos" element={<Groups />}/>
                <Route path="/grupos/:groupId/atividades" element={<Activities />}/>
            </Routes>
        </div>
    );
}

