import '../src/styles/global.css';
import './storybook.css';
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
      storySort: (a, b) => {
        const getEntry = (entry) => (Array.isArray(entry) ? entry[1] : entry) ?? {};
        const compareText = (left = '', right = '') =>
          left.localeCompare(right, 'en-US', { numeric: true, sensitivity: 'base' });
        const isDocsEntry = (entry) =>
          entry.type === 'docs' || entry.name === 'Docs' || String(entry.id ?? '').endsWith('--docs');

        const entryA = getEntry(a);
        const entryB = getEntry(b);

        const byTitle = compareText(entryA.title, entryB.title);
        if (byTitle !== 0) return byTitle;

        const aIsDocs = isDocsEntry(entryA);
        const bIsDocs = isDocsEntry(entryB);
        if (aIsDocs !== bIsDocs) return aIsDocs ? -1 : 1;

        const isButtonStories =
          entryA.title === 'Components/Buttons/Button' && entryB.title === 'Components/Buttons/Button';
        if (isButtonStories) {
          const aIsDefault = entryA.name === 'Default';
          const bIsDefault = entryB.name === 'Default';
          if (aIsDefault !== bIsDefault) return aIsDefault ? -1 : 1;
        }

        const byName = compareText(entryA.name, entryB.name);
        if (byName !== 0) return byName;

        return compareText(entryA.id, entryB.id);
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

