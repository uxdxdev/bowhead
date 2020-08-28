import example from './example';

test('should return 200 ok', async () => {
    // given
    let result = null;

    const event = null;
    const context = null;
    const callback = (error, response) => {
        result = { error, response }
    }

    // when
    await example.handler(event, context, callback);

    // then
    expect(result.error).toBeNull();
    expect(result.response.statusCode).toBe(200);
    expect(result.response.body).toBe('{"test":"pass"}');
});