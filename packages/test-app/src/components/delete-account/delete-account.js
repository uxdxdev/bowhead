import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";
import { deleteCurrentUserAccount } from "../../store/actions/authActions";
import { ButtonBox, ButtonLoadingSpinner } from "../";


const DeleteAccount = ({
  email,
  uid,
  deleteCurrentUserAccount,
  deletingUserDataError,
  isDeletingUserData,
  stripeCustomerId
}) => {

  // delete account dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  // email confirmation
  const [emailCheckInput, setEmailCheckInput] = useState(null);

  const handleEmailCheckChange = (event, newValue) => {
    setEmailCheckInput(newValue);
  };

  return (
    <>
      <Typography component="h2" variant="h6">
        Delete account
      </Typography>
      <Typography>
        Deleting your account is permanent. You will not be able to recover your
        account if you change your mind later.
      </Typography>
      <ButtonBox>
        <Button
          color="secondary"
          variant="contained"
          disabled={isDeletingUserData}
          onClick={handleClickOpen}
        >
          Delete Account
        </Button>
        {isDeletingUserData && <ButtonLoadingSpinner />}
      </ButtonBox>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Deleting your account?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={'div'}>
            By deleting your account you agree to the following:
            <ul>
              <li>All user account information will be permanently deleted from our servers.</li>
              <li>All workspace and project information that you own will be permanently deleted from our servers.</li>
              <li>Any active subscriptions will be cancelled immediately.</li>
            </ul>
            You will not be able to recover your data if you change your mind.
          </DialogContentText>
          <Typography>Type in your email to confirm</Typography>

          <TextField
            id="confirm-email-input"
            label="Email"
            required
            type="email"
            autoComplete="email"
            onChange={({ target: { id, value } }) =>
              handleEmailCheckChange(id, value)
            }
            fullWidth
            inputProps={{ maxLength: "100" }}
            helperText={email}
            variant="outlined"
            margin="dense"
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setEmailCheckInput(null);
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteCurrentUserAccount({ uid, stripeCustomerId });
              handleClose();
            }}
            disabled={emailCheckInput !== email}
            variant="contained"
            color="secondary"
          >
            Delete Account & Data
          </Button>
        </DialogActions>
      </Dialog>
      {deletingUserDataError ? (
        <Typography color="error">Error deleting user data</Typography>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    firebase: { auth: { email, uid }, profile: { stripeCustomerId } },
    auth: { deletingUserDataError, isDeletingUserData },
  } = state;

  return {
    stripeCustomerId,
    email,
    uid,
    isDeletingUserData,
    deletingUserDataError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCurrentUserAccount: ({ uid, stripeCustomerId }) => dispatch(deleteCurrentUserAccount({ uid, stripeCustomerId })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
