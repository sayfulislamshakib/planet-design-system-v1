import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { expect, within } from 'storybook/test';
import { useArgs } from 'storybook/preview-api';
import { Avatar } from './avatar';

const imageSrc = '/images/smiling-young-pretty-woman-standing-isolated.jpg';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const [{ variant, src }, updateArgs] = useArgs();

      useEffect(() => {
        if (variant === 'image' && !src) {
          updateArgs({
            src: imageSrc,
            alt: 'Planet User profile photo',
          });
        }
      }, [variant, src, updateArgs]);

      return <Story />;
    },
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Avatar supports image and single-letter fallback states.',
          'Default avatar colors are chosen automatically from an Avatar-only palette.',
          '',
          '```tsx',
          "import { Avatar } from 'planet-design-system-v1';",
          '',
          '<Avatar variant="image" src="/user.jpg" name="Planet User" />',
          '<Avatar variant="image" src={user.photoUrl} name={user.fullName} />',
          '<Avatar name="Planet User" />',
          '<Avatar name="Planet User" color="green" />',
          '<Avatar name="Planet User" color="auto" />',
          '```',
          '',
          '## Imports',
          '',
          '```tsx',
          "import { Avatar } from 'planet-design-system-v1';",
          "import type { AvatarProps } from 'planet-design-system-v1';",
          '```',
        ].join('\n'),
      },
      canvas: { layout: 'centered', sourceState: 'none' },
    },
    controls: { sort: 'none' },
  },
  args: {
    size: 'md',
    shape: 'circle',
    state: 'default',
    variant: 'default',
    color: 'auto',
    name: 'Planet User',
    src: '',
    initials: '',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'image'],
      description: 'Visual variant.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Avatar size.',
    },
    shape: {
      control: 'select',
      options: ['circle', 'rounded'],
      description: 'Avatar shape.',
    },
    state: {
      control: 'select',
      options: ['default', 'disabled'],
      description: 'Visual state.',
    },
    color: {
      control: 'select',
      options: ['auto', 'blue', 'red', 'yellow', 'purple', 'orange', 'green', 'magenta', 'gray'],
      description: 'Avatar background color. Use auto for automatic palette selection.',
    },
    src: {
      control: 'text',
      description: 'Image source URL (also supports Blob/File in code).',
    },
    alt: {
      control: 'text',
      description: 'Image alt text.',
    },
    name: {
      control: 'text',
      description: 'Used to derive fallback single letter and accessible label.',
    },
    initials: {
      control: 'text',
      description: 'Overrides fallback letter (first character is used).',
    },
    fallback: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {};

export const WithImage: Story = {
  args: {
    variant: 'image',
    src: imageSrc,
    alt: 'Planet User profile photo',
    name: 'Planet User',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Planet User profile photo' })).toBeInTheDocument();
  },
};

export const InitialsFallback: Story = {
  args: {
    src: '',
    name: 'Planet User',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Planet User' })).toBeInTheDocument();
    await expect(canvas.getByText('P')).toBeInTheDocument();
  },
};

export const ManualInitials: Story = {
  args: {
    src: '',
    name: 'Planet User',
    initials: 'S',
  },
};

export const Rounded: Story = {
  args: {
    variant: 'image',
    shape: 'rounded',
    src: imageSrc,
    alt: 'Planet User profile photo',
  },
};

export const ImageVariant: Story = {
  args: {
    variant: 'image',
    src: imageSrc,
    alt: 'Planet User profile photo',
    name: 'Planet User',
  },
};

export const DynamicImage: Story = {
  render: (args) => {
    const [imageUrl, setImageUrl] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File>();
    const resolvedSrc = uploadedFile ?? (imageUrl || args.src);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextFile = event.target.files?.[0];
      setUploadedFile(nextFile);
    };

    return (
      <div style={{ display: 'grid', gap: 10, minWidth: 280 }}>
        <input
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="Paste image URL"
          style={{ padding: '8px 10px' }}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <Avatar {...args} variant="image" src={resolvedSrc} alt="Dynamic avatar preview" />
      </div>
    );
  },
};

export const AutoColorSystem: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {([
        { name: 'Blue', color: 'blue' },
        { name: 'Red', color: 'red' },
        { name: 'Yellow', color: 'yellow' },
        { name: 'Purple', color: 'purple' },
        { name: 'Orange', color: 'orange' },
        { name: 'Green', color: 'green' },
        { name: 'Magenta', color: 'magenta' },
        { name: 'Gray', color: 'gray' },
      ] as const).map(({ name, color }) => (
        <Avatar key={color} {...args} variant="default" name={name} color={color} />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
    name: 'Disabled User',
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
