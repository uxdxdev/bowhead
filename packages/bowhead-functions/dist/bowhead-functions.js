import admin from 'firebase-admin';
import Stripe from 'stripe';

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

const firebase = config => {
  const projectId = config.projectId;
  const privateKey = config.privateKey;
  const clientEmail = config.clientEmail;
  const databaseProductionUrl = config.databaseProductionUrl;

  if (admin.apps && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        "project_id": projectId,
        "private_key": privateKey == null ? void 0 : privateKey.replace(/\\n/g, '\n'),
        "client_email": clientEmail
      }),
      databaseURL: databaseProductionUrl
    });

    if (process.env.NODE_ENV === 'development') {
      admin.firestore().settings({
        host: "localhost:8080",
        ssl: false
      });
    }
  }

  const verifyToken = function (idToken) {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(admin.auth().verifyIdToken(idToken));
    }, function () {
      // invalid token
      return null;
    }));
  };

  const firestore = admin.firestore();
  return {
    firestore,
    verifyToken
  };
};

const STRIPE_SUBSCRIPTION_STATUS = {
  TRIALING: 'trialing',
  ACTIVE: 'active',
  CANCELLED: 'canceled'
};

const isValidStatus = status => {
  return status === STRIPE_SUBSCRIPTION_STATUS.TRIALING || status === STRIPE_SUBSCRIPTION_STATUS.ACTIVE || status === STRIPE_SUBSCRIPTION_STATUS.CANCELLED;
};

const dbUpdateSubscriptionByCustomerId = function (firestore, data) {
  try {
    const stripeCustomerId = data.customer || null;
    const status = data.status || null;
    const planId = data.plan.id || null;
    const interval = data.plan.interval || null;

    const _temp2 = function () {
      if (isValidStatus(status) && stripeCustomerId && planId && interval) {
        const _temp = function () {
          if (status === STRIPE_SUBSCRIPTION_STATUS.CANCELLED) {
            // delete stripe customer data from DB
            return Promise.resolve(firestore.collection("stripe").doc(stripeCustomerId).delete()).then(function () {});
          } else {
            // update stripe customer data in DB
            return Promise.resolve(firestore.collection("stripe").doc(stripeCustomerId).set({
              status,
              planId,
              interval
            }, {
              merge: true
            })).then(function () {});
          }
        }();

        if (_temp && _temp.then) return _temp.then(function () {});
      }
    }();

    return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
const dbUpdateCustomerData = (firestore, data) => {
  const stripeCustomerId = data.customer || null;
  const uid = data.client_reference_id || null;

  if (stripeCustomerId && uid) {
    const userRef = firestore.collection("users").doc(uid);
    const batch = firestore.batch(); // user

    batch.set(userRef, {
      stripeCustomerId
    }, {
      merge: true
    }); // stripe

    const stripeRef = firestore.collection("stripe").doc(stripeCustomerId);
    batch.set(stripeRef, {
      uid
    }, {
      merge: true
    });
    return batch.commit();
  } else {
    throw new Error(`dbUpdateCustomerData(): stripeCustomerId: ${stripeCustomerId} uid:${uid}`);
  }
};

function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }

        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }

    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }

    pact.s = state;
    pact.v = value;
    const observer = pact.o;

    if (observer) {
      observer(pact);
    }
  }
}

const _Pact = /*#__PURE__*/function () {
  function _Pact() {}

  _Pact.prototype.then = function (onFulfilled, onRejected) {
    const result = new _Pact();
    const state = this.s;

    if (state) {
      const callback = state & 1 ? onFulfilled : onRejected;

      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }

        return result;
      } else {
        return this;
      }
    }

    this.o = function (_this) {
      try {
        const value = _this.v;

        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };

    return result;
  };

  return _Pact;
}();

function _switch(discriminant, cases) {
  var dispatchIndex = -1;
  var awaitBody;

  outer: {
    for (var i = 0; i < cases.length; i++) {
      var test = cases[i][0];

      if (test) {
        var testValue = test();

        if (testValue && testValue.then) {
          break outer;
        }

        if (testValue === discriminant) {
          dispatchIndex = i;
          break;
        }
      } else {
        // Found the default case, set it as the pending dispatch case
        dispatchIndex = i;
      }
    }

    if (dispatchIndex !== -1) {
      do {
        var body = cases[dispatchIndex][1];

        while (!body) {
          dispatchIndex++;
          body = cases[dispatchIndex][1];
        }

        var result = body();

        if (result && result.then) {
          awaitBody = true;
          break outer;
        }

        var fallthroughCheck = cases[dispatchIndex][2];
        dispatchIndex++;
      } while (fallthroughCheck && !fallthroughCheck());

      return result;
    }
  }

  const pact = new _Pact();

  const reject = _settle.bind(null, pact, 2);

  (awaitBody ? result.then(_resumeAfterBody) : testValue.then(_resumeAfterTest)).then(void 0, reject);
  return pact;

  function _resumeAfterTest(value) {
    for (;;) {
      if (value === discriminant) {
        dispatchIndex = i;
        break;
      }

      if (++i === cases.length) {
        if (dispatchIndex !== -1) {
          break;
        } else {
          _settle(pact, 1, result);

          return;
        }
      }

      test = cases[i][0];

      if (test) {
        value = test();

        if (value && value.then) {
          value.then(_resumeAfterTest).then(void 0, reject);
          return;
        }
      } else {
        dispatchIndex = i;
      }
    }

    do {
      var body = cases[dispatchIndex][1];

      while (!body) {
        dispatchIndex++;
        body = cases[dispatchIndex][1];
      }

      var result = body();

      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
        return;
      }

      var fallthroughCheck = cases[dispatchIndex][2];
      dispatchIndex++;
    } while (fallthroughCheck && !fallthroughCheck());

    _settle(pact, 1, result);
  }

  function _resumeAfterBody(result) {
    for (;;) {
      var fallthroughCheck = cases[dispatchIndex][2];

      if (!fallthroughCheck || fallthroughCheck()) {
        break;
      }

      dispatchIndex++;
      var body = cases[dispatchIndex][1];

      while (!body) {
        dispatchIndex++;
        body = cases[dispatchIndex][1];
      }

      result = body();

      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
        return;
      }
    }

    _settle(pact, 1, result);
  }
}

class BowheadFunctions {
  constructor(config) {
    // singleton
    if (BowheadFunctions._instance) {
      return BowheadFunctions._instance;
    }

    BowheadFunctions._instance = this;
    this._firebase = firebase(config.firebase);
    this._firestore = this._firebase.firestore;
    this._stripeWebhookSigningSecret = config.stripe.stripeWebhookSigningSecret;
    this._stripe = Stripe(config.stripe.stripeSecretKey, {
      maxNetworkRetries: 3 // Retry a request X times before giving up

    });
  }

  _requestUnauthourised() {
    return {
      error: 'Error: request unauthorised',
      data: {
        statusCode: 401
      }
    };
  }

  webhookStripe({
    stripeSignature,
    rawBody
  }) {
    try {
      let _exit, _interrupt;

      const _this = this;

      function _temp2(_result) {
        return _exit ? _result : Promise.resolve('webhook done');
      }

      let verifiedEvent;

      try {
        verifiedEvent = _this._stripe.webhooks.constructEvent(rawBody, stripeSignature, _this._stripeWebhookSigningSecret);
      } catch (error) {
        // invalid event            
        return Promise.reject(error.message);
      }

      const _temp = _switch(verifiedEvent.type, [[function () {
        return 'customer.subscription.created';
      }, function () {
        return Promise.resolve(dbUpdateSubscriptionByCustomerId(_this._firestore, verifiedEvent.data.object)).then(function () {
          _interrupt = 1;
        });
      }], [function () {
        return 'customer.subscription.updated';
      }, function () {
        return Promise.resolve(dbUpdateSubscriptionByCustomerId(_this._firestore, verifiedEvent.data.object)).then(function () {
          _interrupt = 1;
        });
      }], [function () {
        return 'customer.subscription.deleted';
      }, function () {
        return Promise.resolve(dbUpdateSubscriptionByCustomerId(_this._firestore, verifiedEvent.data.object)).then(function () {
          _interrupt = 1;
        });
      }], [function () {
        return 'checkout.session.completed';
      }, function () {
        return Promise.resolve(dbUpdateCustomerData(_this._firestore, verifiedEvent.data.object)).then(function () {
          _interrupt = 1;
        });
      }], [void 0, function () {
        // unexpected event type
        _exit = 1;
        return Promise.resolve('unexpected event type');
      }]]);

      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  deleteStripeCustomer({
    token,
    data
  }) {
    try {
      const _this2 = this;

      return Promise.resolve(_this2._firebase.verifyToken(token)).then(function (user) {
        const stripeCustomerId = data == null ? void 0 : data.stripeCustomerId; // todo validate data

        return user ? Promise.resolve(_this2._stripe.customers.del(stripeCustomerId)) : _this2._requestUnauthourised();
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  createStripeCustomerPortalSession({
    token,
    data
  }) {
    try {
      const _this3 = this;

      return Promise.resolve(_this3._firebase.verifyToken(token)).then(function (user) {
        return user ? Promise.resolve(_this3._stripe.billingPortal.sessions.create(data).then(session => session)) : _this3._requestUnauthourised();
      }); // todo validate data
    } catch (e) {
      return Promise.reject(e);
    }
  }

  createStripeCheckoutSession({
    token,
    data
  }) {
    try {
      const _this4 = this;

      return Promise.resolve(_this4._firebase.verifyToken(token)).then(function (user) {
        // todo validate data
        if (!user) return _this4._requestUnauthourised(); // do not provide a free trial if the user has previously signed up

        (data == null ? void 0 : data.customer) && (data == null ? true : delete data.subscription_data);
        return Promise.resolve(_this4._stripe.checkout.sessions.create(data).then(session => session));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

}

export default BowheadFunctions;
//# sourceMappingURL=bowhead-functions.js.map
