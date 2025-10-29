// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/html-self-closing': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/no-multiple-template-root': 'off',
    '@stylistic/comma-dangle': 'off',
    '@stylistic/semi': 'off',
    '@stylistic/quote-props': 'off',
    '@stylistic/eol-last': 'off',
    'nuxt/nuxt-config-keys-order': 'off',
  },
});
