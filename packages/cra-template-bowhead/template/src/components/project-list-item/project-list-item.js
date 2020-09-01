import React from "react";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { Paper, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonBox } from "../button-box";
import { useProjectListItem } from "./hooks";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0, 2, 0),
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

const ProjectListItem = (props) => {
  const {
    project: { id, title, createdAt },
  } = props;
  const classes = useStyles();
  const {
    isOwner,
    handleDeleteProject
  } = useProjectListItem()

  return (
    <Paper className={classes.paper} variant="outlined">
      <Typography>Created {moment(createdAt.toDate()).calendar()}</Typography>
      <Typography component="h2" variant="h5" noWrap>
        {title}
      </Typography>
      <ButtonBox>
        <Button
          component={NavLink}
          to={`/dashboard/project/${id}`}
          variant="contained"
          color="primary"
          className={classes.button}
          size="small"
        >
          Open
        </Button>
        {isOwner && <Button
          color="secondary"
          variant="contained"
          onClick={() => handleDeleteProject({ projectId: id })}
          size="small"
        >
          Delete
        </Button>}
      </ButtonBox>
    </Paper>
  );
};

export default ProjectListItem;
