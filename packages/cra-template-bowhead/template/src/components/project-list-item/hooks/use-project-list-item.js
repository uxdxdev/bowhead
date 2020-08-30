import { useSelector, useDispatch } from "react-redux";
import { deleteProject } from "../../../actions/projectActions";

const useProjectListItem = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();

    const {
        workspace: { activeWorkspaceId },
        firebase: { profile: { workspaces } }
    } = state;

    const role = workspaces[activeWorkspaceId]?.role
    const isOwner = role === 'owner'

    const handleDeleteProject = ({ projectId, workspaceId }) => dispatch(deleteProject({ projectId, workspaceId }))

    return {
        activeWorkspaceId,
        isOwner,
        handleDeleteProject
    };
}

export { useProjectListItem }