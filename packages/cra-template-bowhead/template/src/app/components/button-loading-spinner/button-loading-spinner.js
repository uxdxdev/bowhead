import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

const ButtonLoadingSpinner = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" ml={2}>
      <CircularProgress size={24} />
    </Box>
  );
};

export default ButtonLoadingSpinner;
