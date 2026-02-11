import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(baseConfig) {
    const resolved = {
      react: path.resolve(process.cwd(), 'node_modules/react/index.js'),
      'react-dom': path.resolve(process.cwd(), 'node_modules/react-dom/index.js'),
      'react/jsx-runtime': path.resolve(process.cwd(), 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(process.cwd(), 'node_modules/react/jsx-dev-runtime.js'),
    };

    baseConfig.resolve = baseConfig.resolve || {};
    baseConfig.resolve.alias = {
      ...(baseConfig.resolve.alias || {}),
      ...resolved,
    };
    baseConfig.resolve.conditions = ['module', 'browser', 'development'];
    return baseConfig;
  }
};
export default config;
