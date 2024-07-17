import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';

export default function FeedbackModal({ level, messages, onHide })
{
    return (
        <Dialog style={{width: "20vw"}} visible={true} onHide={() => onHide ? onHide() : null} header={level}>
            {messages}
        </Dialog>
    );
}
