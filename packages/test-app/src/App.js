import React from "react";
import { Bowhead } from "@mortond/bowhead";
import { LandingPage, Terms } from './pages'

const App = () => {

  const unauthRoutesConfig = [
    {
      path: '/terms',
      component: Terms,
    }
  ]

  return (
    <Bowhead
      landingPage={<LandingPage />}
      unauthRoutesConfig={unauthRoutesConfig}
    />
  );
};

export default App;
