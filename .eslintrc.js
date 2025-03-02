module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "no-console": "off",
    "no-unused-vars": "off",
    "no-prototype-builtins": "off",
    "react/jsx-key": "off",
    "react-hooks/exhaustive-deps": "off",
    "no-undef": "off",
    "react/no-children-prop": "off",
    "react/no-unknown-property": "off",
    "no-inner-declarations": "off",
    "react/display-name": "off",
    "no-unsafe-optional-chaining": "off",
    "no-sparse-arrays": "off",
  },
};
