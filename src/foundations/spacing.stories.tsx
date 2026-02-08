import type { Meta, StoryObj } from '@storybook/react';
import './foundations.css';

const meta: Meta = {
  title: 'Foundations/Spacing',
};

export default meta;

type Story = StoryObj;

const spacing = [
  { name: 'Space 1', variable: '--pds-space-1' },
  { name: 'Space 2', variable: '--pds-space-2' },
  { name: 'Space 3', variable: '--pds-space-3' },
  { name: 'Space 4', variable: '--pds-space-4' },
  { name: 'Space 5', variable: '--pds-space-5' },
  { name: 'Space 6', variable: '--pds-space-6' },
  { name: 'Space 7', variable: '--pds-space-7' },
  { name: 'Space 8', variable: '--pds-space-8' },
  { name: 'Space 9', variable: '--pds-space-9' },
];

export const Scale: Story = {
  render: () => (
    <div className="pds-foundation-spacing">
      {spacing.map((item) => (
        <div className="pds-foundation-spacing__row" key={item.variable}>
          <strong style={{ minWidth: 100 }}>{item.name}</strong>
          <div
            className="pds-foundation-spacing__swatch"
            style={{ width: `var(${item.variable})` }}
          />
          <span>{item.variable}</span>
        </div>
      ))}
    </div>
  ),
};
