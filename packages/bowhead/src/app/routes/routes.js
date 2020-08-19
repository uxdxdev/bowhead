import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LandingPage } from "./landing-page";
import { Signin } from "./sign-in";
import { Verify } from "./verify";
import { Dashboard } from "./dashboard";
import { AuthenticatedRoute } from "../components";

const Routes = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/signin" component={Signin} />
        <Route path="/verify" component={Verify} />
        <Route path="/terms" component={() => <div>Terms</div>} />
        <AuthenticatedRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
