import React from "react";
import { ProjectListItem } from "../project-list-item";
import { connect } from "react-redux";
import { PageLoadingSpinner } from "../page-loading-spinner";
import { Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0, 2, 0),
  }
}));

const ProjectList = (props) => {

  const { projects, isLoading } = props;
  const classes = useStyles();

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  console.log(projects)
  if (projects === undefined || projects.length <= 0) {
    return (
      <Paper className={classes.paper} variant="outlined">
        <Typography align="center">
          No projects in this workspace.
        </Typography>
      </Paper>
    )
  }

  return (
    <>
      {projects && projects?.map((project) => {
        return (
          <ProjectListItem key={project.id} project={project} />
        )
      })}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    firestore: {
      data: { workspaces },
      status: { requesting },
    },
  } = state;

  const activeWorkspaceId = state.workspace?.activeWorkspaceId
  const projectsMap = workspaces && workspaces[`${activeWorkspaceId}`]?.projects;
  const projects = projectsMap && Object.keys(projectsMap).map(key => projectsMap[key])
  const isLoading = requesting[`workspaces/${activeWorkspaceId}`]

  return {
    projects,
    isLoading,
  };
};

export default connect(mapStateToProps)(ProjectList);
