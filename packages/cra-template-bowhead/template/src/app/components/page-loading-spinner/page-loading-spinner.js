import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

const PageLoadingSpinner = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default PageLoadingSpinner;
