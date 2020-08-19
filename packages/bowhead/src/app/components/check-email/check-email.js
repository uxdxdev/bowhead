import React from "react";
import { Box, Typography } from "@material-ui/core";
import { EmailOutlined as EmailIcon } from "@material-ui/icons";

const CheckEmail = () => {
  return (
    <>
      <Box align="center">
        <EmailIcon style={{ fontSize: 100 }} />
      </Box>
      <Typography component="h1" variant="h1" gutterBottom align="center">
        Check your inbox.
      </Typography>
      <Typography align="center">
        We just emailed a confirmation link to you.
      </Typography>
      <Typography align="center">
        Clicking the link will sign you in.
      </Typography>
    </>
  );
};

export default CheckEmail;
