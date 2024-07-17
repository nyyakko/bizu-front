import { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';

import Home from './components/home/Home';
import Groups from './components/groups/Groups'
import Activities from './components/groups/activities/Activities';

import './App.css';

const FIXME_avatar = "https://lh3.googleusercontent.com/a/ACg8ocK4fYjoGQEwXW-wXOcisOBqe8o_dg5mh5MlHR-CYNW53aEA0hEj=s288-c-no";

export default function App()
{
    const [sidebar, setSidebar] = useState(false);

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
                        <Avatar size="large" image={FIXME_avatar} shape="circle" />
                        <Button label="Sair" icon="pi pi-sign-out" onClick={() => {
                            sessionStorage.removeItem("bizu-auth");
                            window.location.assign("/");
                        }} />
                    </div>
                </Card>
            </Sidebar>
            <div className="masterHead" style={{background: 'rgba(0, 0, 0, .25)', backgroundBlendMode: 'darken'}}>
                <Button icon="pi pi-bars" onClick={() => setSidebar(true)}/>
                <span style={{fontSize: 30}}>Bizu</span>
            </div>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/grupos" element={<Groups />}/>
                <Route path="/grupos/:groupId/atividades" element={<Activities />}/>
            </Routes>
        </div>
    );
}

