import React from "react";
import { CreateProject } from '../create-project'
import { ProjectList } from '../project-list'
import { useWorkspaces } from '../../hooks'

const Projects = () => {

  const { isWorkspaceOwner } = useWorkspaces();

  return (
    <>
      {isWorkspaceOwner && <CreateProject />}
      <ProjectList />
    </>
  );
};

export default Projects;
