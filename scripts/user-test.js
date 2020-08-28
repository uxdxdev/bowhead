const sh = require('shelljs')

if (sh.rm('-rf', './temp/my-app').code !== 0) {
    sh.echo('Error: Removing temp directory');
    sh.exit(1);
}

if (sh.exec(`npx create-react-app temp/my-app --template file:packages/cra-template-bowhead`).code !== 0) {
    sh.echo('Error: user test');
    sh.exit(1);
}