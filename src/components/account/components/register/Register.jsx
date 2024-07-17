import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { UserService } from '../../services/UserService';

import './Register.css';

const FACTOR = 35;
const { WIDTH, HEIGHT } = { WIDTH: 10*FACTOR, HEIGHT: 13*FACTOR };

export default function Register()
{
    const userService = new UserService();

    const [user, setUser] = useState({
        name: "",
        password: ""
    });

    return (
        <div className="register">
            <Card title="Registrar" style={{width: `${WIDTH}px`, height: `${HEIGHT}px` }}>
                <div style={{height: `calc(${HEIGHT}px - 6rem)`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <InputText placeholder="Usuário" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} style={{marginBottom: '10px'}}/>
                    <Password placeholder="Senha" value={user.password} feedback={false} onChange={(e) => setUser({ ...user, password: e.target.value })} style={{marginBottom: '10px'}}/>
                    <Button label="Registrar-se" style={{width: '150px'}} onClick={() => {
                        userService.add({ name: user.name, password: user.password }).then((result) => {
                            sessionStorage.setItem("bizu-auth", result.auth);
                            window.location = "/";
                        });
                    }}/>
                </div>
                <Button style={{fontSize: "12px"}} label="Já possui uma conta?" link onClick={() => window.location = "/account/login"}/>
            </Card>
        </div>
    );
}
