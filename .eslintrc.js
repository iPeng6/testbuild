module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    semi: ['error', 'never'], // react社区 默认喜欢添加尾部分号
    quotes: ['error', 'single'],
    'comma-dangle': 'off', // 避免与 prettier 同时加了两个逗号
    'max-len': ['error', { code: 140 }],
    'keyword-spacing': 'off', // 避免与 prettier 同时加了两个空格
    'space-infix-ops': 'off', // 操作符 避免与 prettier 同时加了两个空格
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true, // prettier 默认是双引号
        trailingComma: 'all',
        jsxBracketSameLine: true, // jsx 头标签右 > 括号不折行
        printWidth: 140
      }
    ]
  },
}
