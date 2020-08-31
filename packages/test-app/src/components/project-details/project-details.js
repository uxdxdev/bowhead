import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PageLoadingSpinner } from "../";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0, 2, 0),
  },
  title: { overflowWrap: "break-word" },
  summary: {
    overflowWrap: "break-word",
  },
}));

const ProjectDetails = ({ project, isFirestoreRequesting }) => {
  const classes = useStyles();

  if (isFirestoreRequesting) {
    return <PageLoadingSpinner />;
  }

  if (!project) {
    return (<Paper className={classes.paper} variant="outlined">
      <Typography align="center">
        No projects in this workspace.
    </Typography>
    </Paper>)
  }

  const { title, summary, createdAt } = project;

  return (
    <Paper className={classes.paper} variant="outlined">
      <Typography>Created {moment(createdAt.toDate()).calendar()}</Typography>
      <Typography className={classes.title} component="h2" variant="h5">
        {title}
      </Typography>
      <Typography className={classes.summary}>{summary}</Typography>
    </Paper>
  );
};

const mapStateToProps = (state, props) => {
  const {
    firestore: {
      data,
      status: { requesting },
    },
    workspace: { activeWorkspaceId },
  } = state;
  const {
    match: {
      params: { id },
    },
  } = props;

  const projects = data && data[`${activeWorkspaceId}::projects`];
  const project = projects && projects[id];
  const isFirestoreRequesting = requesting[activeWorkspaceId];

  return { project, isFirestoreRequesting };
};

export default connect(mapStateToProps)(ProjectDetails);
