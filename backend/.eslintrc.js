module.exports = {
  extends: [
    'standard',
    'eslint:recommended',
    //   'plugin:node/recommended',
    //   'plugin:prettier/recommended',
  ],
  // env: {
  //   'node': true,
  // 'es6': true
  // },
  // parserOptions: {
  // ecmaVersion: 8
  // ecmaVersion: 2020,
  // sourceType: 'module',
  // sourceType: 'common',
  // },
  rules: {
    // 'node/exports-style': ['error', 'module.exports'],
    // 'node/prefer-global/buffer': ['error', 'always'],
    // 'node/prefer-global/console': ['error', 'always'],
    // 'node/prefer-global/process': ['error', 'always'],
    // 'node/prefer-global/url-search-params': ['error', 'always'],
    // 'node/prefer-global/url': ['error', 'always'],
    // 'node/prefer-promises/dns': 'error',
    // 'node/prefer-promises/fs': 'error',
    'semi': ['off', 'always'],
    'no-mixed-operators': ['off'],
    'camelcase': 'error',
    'comma-dangle': 'off',
    'indent': ['error', 2],
    'prefer-const': ['error', {
      'destructuring': 'any',
      'ignoreReadBeforeAssign': false
    }]
  },
}
