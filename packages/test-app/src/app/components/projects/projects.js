import React from "react";
import { CreateProject } from '../create-project'
import { ProjectList } from '../project-list'
import { connect } from "react-redux";

const Projects = (props) => {

  const { isWorkspaceOwner } = props;

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
    auth: { activeWorkspaceId },
  } = state;

  const role = workspaces && workspaces[activeWorkspaceId]?.role
  const isWorkspaceOwner = role === 'owner';

  return {
    isWorkspaceOwner
  };
};

export default connect(mapStateToProps)(Projects);
