const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack')

module.exports = {
    externals: [nodeExternals()],
    plugins: [new Dotenv({
        path: './.env.netlify'
    })],
};