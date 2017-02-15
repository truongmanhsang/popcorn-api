module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  globals: {
    logger: true,
  },
  rules: {
    // Possible Errors
    'no-console': 'warn',
    'valid-jsdoc': 'warn',
    // Best Practices
    'dot-location': ['warn', 'property'],
    eqeqeq: 'warn',
    'no-else-return': 'warn',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-multi-spaces': 'warn',
    'no-new-wrappers': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-escape': 'warn',
    'prefer-promise-reject-errors': 'warn',
    radix: 'error',
    'require-await': 'error',
    'vars-on-top': 'warn',
    // Stylistic Issues
    'array-bracket-spacing': 'warn',
    'brace-style': 'warn',
    'comma-dangle': ['warn', {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never',
    }],
    'comma-spacing': ['warn', {
      before: false,
      after: true
    }],
    'comma-style': 'warn',
    'func-call-spacing': 'warn',
    'func-style': ['warn', 'declaration'],
    indent: ['warn', 2],
    'keyword-spacing': ['warn', {
      before: true,
      after: true
    }],
    'lines-around-directive': ['warn', {
      before: 'never',
      after: 'always'
    }],
    'new-cap': 'warn',
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-lonely-if': 'error',
    'no-multiple-empty-lines': 'warn',
    'no-tabs': 'warn',
    'no-trailing-spaces': 'warn',
    'no-whitespace-before-property': 'error',
    'object-curly-spacing': ['warn', 'always'],
    'one-var': ['warn', {
      var: 'never',
      let: 'always',
      const: 'never'
    }],
    'operator-assignment': 'warn',
    'operator-linebreak': ['warn', 'before'],
    'padded-blocks': ['warn', {
      blocks: 'never',
      classes: 'always',
      switches: 'never'
    }],
    'quote-props': ['warn', 'consistent-as-needed'],
    quotes: ['warn', 'single'],
    'require-jsdoc': ['error', {
        require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true
        }
    }],
    'space-before-blocks': 'warn',
    'space-before-function-paren': ['warn', 'never'],
    'space-in-parens': 'warn',
    'space-infix-ops': 'warn',
    'space-unary-ops': [1, {
      words: true
    }],
    'spaced-comment': 'warn',
    'semi-spacing': ['warn', {
      before: false,
      after: false
    }],
    // ECMAScript 6
    'arrow-spacing': ['warn', {
      before: true,
      after: true
    }],
    'no-duplicate-imports': 'warn',
    'no-var': 'error',
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'error',
    'prefer-destructuring': ['warn', {
      "array": false,
      "object": true
    }],
    'prefer-template': 'warn',
    'template-curly-spacing': 'error'
  }
};
