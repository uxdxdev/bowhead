import React from 'react'
import { useSelector } from "react-redux";
import {
    isLoaded,
} from "react-redux-firebase";
import { PageLoadingSpinner } from "../";

const AuthIsLoaded = ({ children }) => {
    const auth = useSelector((state) => state.firebase.auth);
    if (!isLoaded(auth)) return <PageLoadingSpinner />;
    return children;
};

export default AuthIsLoaded;