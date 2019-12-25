module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    "jest": true
  },
  'extends': [
    'standard',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
    "project": "./tsconfig.json",
    "tsconfigRootDir": "."
  },
  'plugins': [
    'react-hooks'
  ],
  'settings': {
    'node': {
      'tryExtensions': [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
        '.node'
      ]
    },
    'react': {
      'version': 'detect'
    }
  },
  'rules': {
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/type-annotation-spacing': 'off',
    'prettier/prettier': [
      'error',
      {
        'singleQuote': true,
        'semi': false
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
}