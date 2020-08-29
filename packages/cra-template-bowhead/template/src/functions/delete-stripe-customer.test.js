import testFunction from './delete-stripe-customer';
import { stripe } from '../utils/backend/stripeBackend'
import { verifyToken } from '../utils/backend/firebaseBackend';

jest.mock('../utils/backend/firebaseBackend')
jest.mock('../utils/backend/stripeBackend')
jest.mock('firebase-admin', () => ({
    firestore: jest.fn()
}));

test('should return 401 when token unauthorized', async () => {
    // given        
    verifyToken.mockImplementationOnce(() => false)

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.customers.del.mockResolvedValue({});

    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    const event = { body: { stripeCustomerId: 'test' } }


    // when
    await testFunction.handler(event, null, callback);

    // then
    expect(result.response.statusCode).toBe(401);
});

test('should return 200 ok when stripe delete customer succeeds', async () => {
    // given        
    verifyToken.mockImplementationOnce(() => true)

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.customers.del.mockResolvedValue({});

    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    const event = { body: { stripeCustomerId: 'test' } }

    // when
    await testFunction.handler(event, null, callback);

    // then
    expect(result.response.statusCode).toBe(200);
});

test('should return error when stripe fails', async () => {
    // given        
    verifyToken.mockImplementationOnce(() => true)

    const error = {
        error: 'error'
    }

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.customers.del.mockRejectedValue(error);

    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    const event = { body: { stripeCustomerId: 'test' } }

    // when
    await testFunction.handler(event, null, callback);

    // then
    expect(result.response.statusCode).toBe(400);
    expect(result.error).toBe(error);
});

test('should delete customer by customerId', async () => {
    // given
    verifyToken.mockImplementationOnce(() => true)

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.customers.del.mockResolvedValue({});

    const callback = jest.fn()

    const stripeCustomerId = 123;
    const event = { body: { stripeCustomerId } }

    // when
    await testFunction.handler(event, null, callback);

    // then    
    expect(stripe.customers.del).toHaveBeenCalledWith(stripeCustomerId)
});

