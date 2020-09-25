import { useSelector } from "react-redux";

const useSettings = () => {
  const state = useSelector((state) => state);
  const {
    firebase: {
      profile: { stripeCustomerId },
    },
    firestore: {
      status: { requested },
    },
  } = state;

  const isRequestedStripeCustomer = requested[`stripe/${stripeCustomerId}`];
  const isLoading = isRequestedStripeCustomer &&
    !(isRequestedStripeCustomer === true)

  return { isLoading };
};

export default useSettings;
