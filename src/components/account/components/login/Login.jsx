import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { UserService } from '../../services/UserService';
import AlertModal from '../../../../modals/AlertModal';
import { useModals } from '../../../../contexts/ModalContext';

import './Login.css';

const FACTOR = 35;
const { WIDTH, HEIGHT } = { WIDTH: 10*FACTOR, HEIGHT: 13*FACTOR };

export default function Login()
{
    const userService = new UserService();
    const { show: showModal, hide: hideModal } = useModals();

    const [user, setUser] = useState({
        name: "",
        password: ""
    });

    return (
        <div className="login">
            <Card title="Entrar" style={{width: `${WIDTH}px`, height: `${HEIGHT}px` }}>
                <div style={{height: `calc(${HEIGHT}px - 6rem)`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <InputText placeholder="Usuário" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} style={{marginBottom: '10px'}} />
                    <Password placeholder="Senha" value={user.password} feedback={false} onChange={(e) => setUser({ ...user, password: e.target.value })} style={{marginBottom: '10px'}} />
                    <Button label="Login" style={{width: '100px'}} onClick={() => {
                        userService.find(user).then((result) => {
                            sessionStorage.setItem("bizu-auth", result.auth);
                            window.location = "/";
                        }).catch(() => {
                            showModal(<AlertModal level="Aviso" messages={"Senha ou Usuário incorreto."} onHide={hideModal} />);
                        });
                    }}/>
                </div>
                <Button style={{fontSize: "12px"}} label="Não possui uma conta?" link onClick={() => window.location = "/account/register"}/>
            </Card>
        </div>
    );
}
