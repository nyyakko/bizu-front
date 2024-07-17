import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';

export class ModalRealm extends React.Component
{
    static show(element)
    {
        // FIXME: Well, how should I do this? A problem for future me!
        const node = document.getElementById("modalRealm");
        const root = createRoot(node);
        root.render(element);
    }

    render()
    {
        return (
            <div id="modalRealm" />
        );
    }
};

export default function WarningModal({ level, messages, onHide })
{
    const [isVisible, setVisible] = useState(true);
    return (
        <Dialog style={{width: "20vw"}} visible={isVisible} onHide={() => { setVisible(false); if (onHide) onHide(); }} header={level}>
            {messages}
        </Dialog>
    );
}
