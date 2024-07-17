import moment from 'moment';
import { useParams } from 'react-router-dom';
import { useMemo, useRef, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { PanelMenu } from 'primereact/panelmenu';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { ContextMenu } from 'primereact/contextmenu';
import EditActivity, { FIXME_categories, FIXME_bimester } from './modal/EditActivity';
import { useModals } from '../../../../contexts/ModalContext';
import AlertModal from '../../../../modals/AlertModal';

import { ActivityService } from './services/ActivityService';

import "./Activities.css";
import { Tag } from 'primereact/tag';

function dateDifferenceInDays(lhs, rhs)
{
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(lhs.getFullYear(), lhs.getMonth(), lhs.getDate());
    const utc2 = Date.UTC(rhs.getFullYear(), rhs.getMonth(), rhs.getDate());
    return Math.floor((utc2 - utc1) / millisecondsPerDay);
}

function dateDifferenceToPriority(lhs, rhs)
{
    const days = dateDifferenceInDays(lhs, rhs);
    if (days <= 1 * 7) return { value: 'Urgente', status: 'danger' };
    if (days <= 2 * 7) return { value: 'Alta', status: 'warning' };
    if (days <= 2.5 * 7) return { value: 'Normal', status: 'success' };
    if (days >= 4 * 7) return { value: 'Baixa', status: null };
}

export default function Activities()
{
    const activityService = useMemo(() => new ActivityService(), []);
    const { groupId } = useParams();
    const { show: showModal, hide: hideModal } = useModals();
    const [activities, setActivites] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const contextMenu = useRef(null);

    useEffect(() => {
        activityService.list(groupId)
            .then((response) => {
                setActivites(
                    response.map((activity) => {
                        let result = activity;
                        result.due = new Date(activity.due).toLocaleDateString("en-GB");
                        result.bimester = FIXME_bimester[activity.bimester];
                        result.category = FIXME_categories[activity.category];
                        result.priority = dateDifferenceToPriority(new Date(Date.now()), moment(activity.due, "DD/MM/YYYY").toDate());
                        return result;
                    })
                );
            })
            .catch(() =>
                showModal(<AlertModal level="Erro" messages={"Você não é membro deste grupo."} onHide={() => {
                    hideModal();
                    window.location.assign("/grupos");
                }} />)
            );
    }, [activityService, groupId]);

    const sideMenubarOptions = [
        {
            label: 'Filtrar',
            items: [
                { label: 'Prioridade', items: [{ label: 'Urgentes' }, { label: 'Pendentes' }, { label: 'Concluídas' }], },
                { label: 'Categoria', items: [{ label: 'Prova' }, { label: 'Trabalho' }], },
                { label: 'Bimestre', items: [{ label: 'Primeiro' }, { label: 'Segundo' }, { label: 'Terceiro' }, { label: 'Quarto' }], }
            ]
        }
    ];

    const topMenubarOptions = [
        {
            label: 'Nova Atividade', icon: 'pi pi-plus', command: () => {
                showModal(<EditActivity groupId={parseInt(groupId)} onHide={hideModal}/>);
            }
        }
    ];

    const contextMenuOptions = [
        {
            label: "Marcar como feito", icon: "pi pi-check", command: () => {
                activityService.remove(groupId, selectedActivity).then((_) => window.location.reload());
            }
        }
    ];

    return (
        <div className="activities">
            <div className="content" style={{}}>
                <div className="menubar">
                    <PanelMenu style={{width: '100%', height: 'calc(100vh - 6rem)'}} model={sideMenubarOptions} />
                </div>
                <div className="datatable">
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Menubar style={{padding: '5px 5px'}} model={topMenubarOptions} />
                        <div style={{display: 'flex', flexDirection: 'row' }}>
                            <Button label="Procurar" style={{ marginRight: '10px'}} icon="pi pi-search" onClick={() => alert("TBD")}/>
                            <InputText style={{width: 'calc(30vw)'}} placeholder="Descrição..." />
                        </div>
                    </div>
                    <ContextMenu ref={contextMenu} onHide={() => setSelectedActivity(null)} model={contextMenuOptions} />
                    <DataTable
                        value={activities}
                        onContextMenu={(e) => contextMenu.current.show(e.originalEvent)}
                        contextMenuSelection={selectedActivity}
                        onContextMenuSelectionChange={(e) => setSelectedActivity(e.value)}
                        style={{marginTop: '10px'}}
                        emptyMessage="Nenhuma atividade pendente."
                        showGridlines={true}
                    >
                        <Column field="category" header="Categoria" style={{width: '8px'}} />
                        <Column header="Prioridade" style={{width: '8px'}} body={(activity) => {
                            return <Tag value={activity.priority.value} severity={activity.priority.status}/>
                        }} />
                        <Column field="bimester" header="Bimestre" style={{width: '8px'}} />
                        <Column field="due" header="Prazo" />
                        <Column field="subject" header="Matéria" />
                        <Column field="description" header="Descrição" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
