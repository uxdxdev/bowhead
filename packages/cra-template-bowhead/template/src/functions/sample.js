
exports.handler = async (event, context, callback) => {
    callback(null, {
        statusCode: 200, body: JSON.stringify({test:'pass'})
    })
}