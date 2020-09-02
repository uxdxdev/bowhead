import { useSelector } from "react-redux";
import * as constants from "../../../utils/constants"

const useAccount = () => {
  const state = useSelector((state) => state);
  const {
    firebase: {
      profile: { stripeCustomerId },
    },
    firestore: {
      status: { requested },
    },
  } = state;

  const isRequestedStripeCustomer = requested[`${constants.FIRESTORE_COLLECTIONS.STRIPE}/${stripeCustomerId}`];
  const isLoading = isRequestedStripeCustomer &&
    !(isRequestedStripeCustomer === true)

  return { isLoading };
};

export default useAccount;
