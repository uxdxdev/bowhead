import React from "react";
import { ProjectListItem } from "./project-list-item";
import { connect } from "react-redux";
import { PageLoadingSpinner } from "../";
import { Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0, 2, 0),
  }
}));

const ProjectList = (props) => {
  const { projects, isFirestoreRequesting } = props;
  const classes = useStyles();

  if (isFirestoreRequesting) {
    return <PageLoadingSpinner />;
  }

  if (!projects || projects?.length === 0) {
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
      {projects?.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    firestore: {
      ordered,
      status: { requesting },
    },
    auth: { activeWorkspaceId },
  } = state;

  const projects = ordered && ordered[`${activeWorkspaceId}::projects`];
  const isFirestoreRequesting = requesting[activeWorkspaceId];

  return {
    projects,
    isFirestoreRequesting,
  };
};

export default connect(mapStateToProps)(ProjectList);
