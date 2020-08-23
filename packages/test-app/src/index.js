import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./app";
import * as serviceWorker from "./serviceWorker";
import { Route } from "react-router-dom";
import { LandingPage } from "./pages/landing-page";



ReactDOM.render(
    <App>
        <Route exact path="/" component={LandingPage} />
        <Route path="/terms" component={() => <div>Terms</div>} />
    </App>,
    document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
