import React from "react";
import { Box } from "@material-ui/core";

const ButtonBox = ({ children, ...rest }) => {
  return (
    <Box display="flex" alignItems="center" mt={1} {...rest}>
      {children}
    </Box>
  );
};

export default ButtonBox;
