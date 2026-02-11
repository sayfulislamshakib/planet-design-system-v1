import '../src/styles/global.css';
import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react';

const preview: Preview = {
  decorators: [
    (Story) => {
      useEffect(() => {
        const body = document.body;
        const root = document.documentElement;
        if (!body || !root) return;

        const apply = () => {
          body.style.transformOrigin = 'center center';
          root.style.transformOrigin = 'center center';
        };

        apply();

        const observer = new MutationObserver(apply);
        observer.observe(body, { attributes: true, attributeFilter: ['style'] });

        return () => observer.disconnect();
      }, []);

      return Story();
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Components',
          ['Button', 'ButtonGroup', 'ButtonSplit'],
        ],
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      canvas: {
        sourceState: 'none',
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#fafafa' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export default preview;
