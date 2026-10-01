module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss'
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'layer',
          'apply',
          'responsive',
          'screen',
          'import',
          'custom-variant',
          'utility',
          'theme',
          'reference',
          'source'
        ]
      }
    ]
  },
  overrides: [
    {
      files: ['src/styles/**/*.css'],
      rules: {
        // 템플릿(shadcn-dashboard)에서 가져온 CSS는 네이밍/네스팅 컨벤션이 달라 예외 처리
        'selector-class-pattern': null,
        'keyframes-name-pattern': null,
        'nesting-selector-no-missing-scoping-root': null,
        'lightness-notation': null,
        'hue-degree-notation': null
      }
    }
  ]
}
