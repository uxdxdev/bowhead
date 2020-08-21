const sh = require('shelljs')

if (sh.exec(`npx create-react-app temp/my-app --template file:packages/cra-template-bowhead`).code !== 0) {
    sh.echo('Error: user test');
    sh.exit(1);
}