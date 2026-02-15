# Planet Design System AI Rulebook

This document is the project-specific rulebook for AI coding agents working in this repository.
It is derived from the current code structure under `src/`, `.storybook/`, and root config files.

## 1. Repository Shape

Use this structure as the baseline:

```text
src/
  components/
    buttons/
      Button/
      ButtonAction/
      ButtonGroup/
      ButtonSplit/
      index.ts
    checkbox/
    chip/
    input/
    link/
    NumberInput/
    overlay/
    radio/
    toggle/
    tooltip/
    index.ts
  foundations/
    *.stories.tsx
    foundations.css
  styles/
    fonts.css
    tokens.css
    global.css
  index.ts
```

## 2. Tech + Commands

- Stack: React 18 + TypeScript + Vite + Storybook.
- Linting: ESLint flat config (`eslint.config.js`) with TypeScript + Storybook plugins.
- Storybook addons include docs, a11y, and vitest integration.
- Use these commands before finalizing changes:
- `npm run lint`
- `npm run build`
- `npm run build-storybook`

## 3. Component File Contract

When adding a new component (outside `buttons/`), create:

- `<component>/<component>.tsx`
- `<component>/<component>.css`
- `<component>/<component>.stories.tsx`
- `<component>/index.ts`

When adding a new button-family component, follow the existing nested structure:

- `src/components/buttons/<ComponentName>/<ComponentName>.tsx`
- `src/components/buttons/<ComponentName>/<ComponentName>.css`
- `src/components/buttons/<ComponentName>/<ComponentName>.stories.tsx`
- optional local `index.ts` when needed by that folder
- export through `src/components/buttons/index.ts`

## 4. Export Rules

- Keep public exports barrel-driven.
- Add component exports to `src/components/index.ts`.
- Keep package root export as `src/index.ts -> export * from './components';`.
- Export both component and prop/types from each component `index.ts`.

## 5. Type + API Rules

- Use function components with explicit exported prop types.
- Mirror current style: `type Props = Omit<...native props...> & { ...custom props... }`.
- Preserve existing public prop unions and naming unless a breaking change is explicitly requested.
- Keep controlled/uncontrolled behavior patterns when already present (for example `NumberInput`, `Tooltip`, `Toggle`).

## 6. Styling Rules

- Use component-local CSS files imported directly in each component TSX file.
- Prefix classes with `pds-` (example: `pds-button`, `pds-input__field`).
- Drive visual variants through `data-*` attributes on root elements (example: `data-size`, `data-state`, `data-variant`).
- Prefer design tokens from `src/styles/tokens.css` (`--pds-*` and existing semantic tokens).
- Do not introduce hard-coded colors/sizes unless there is no token and a fallback is needed.

## 7. Accessibility + Interaction Rules

- Keep keyboard support patterns:
- Enter-to-activate behavior used by controls like checkbox/radio/toggle/link-without-href.
- Preserve `aria-*` behavior for disabled and error states.
- Icon-only interactive components must have an `aria-label`.
- If interaction behavior changes, update stories and play assertions accordingly.

## 8. Storybook Rules

- Every component should have `tags: ['autodocs']`.
- Use title groups consistent with current taxonomy:
- `Components/<Name>`
- `Components/Buttons/<Name>`
- `Foundations/<Name>`
- Keep docs usage snippets importing from `'planet-design-system-v1'`.
- Use `args` + `argTypes` to expose states, sizes, and variants.
- For interactive components, include or update `play` functions with `storybook/test` (`expect`, `userEvent`, `within`).

## 9. Existing Project Quirks To Respect

- `NumberInput` folder uses PascalCase directory name with kebab-case files (`number-input.tsx`).
- Some components use both `disable` and `disabled` state labels; preserve current API unless intentionally refactoring.
- React path aliasing is configured in both Vite and Storybook to avoid duplicate React resolution issues.

## 10. Change Checklist For AI

- Confirm file placement matches existing folder conventions.
- Confirm CSS class naming and `data-*` hooks follow existing style.
- Confirm exports are wired in all required barrel files.
- Confirm stories and docs are updated for any new/changed props.
- Run lint/build/storybook build commands and fix issues before handing off.

