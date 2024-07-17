import moment from 'moment';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';

import { ActivityService } from '../services/ActivityService';

export const FIXME_bimester = ['Primeiro', 'Segundo', 'Terceiro', 'Quarto'];
export const FIXME_categories = ['Prova', 'Trabalho'];
export const FIXME_subjects = [
    'História',
    'Português',
    'Matemática',
    'Poo',
    'Banco de dados',
    'Inglês',
    'Filosofia',
    'Biologia',
    'Sociologia',
    'Física'
];

export default function EditActivity({ groupId, onHide })
{
    const activityService = new ActivityService();

    const [activity, setActivity] = useState({
        groupId: undefined,
        subject: "",
        bimester: "",
        category: undefined,
        due: undefined,
        description: ""
    });

    return (
        <Dialog header="Nova Atividade" style={{width: "500px"}} visible={true} onHide={() => onHide ? onHide() : null}>
            <div>
                <div>
                    <Dropdown placeholder="Matéria" value={activity.subject} onChange={(e) => setActivity({ ...activity, subject: e.value })} style={{marginRight: "10px", width: "170px"}} options={FIXME_subjects} />
                    <Dropdown placeholder="Bimestre" value={activity.bimester} onChange={(e) => setActivity({ ...activity, bimester: e.value })} style={{marginRight: "10px", width: "130px"}} options={FIXME_bimester} />
                    <Dropdown placeholder="Categoria" value={activity.category} onChange={(e) => setActivity({ ...activity, category: e.value })} style={{width: "140px"}} options={FIXME_categories} />
                </div>
                <InputMask value={activity.due} onChange={(e) => setActivity({ ...activity, due: e.target.value })} mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" style={{marginTop: "10px", width: "calc(500px - 40px)"}} />
                <InputText placeholder="Descrição" value={activity.description} onChange={(e) => setActivity({ ...activity, description: e.target.value })} style={{marginTop: "10px", width: "calc(500px - 40px)"}} />
            </div>
            <Divider />
            <div style={{display: "flex", justifyContent: "right"}}>
                <Button label="Salvar" icon="pi pi-check" onClick={() =>
                    activityService.add(groupId, {
                        subject: activity.subject,
                        bimester: FIXME_bimester.indexOf(activity.bimester),
                        category: FIXME_categories.indexOf(activity.category),
                        due: moment(activity.due, "DD/MM/YYYY").toDate().getTime(),
                        description: activity.description
                    }).then(() => window.location.reload())
                } />
            </div>
        </Dialog>
    );
}
