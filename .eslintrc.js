module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    semi: ['error', 'never'], // react社区 默认喜欢添加尾部分号
    quotes:['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': ['error', { code: 140 }],
    'keyword-spacing': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true, // prettier 默认是双引号
        trailingComma: 'all',
        jsxBracketSameLine: true, // jsx 头标签右 > 括号不折行
        printWidth: 140,
      },
    ],
  },
}
