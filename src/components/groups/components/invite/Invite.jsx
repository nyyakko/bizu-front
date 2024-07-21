import AlertModal from "../../../../modals/AlertModal";
import { GroupService } from "../../services/GroupService";
import { useEffect, useMemo } from "react";
import { useModal } from "../../../../contexts/ModalContext";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Invite()
{
    const navigate = useNavigate();

    const [searchParams, _] = useSearchParams();
    const { handle: handleModal } = useModal();

    const groupService = useMemo(() => new GroupService(), []);

    useEffect(() => {
        groupService.joinGroupByInvite(searchParams.get("key")).then((result) => {
            navigate(`/grupos/${result.id}/atividades`);
        }).catch((e) => {
            if (parseInt(e) === 404) handleModal(<AlertModal level="Erro" messages="Convite inválido" onHide={() => navigate("/")} />);
            if (parseInt(e) === 403) handleModal(<AlertModal level="Erro" messages="Você já faz parte deste grupo" onHide={() => navigate("/")} />);
        });
    }, [groupService]);

    return <></>;
}
