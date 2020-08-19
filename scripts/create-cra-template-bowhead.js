const sh = require('shelljs')
const fs = require('fs');
const bowheadPackageJson = require('../packages/bowhead/package.json')

// prepare bowhead template directory
if (sh.rm('-rf', './packages/cra-template-bowhead/template/*').code !== 0) {
    sh.echo('Error: Removing files from template directory');
    sh.exit(1);
}

if (sh.rm('-f', './packages/cra-template-bowhead/template.json').code !== 0) {
    sh.echo('Error: Removing template.json');
    sh.exit(1);
}

// copy directories from bowhead to cra-template-bowhead/template
const directories = ['config', 'public', 'scripts', 'src']
directories.forEach(directory => {
    if (sh.cp('-rf', `./packages/bowhead/${directory}`, `./packages/cra-template-bowhead/template/${directory}`).code !== 0) {
        sh.echo('Error: Copying bowhead directories to template directory');
        sh.exit(1);
    }
})

// copy files from bowhead to cra-template-bowhead/template
const files = ['firestore.rules', 'netlify.toml', 'README.md', 'yarn.lock', '.eslintignore']
files.forEach(file => {
    if (sh.cp('-f', `./packages/bowhead/${file}`, `./packages/cra-template-bowhead/template/${file}`).code !== 0) {
        sh.echo('Error: Copying bowhead files to template directory');
        sh.exit(1);
    }
})

// rename files from bowhead to cra-template-bowhead/template
if (sh.cp(`./packages/bowhead/.gitignore`, `./packages/cra-template-bowhead/template/gitignore`).code !== 0) {
    sh.echo('Error: Copying .gitignore');
    sh.exit(1);
}

if (sh.cp(`./packages/bowhead/.env`, `./packages/cra-template-bowhead/template/env.sample`).code !== 0) {
    sh.echo('Error: Copying .env.sample');
    sh.exit(1);
}

// replace all env variable values
if (sh.sed('-i', '=.*$', '=YOUR_ENV_VARIABLE_VALUE', './packages/cra-template-bowhead/template/env.sample').code !== 0) {
    sh.echo('Error: Replacing values in .env.sample');
    sh.exit(1);
}

// create template.json
const templateJson = {
    package: {
        dependencies: bowheadPackageJson.dependencies,
        scripts: bowheadPackageJson.scripts,
        eslintConfig: bowheadPackageJson.eslintConfig,
        browserslist: bowheadPackageJson.browserslist
    }
}
const templateJsonStr = JSON.stringify(templateJson, null, 2);

fs.writeFile('./packages/cra-template-bowhead/template.json', templateJsonStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('Creating template.json done');
});

// remove .git repo files
if (sh.rm('-rf', './packages/cra-template-bowhead/.git').code !== 0) {
    sh.echo('Error: Removing .git directory');
    sh.exit(1);
}

// commit changes
if (sh.exec('git commit -am "chore(cra-template-bowhead): updated template"').code !== 0) {
    sh.echo('Error: Removing .git directory');
    sh.exit(1);
}
