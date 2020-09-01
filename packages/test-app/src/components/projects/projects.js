import React, { useEffect } from "react";
import { CreateProject } from '../create-project'
import { ProjectList } from '../project-list'
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import * as constants from '../../utils/constants'
import { updateFirestoreListeners } from '@mortond/bowhead'
import { setActiveWorkspace } from '../../actions/workspaceActions'

const Projects = () => {

  const state = useSelector((state) => state);
  const dispatch = useDispatch()

  const {
    firebase: {
      profile: { workspaces },
    },
    workspace: { activeWorkspaceId },

  } = state;

  const role = workspaces && workspaces[activeWorkspaceId]?.role
  const isWorkspaceOwner = role === 'owner';


  useEffect(() => {
    const collections = workspaces && Object.keys(workspaces).map((workspaceId) => {
      return {
        collection: constants.FIRESTORE_COLLECTIONS.WORKSPACES,
        doc: workspaceId,
        orderBy: ["createdAt", "desc"],
        subcollections: [{ collection: constants.FIRESTORE_COLLECTIONS.PROJECTS }],
        storeAs: `${workspaceId}::projects`,
      }
    })

    dispatch(updateFirestoreListeners(collections))
  }, [workspaces, dispatch]);

  useEffect(() => {
    const firstWorkspace = workspaces && Object.keys(workspaces)[0];
    !activeWorkspaceId && firstWorkspace && dispatch(setActiveWorkspace(firstWorkspace))
  }, [activeWorkspaceId, dispatch, workspaces])

  return (
    <>
      {isWorkspaceOwner && <CreateProject />}
      <ProjectList />
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    firebase: {
      profile: { workspaces },
    },
    workspace: { activeWorkspaceId },
  } = state;

  const role = workspaces && workspaces[activeWorkspaceId]?.role
  const isWorkspaceOwner = role === 'owner';

  return {
    isWorkspaceOwner
  };
};

export default connect(mapStateToProps)(Projects);
