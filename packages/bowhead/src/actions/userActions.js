import { isSignInWithEmailLink, signInWithEmailLink, verifyUserSignInUpdate } from '../api/firebase'
import * as userSlice from '../store/userSlice'

export const verifyUser = () => {
  return async (dispatch) => {
    dispatch(userSlice.verifyUser());

    if (isSignInWithEmailLink({ location: window.location.href })) {
      var email = window.localStorage.getItem("emailForSignIn");
      window.localStorage.removeItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }

      await signInWithEmailLink({ email, location: window.location.href })
        .then(async result => {
          const uid = result.user.uid;

          await verifyUserSignInUpdate({ uid, email })
            .then(() => {
              dispatch(userSlice.verifyUserSuccess());
            })
            .catch(error => {
              dispatch(userSlice.verifyUserError(error));
            });
        })
        .catch(error => {
          dispatch(userSlice.verifyUserError(error));
        });
    }
  };
};
