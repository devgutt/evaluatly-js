module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "globals": {
        "Evaluatly": "writeable",
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "Stripe": "readonly",
        "gtag": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-console" : "off",
        "no-unused-vars" : ["warn", { "varsIgnorePattern": "ignored" }]
    },
    "settings": {
        "propWrapperFunctions": [
            "forbidExtraProps",
            {"property": "freeze", "object": "Object"},
            {"property": "myFavoriteWrapper"}
        ],
        "linkComponents": [
          "Hyperlink",
          {"name": "Link", "linkAttribute": "to"}
        ]
      }
};