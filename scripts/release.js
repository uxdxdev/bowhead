const sh = require('shelljs')

if (sh.exec(`cross-env HUSKY_BYPASS=true lerna publish --conventional-commits --yes`).code !== 0) {
    sh.echo('Error: Releasing NPM packages');
    sh.exit(1);
}