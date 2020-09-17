const sh = require('shelljs')

require('dotenv').config({
    path: './.env.functions'
})

if (sh.exec(`netlify deploy --auth ${process.env.NETLIFY_AUTH_TOKEN} --dir=build --functions=functions/build --prod`).code !== 0) {
    sh.echo('Error: Netlify deploy falied');
    sh.exit(1);
}