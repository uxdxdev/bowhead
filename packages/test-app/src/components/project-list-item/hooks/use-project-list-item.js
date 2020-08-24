import { useSelector, useDispatch } from "react-redux";
import { deleteProjectFromWorkspace } from "../../../store/actions/projectActions";

const useProjectListItem = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();

    const {
        auth: { activeWorkspaceId },
        firebase: { profile: { workspaces } }
    } = state;

    const role = workspaces[activeWorkspaceId]?.role
    const isOwner = role === 'owner'

    const deleteProject = ({ projectId, workspaceId }) => dispatch(deleteProjectFromWorkspace({ projectId, workspaceId }))

    return {
        activeWorkspaceId,
        isOwner,
        deleteProject
    };
}

export { useProjectListItem }