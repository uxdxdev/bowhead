import testFunction from './webhook-stripe';
import { stripe } from '../utils/backend/stripeBackend'
// import { firestore } from '../utils/backend/firebaseBackend';

jest.mock('../utils/backend/firebaseBackend')
jest.mock('../utils/backend/stripeBackend')

test('should return 401 when stripe.webhooks.constructEvent fails', async () => {
    // given
    stripe.webhooks.constructEvent.mockImplementationOnce(() => {
        throw Error('fail')
    })

    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    const event = { headers: { 'stripe-signature': 'test' } }

    // when
    console.log(testFunction.dbUpdateCustomerData)
    await testFunction.handler(event, null, callback);

    // then
    expect(result.response.statusCode).toBe(400);
});


