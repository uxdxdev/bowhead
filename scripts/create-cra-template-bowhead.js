const sh = require('shelljs')
const fs = require('fs');
const bowheadPackageJson = require('../packages/test-app/package.json')

// prepare bowhead template directory
if (sh.rm('-rf', './packages/cra-template-bowhead/template/*').code !== 0) {
    sh.echo('Error: Removing files from template directory');
    sh.exit(1);
}

if (sh.rm('-f', './packages/cra-template-bowhead/template.json').code !== 0) {
    sh.echo('Error: Removing template.json');
    sh.exit(1);
}

// make template directory
if (sh.mkdir('-p', './packages/cra-template-bowhead/template').code !== 0) {
    sh.echo('Error: Creating template directory');
    sh.exit(1);
}

// copy directories from test-app to cra-template-bowhead/template
const directories = ['config', 'public', 'scripts', 'src', 'functions-netlify', 'functions-utils']
directories.forEach(directory => {
    if (sh.cp('-r', `./packages/test-app/${directory}`, `./packages/cra-template-bowhead/template/${directory}`).code !== 0) {
        sh.echo('Error: Copying bowhead directories to template directory');
        sh.exit(1);
    }
})

// copy files from test-app to cra-template-bowhead/template
const files = ['firestore.rules', 'netlify.toml', 'README.md', '.eslintignore']
files.forEach(file => {
    if (sh.cp(`./packages/test-app/${file}`, `./packages/cra-template-bowhead/template/${file}`).code !== 0) {
        sh.echo('Error: Copying bowhead files to template directory');
        sh.exit(1);
    }
})

if (sh.cp(`./packages/test-app/.env`, `./packages/cra-template-bowhead/template/.env.sample`).code !== 0) {
    sh.echo('Error: Copying .env');
    sh.exit(1);
}

// replace all env variable values
if (sh.sed('-i', '=.*$', '=YOUR_ENV_VARIABLE_VALUE', './packages/cra-template-bowhead/template/.env.sample').code !== 0) {
    sh.echo('Error: Replacing values in .env.sample');
    sh.exit(1);
}

// rename files from test-app to cra-template-bowhead/template
if (sh.cp(`./packages/test-app/.gitignore`, `./packages/cra-template-bowhead/template/gitignore`).code !== 0) {
    sh.echo('Error: Copying .gitignore');
    sh.exit(1);
}

// create template.json
const templateJson = {
    package: {
        dependencies: bowheadPackageJson.dependencies,
        scripts: bowheadPackageJson.scripts,
        eslintConfig: bowheadPackageJson.eslintConfig,
        browserslist: bowheadPackageJson.browserslist,
        jest: bowheadPackageJson.jest
    }
}
const templateJsonStr = JSON.stringify(templateJson, null, 2);

fs.writeFileSync('./packages/cra-template-bowhead/template.json', templateJsonStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('Creating template.json done');
});

// copy readme file
if (sh.cp(`./packages/test-app/README.md`, `./packages/cra-template-bowhead/README.md`).code !== 0) {
    sh.echo('Error: Copying README.md failed');
    sh.exit(1);
}

// remove .git repo files
if (sh.rm('-rf', './packages/cra-template-bowhead/.git').code !== 0) {
    sh.echo('Error: Removing .git directory');
    sh.exit(1);
}

console.log('Building cra-template-bowhead done.')