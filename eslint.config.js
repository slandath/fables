import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    jsonc: true,
    yaml: true,
    markdown: true,
  },
  {
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
    },
  },
)
