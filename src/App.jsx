import Activities from "./components/groups/components/activities/Activities";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { createPortal } from "react-dom";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import Groups from "./components/groups/Groups"
import Home from "./components/home/Home";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import Invite from "./components/groups/components/invite/Invite";
import { MemberProvider } from "./components/groups/contexts/MemberContext";
import { Password } from "primereact/password";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { useAuth } from "./contexts/UserContext";
import { useModal } from "./contexts/ModalContext";
import { UserService } from "./components/account/services/UserService";
import { useState } from "react";

import "./App.css";

function SettingsModal({ user })
{
    const userService = new UserService();

    const [form, setForm] = useState({ name: null, password: null });
    const { handle, visible } = useModal();

    return createPortal((
        <Dialog header="Configurações" visible={visible} onHide={() => handle()} style={{width: "600px"}}>
            <TabView>
                <TabPanel header="Conta">
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div>
                                <Image src={user.avatar} imageStyle={{borderRadius: "50%"}} height={"148px"} width={"148px"}/>
                            </div>
                            <div className="ui-spacer-h-l" />
                            <form>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <label htmlFor="username"><span style={{fontSize: "13px"}}>Nome de Usuário</span></label>
                                    <div className="ui-spacer-s" />
                                    <InputText autoComplete="username" id="username" value={form.name !== null ? form.name : user.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    <div className="ui-spacer-s" />
                                    <label htmlFor="password"><span style={{fontSize: "13px"}}>Senha</span></label>
                                    <div className="ui-spacer-s" />
                                    <Password autoComplete="current-password" feedback={false} id="password" value={form.password !== null ? form.password : user.name} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                                    <div className="ui-spacer-s" />
                                </div>
                            </form>
                        </div>
                        <Divider/>
                        <div style={{display: "flex", justifyContent: "right"}}>
                            <Button label="Deletar" icon="pi pi-trash" onClick={() => {
                                userService.remove(sessionStorage.getItem("bizu-user:id")).then(() => {
                                    sessionStorage.clear();
                                    window.location.assign("/");
                                });
                            }}/>
                            <div className="ui-spacer-h-s" />
                            <Button label="Salvar" icon="pi pi-check" onClick={() =>
                                userService.update(sessionStorage.getItem("bizu-user:id"), form).then(() => {
                                    sessionStorage.clear();
                                    window.location.assign("/");
                                })
                            }/>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    ), document.querySelector("#modal-root"));
}

export default function App()
{
    const navigate = useNavigate();

    const { handle: handleModal } = useModal();
    const { user, logout } = useAuth();
    const [sidebar, setSidebar] = useState(false);

    return (
        <div className="app">
            <Sidebar visible={sidebar} onHide={() => setSidebar(false)}>
                <div style={{height: "calc(100vh - 13rem)", overflow: "auto", display: "flex", flexDirection: "column"}}>
                    <Button style={{margin: "5px 0px"}} label="Inicío" icon="pi pi-home" onClick={() => { setSidebar(!sidebar); navigate("/"); }} />
                    <Divider />
                    <Button label="Grupos" onClick={() => { setSidebar(!sidebar); navigate("/grupos"); }} />
                    <div className="ui-spacer" />
                </div>
                <Divider />
                <Card>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <Avatar size="large" image={user.avatar} shape="circle" />
                        <div style={{display: "flex"}}>
                            <Button icon="pi pi-cog" onClick={() => handleModal(<SettingsModal user={user} />)} />
                            <div className="ui-spacer-h-s"/>
                            <Button icon="pi pi-sign-out" onClick={() => {
                                logout();
                                navigate("/");
                            }} />
                        </div>
                    </div>
                </Card>
            </Sidebar>
            <div className="masterHead" style={{background: "rgba(0, 0, 0, .25)", backgroundBlendMode: "darken"}}>
                <Button icon="pi pi-bars" onClick={() => setSidebar(true)}/>
                <span style={{fontSize: 30}}>Bizu</span>
            </div>
            <MemberProvider>
                <Routes>
                    <Route path="/*" element={<Home />}/>
                    <Route path="/grupos" element={<Groups />}/>
                    <Route path="/grupos/convite" element={<Invite />}/>
                    <Route path="/grupos/:groupId/atividades" element={<Activities />}/>
                </Routes>
            </MemberProvider>
        </div>
    );
}

