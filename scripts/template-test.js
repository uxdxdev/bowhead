const sh = require('shelljs')
const testAppPackageJson = require('../packages/test-app/package.json')
const templateAppPackageJson = require('../packages/cra-template-bowhead/template.json')

const testAppDeps = JSON.stringify(testAppPackageJson.dependencies)
const templateAppDeps = JSON.stringify(templateAppPackageJson.package.dependencies)

if (testAppDeps !== templateAppDeps) {
    sh.echo('Error: template not updated');
    sh.exit(1);
}