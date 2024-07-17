import { Dialog } from 'primereact/dialog';

export default function AlertModal({ level, messages, onHide })
{
    return (
        <Dialog style={{width: "20vw"}} visible={true} onHide={() => onHide ? onHide() : null} header={level}>
            {messages}
        </Dialog>
    );
}
