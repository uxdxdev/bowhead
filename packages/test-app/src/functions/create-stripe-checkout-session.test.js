import testFunction from './create-stripe-checkout-session';
import { stripe } from '../utils/backend/stripeBackend'
import { verifyToken } from '../utils/backend/firebaseBackend';

jest.mock('../utils/backend/firebaseBackend')
jest.mock('../utils/backend/stripeBackend')
jest.mock('firebase-admin', () => ({
    firestore: jest.fn()
}));

test('should return 401 when token unauthorized', async () => {
    // given    
    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);
    verifyToken.mockImplementationOnce(() => false)

    stripe.checkout.sessions.create.mockResolvedValue({});

    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    // when
    await testFunction.handler(null, null, callback);

    // then
    expect(result.response.statusCode).toBe(401);
});

test('should return 200 ok when stripe checkout session creation succeeds', async () => {
    // given        
    verifyToken.mockImplementationOnce(() => true)

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.checkout.sessions.create.mockResolvedValue({});

    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    // when
    await testFunction.handler(null, null, callback);

    // then
    expect(result.response.statusCode).toBe(200);
});

test('should return error when stripe checkout session creation fails', async () => {
    // given        
    verifyToken.mockImplementationOnce(() => true)

    const error = {
        error: 'error'
    }

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    // create stripe session failed
    stripe.checkout.sessions.create.mockRejectedValue(error);

    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    // when
    await testFunction.handler(null, null, callback);

    // then
    expect(result.response.statusCode).toBe(400);
    expect(result.error).toBe(error);
});

test('should remove subscription_data before call to stripe API when customer data exists', async () => {
    // given        
    verifyToken.mockImplementationOnce(() => true)

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.checkout.sessions.create.mockResolvedValue({});

    const event = {
        body: {
            customer: 'test',
            'subscription_data': 'test'
        },
    }
    const callback = jest.fn();

    // when
    await testFunction.handler(event, null, callback);

    // then    
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({ customer: 'test' })
});

test('should send subscription_data to stripe API when customer data does not exist', async () => {
    // given        
    verifyToken.mockImplementationOnce(() => true)

    const event = {
        body: {
            // no customer data
            'subscription_data': 'test'
        },
    }

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.checkout.sessions.create.mockResolvedValue(event);

    const callback = jest.fn();

    // when
    await testFunction.handler(event, null, callback);

    // then    
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({ 'subscription_data': 'test' })
});



