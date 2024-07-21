import React, { useContext, useEffect, useMemo, useState } from "react";
import { MemberService } from "../services/MemberService";

export const MemberContext = React.createContext();

export function MemberProvider({ children })
{
    const [group, setGroup] = useState(null);
    const [member, setMember] = useState({
        role: "ROLE_GUEST"
    });

    const memberService = useMemo(() => new MemberService(), []);

    useEffect(() => {
        if (group)
        {
            memberService.get(group, JSON.parse(sessionStorage.getItem("user"))?.["id"]).then((result) => {
                setMember({ role: result.userRole });
            }).catch((e) => console.error(e));
        }
    }, [group]);

    return (
        <MemberContext.Provider value={{
            member: member,
            setGroup: setGroup
        }}>
            {children}
        </MemberContext.Provider>
    );
}

export function useMember()
{
    return useContext(MemberContext);
}

