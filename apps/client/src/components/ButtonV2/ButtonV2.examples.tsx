import type { ReactElement } from 'react';
import { ButtonV2 } from './ButtonV2';

/**
 * ButtonV2 Usage Examples
 *
 * This file demonstrates the various ways to use the ButtonV2 component.
 * Remove this file in production or move to a stories/docs folder.
 */

export function ButtonV2Examples(): ReactElement {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>ButtonV2 Examples</h2>

      {/* Basic Variants */}
      <section>
        <h3>Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ButtonV2 variant="solid">Solid Button</ButtonV2>
          <ButtonV2 variant="outline">Outline Button</ButtonV2>
          <ButtonV2 variant="ghost">Ghost Button</ButtonV2>
          <ButtonV2 variant="link">Link Button</ButtonV2>
        </div>
      </section>

      {/* Colors */}
      <section>
        <h3>Colors</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ButtonV2 color="default">Default</ButtonV2>
          <ButtonV2 color="primary">Primary</ButtonV2>
          <ButtonV2 color="secondary">Secondary</ButtonV2>
          <ButtonV2 color="success">Success</ButtonV2>
          <ButtonV2 color="warning">Warning</ButtonV2>
          <ButtonV2 color="danger">Danger</ButtonV2>
          <ButtonV2 color="info">Info</ButtonV2>
          <ButtonV2 color="grey">Grey</ButtonV2>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3>Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <ButtonV2 size="sm">Small</ButtonV2>
          <ButtonV2 size="md">Medium</ButtonV2>
          <ButtonV2 size="lg">Large</ButtonV2>
        </div>
      </section>

      {/* With Icons */}
      <section>
        <h3>With Icons</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ButtonV2 icon="🚀" iconPosition="left">
            Launch
          </ButtonV2>
          <ButtonV2 icon="💾" iconPosition="right">
            Save
          </ButtonV2>
          <ButtonV2 icon="⚙️">Settings</ButtonV2>
        </div>
      </section>

      {/* States */}
      <section>
        <h3>States</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ButtonV2>Normal</ButtonV2>
          <ButtonV2 loading>Loading</ButtonV2>
          <ButtonV2 disabled>Disabled</ButtonV2>
        </div>
      </section>

      {/* Full Width */}
      <section>
        <h3>Full Width</h3>
        <ButtonV2 fullWidth color="primary">
          Full Width Button
        </ButtonV2>
      </section>

      {/* Color Variants with Outline */}
      <section>
        <h3>Outline Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ButtonV2 variant="outline" color="primary">
            Primary Outline
          </ButtonV2>
          <ButtonV2 variant="outline" color="success">
            Success Outline
          </ButtonV2>
          <ButtonV2 variant="outline" color="danger">
            Danger Outline
          </ButtonV2>
        </div>
      </section>

      {/* Ghost Variants */}
      <section>
        <h3>Ghost Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ButtonV2 variant="ghost" color="primary">
            Primary Ghost
          </ButtonV2>
          <ButtonV2 variant="ghost" color="success">
            Success Ghost
          </ButtonV2>
          <ButtonV2 variant="ghost" color="danger">
            Danger Ghost
          </ButtonV2>
        </div>
      </section>
    </div>
  );
}

// Example usage in code:
/*
import { ButtonV2 } from 'components/ButtonV2';

// Basic usage
<ButtonV2>Click me</ButtonV2>

// With color and variant
<ButtonV2 color="primary" variant="solid">Primary Button</ButtonV2>

// With icon
<ButtonV2 icon={<SaveIcon />} color="success">Save</ButtonV2>

// Loading state
<ButtonV2 loading color="primary">Saving...</ButtonV2>

// Full width
<ButtonV2 fullWidth color="danger" variant="outline">Delete Account</ButtonV2>

// Icon only
<ButtonV2 icon={<SettingsIcon />} variant="ghost" />

// With click handler
<ButtonV2
  color="primary"
  onClick={() => console.log('clicked')}
>
  Click Handler
</ButtonV2>
*/
