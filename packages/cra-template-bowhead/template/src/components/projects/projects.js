import React from "react";
import { CreateProject } from '../create-project'
import { ProjectList } from '../project-list'
import { useInit } from '../../hooks'

const Projects = () => {

  const { isWorkspaceOwner } = useInit();

  return (
    <>
      {isWorkspaceOwner && <CreateProject />}
      <ProjectList />
    </>
  );
};

export default Projects;
