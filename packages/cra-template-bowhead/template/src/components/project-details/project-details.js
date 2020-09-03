import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PageLoadingSpinner } from "../page-loading-spinner";
import { useInit } from "../../hooks";

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

const ProjectDetails = ({ project, isLoading }) => {

  useInit();

  const classes = useStyles();

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (!project) {
    return (
      <Paper className={classes.paper} variant="outlined">
        <Typography align="center">
          No projects in this workspace.
        </Typography>
      </Paper>
    )
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
      data: { workspaces },
      status: { requested },
    },
  } = state;

  const {
    match: {
      params: { id },
    },
  } = props;


  const activeWorkspaceId = state.workspace?.activeWorkspaceId;
  const projects = workspaces && workspaces[`${activeWorkspaceId}`]?.projects;
  const project = projects && Object.keys(projects).map(key => projects[key]).filter(project => project.id === id)[0];
  const isLoading = !requested[`workspaces/${activeWorkspaceId}`];

  return { project, isLoading };
};

export default connect(mapStateToProps)(ProjectDetails);
