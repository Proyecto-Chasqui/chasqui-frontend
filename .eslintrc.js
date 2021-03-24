module.exports = {
    "plugins": ["angular"],
    "env": {
        "browser": true,
        "jasmine": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2015,
        "sourceType": "module"
    },
    "globals": {
        "angular": true,
        "module": true,
        "inject": true,
        "moment": true
    },
    "rules": {
        "no-mixed-spaces-and-tabs": 0,
        "no-extra-semi": 0
    }
};
