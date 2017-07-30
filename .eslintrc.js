'use strict'

module.exports = {
  extends: [
    'standard',
    'plugin:flowtype/recommended'
  ],
  env: {
    mocha: true
  },
  globals: {
    logger: true,
    tempDir: true
  },
  plugins: [
    'flowtype',
    'json'
  ],
  rules: {
    'lines-around-directive': ['error', 'always'],
    'max-depth': ['error', 4],
    'max-len': ['error', 80, 2, {
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true
    }],
    'no-bitwise': ['error', {
      int32Hint: true
    }],
    'no-console': 'error',
    'no-const-assign': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-implicit-coercion': 'error',
    'no-lonely-if': 'error',
    'no-var': 'error',
    'padded-blocks': ['error', {
      blocks: 'never',
      switches: 'never',
      classes: 'always'
    }],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': ['error', {
      array: false,
      object: true
    }],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quote-props': ['error', 'consistent-as-needed'],
    'radix': 'error',
    'require-await': 'error',
    'require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true
      }
    }],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'valid-jsdoc': 'error',

    'import/export': 'error',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-webpack-loader-syntax': 'error',

    'node/no-deprecated-api': 0, // 'node/no-deprecated-api': 'error',
    'node/process-exit-as-throw': 'error',

    'promise/param-names': 'error',

    'standard/array-bracket-even-spacing': ['error', 'either'],
    'standard/computed-property-even-spacing': ['error', 'even'],
    'standard/no-callback-literal': 'error',
    'standard/object-curly-even-spacing': ['error', 'either'],
  }
}
