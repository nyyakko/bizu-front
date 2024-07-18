import React, { useContext, useState } from "react";

export const ModalContext = React.createContext();

export function ModalProvider({ children })
{
    const useModal = () => {
        const [visible, setVisible] = useState(false);
        const [content, setContent] = useState(null);
        const handle = (content) => {
            setVisible(!visible);
            if (content) setContent(content);
        };
        return {handle, content, visible};
    };

    const {handle, content, visible} = useModal();

    return (
        <ModalContext.Provider value={{
            handle: handle,
            visible: visible,
            content: content
        }}>
        {content}
        {children}
        </ModalContext.Provider>
    );
}

export function useModal()
{
    return useContext(ModalContext);
}

