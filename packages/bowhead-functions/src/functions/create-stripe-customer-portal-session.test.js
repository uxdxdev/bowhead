import testFunction from './create-stripe-customer-portal-session';
import { stripe } from '../utils/stripeBackend'
import { verifyToken } from '../utils/firebaseBackend';

jest.mock('../utils/firebaseBackend')
jest.mock('../utils/stripeBackend')
jest.mock('firebase-admin', () => ({
    firestore: jest.fn()
}));
test('should return 401 when token unauthorized', async () => {
    // given       
    verifyToken.mockImplementationOnce(() => false)

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.billingPortal.sessions.create.mockResolvedValue({});

    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    // when
    await testFunction(null, null, callback);

    // then
    expect(result.response.statusCode).toBe(401);
});

test('should return 200 ok when stripe billing portal session creation succeeds', async () => {
    // given        
    verifyToken.mockImplementationOnce(() => true)

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.billingPortal.sessions.create.mockResolvedValue({});


    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    // when
    await testFunction(null, null, callback);

    // then
    expect(result.response.statusCode).toBe(200);
});

test('should return error when stripe billing session creation fails', async () => {
    // given    
    verifyToken.mockImplementationOnce(() => true)

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    const error = {
        error: 'error'
    }

    stripe.billingPortal.sessions.create.mockRejectedValue(error);

    let result = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    // when
    await testFunction(null, null, callback);

    // then
    expect(result.response.statusCode).toBe(400);
    expect(result.error).toBe(error);
});

test('should send correct data to stripe', async () => {
    // given        
    verifyToken.mockImplementationOnce(() => true)

    const event = {
        body: {
            test: 'test'
        },
    }

    JSON.parse = jest.fn().mockImplementationOnce((eventBody) => eventBody);

    stripe.billingPortal.sessions.create.mockResolvedValue(event);

    const callback = jest.fn();

    // when
    await testFunction(event, null, callback);

    // then    
    expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith(event.body)
});
