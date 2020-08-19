module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended"
    ],
    ignorePatterns: [
        "node_modules",
        "build",
        "dist",
        "docs"
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    env: {
        jest: true,
        node: true,
        browser: true
    },
    plugins: [
        "react",
        "@typescript-eslint"
    ],
    rules: {
        "react/prop-types": "off",
    },
    overrides: [
        {
            "files": [
                "*.ts",
                "*.tsx"
            ],
            "plugins": [
                "@typescript-eslint"
            ],
            "parser": "@typescript-eslint/parser",
            "extends": [
                "plugin:@typescript-eslint/recommended"
            ]
        }
    ],
    settings: {
        react: {
            "version": "latest",
        },
    }
}