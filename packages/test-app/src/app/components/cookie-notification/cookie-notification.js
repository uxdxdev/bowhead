import React from "react";
import { Button, Snackbar } from "@material-ui/core";
import { useCookies } from "react-cookie";

const CookieNotification = () => {
  const [cookies, setCookie] = useCookies(["cookie_consent"]);
  const { cookie_consent } = cookies;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={!cookie_consent}
      message="We use cookies to give you the best experience on our website. If you continue to use this site we will assume that you are happy with it."
      action={
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={() => setCookie("cookie_consent", true)}
        >
          Hide
        </Button>
      }
    />
  );
};

export default CookieNotification;
