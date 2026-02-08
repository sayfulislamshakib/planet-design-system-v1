import type { Meta, StoryObj } from '@storybook/react';
import './foundations.css';

const meta: Meta = {
  title: 'Foundations/Elevation',
};

export default meta;

type Story = StoryObj;

const levels = [
  { name: 'Shadow 1', variable: '--pds-shadow-1' },
  { name: 'Shadow 2', variable: '--pds-shadow-2' },
  { name: 'Shadow 3', variable: '--pds-shadow-3' },
  { name: 'Shadow 4', variable: '--pds-shadow-4' },
];

export const Depth: Story = {
  render: () => (
    <div className="pds-foundation-elevation">
      {levels.map((level) => (
        <div
          className="pds-foundation-elevation__card"
          key={level.variable}
          style={{ boxShadow: `var(${level.variable})` }}
        >
          {level.name}
        </div>
      ))}
    </div>
  ),
};
