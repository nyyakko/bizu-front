import React, { useState } from "react";

export const ModalContext = React.createContext();

export function ModalProvider({ children })
{
    const [content, setContent] = useState(null);

    return (
        <ModalContext.Provider value={{
            hide: () => setContent(null),
            show: setContent
        }}>
        { content ? content : null }
        { children }
        </ModalContext.Provider>
    );
}

