import { Dialog } from 'primereact/dialog';
import { useModal } from '../contexts/ModalContext';
import { createPortal } from 'react-dom';

export default function AlertModal({ level, messages, onHide })
{
    const {handle, visible} = useModal();

    return createPortal((
        <Dialog header={level} visible={visible} onHide={() => { handle(); if (onHide) onHide(); }} style={{width: "20vw"}}>
            {messages}
        </Dialog>
    ), document.querySelector("#modal-root"));
}
