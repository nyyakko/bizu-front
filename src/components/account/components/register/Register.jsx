import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { UserService } from '../../services/UserService';
import { useNavigate } from 'react-router';

import './Register.css';

const FACTOR = 35;
const { WIDTH, HEIGHT } = { WIDTH: 10*FACTOR, HEIGHT: 13*FACTOR };

const FIXME_avatar = "https://i.pinimg.com/236x/7f/e3/b9/7fe3b9cc49d2c141179b7f2ffd553088.jpg";

export default function Register()
{
    const navigate = useNavigate();
    const userService = new UserService();
    const [form, setForm] = useState({ name: "", password: "" });

    return (
        <div className="register">
            <Card title="Registrar" style={{width: `${WIDTH}px`, height: `${HEIGHT}px` }}>
                <form>
                    <div style={{height: `calc(${HEIGHT}px - 6rem)`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        <InputText autoComplete="username" placeholder="Usuário" id="username" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{marginBottom: '10px'}}/>
                        <Password autoComplete="current-password" placeholder="Senha" id="password" value={form.password} feedback={false} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{marginBottom: '10px'}}/>
                        <Button label="Registrar-se" style={{width: '150px'}} onClick={() => {
                            userService.add({ name: form.name, password: form.password }).then((result) => {
                                sessionStorage.setItem("bizu-auth", result.auth);
                                sessionStorage.setItem("bizu-user:id", result.id);
                                sessionStorage.setItem("bizu-user:name", result.name);
                                sessionStorage.setItem("bizu-user:avatar", FIXME_avatar);
                                navigate("/");
                            });
                        }}/>
                    </div>
                </form>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button style={{fontSize: "12px"}} label="Já possui uma conta?" link onClick={() => window.location = "/account/login"}/>
                </div>
            </Card>
        </div>
    );
}