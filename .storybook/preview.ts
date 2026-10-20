import type { Preview } from '@storybook/react-vite';
import './storybook.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i
      }
    },
    a11y: {
      // Fail the Storybook tests on accessibility violations
      test: 'error',
      config: {
        rules: [
          {
            // WCAG 2.5.3 (Label in Name) check comparing the accessible name with all text inside the element.
            // An expanded tree item contains its nested items, so its name ("Root 1") never matches its whole
            // subtree's text, even though the visible row label is exactly its name.
            id: 'label-content-name-mismatch',
            selector: '[aria-label]:not([role="treeitem"]), [aria-labelledby]:not([role="treeitem"])'
          }
        ]
      }
    }
  },
  tags: ['autodocs']
};

export default preview;
