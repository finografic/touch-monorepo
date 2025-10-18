import type { ReactElement } from 'react';

import { Button } from './Button';

/**
 * Button Usage Examples
 *
 * This file demonstrates the various ways to use the Button component.
 * Remove this file in production or move to a stories/docs folder.
 */

export function ButtonExamples(): ReactElement {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>Button Examples</h2>

      {/* Basic Variants */}
      <section>
        <h3>Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="solid">Solid Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </section>

      {/* Colors */}
      <section>
        <h3>Colors</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button color="default">Default</Button>
          <Button color="primary">Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="success">Success</Button>
          <Button color="warning">Warning</Button>
          <Button color="danger">Danger</Button>
          <Button color="info">Info</Button>
          <Button color="grey">Grey</Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3>Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* With Icons */}
      <section>
        <h3>With Icons</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button icon="🚀" iconPosition="left">
            Launch
          </Button>
          <Button icon="💾" iconPosition="right">
            Save
          </Button>
          <Button icon="⚙️">Settings</Button>
        </div>
      </section>

      {/* States */}
      <section>
        <h3>States</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button>Normal</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Full Width */}
      <section>
        <h3>Full Width</h3>
        <Button fullWidth color="primary">
          Full Width Button
        </Button>
      </section>

      {/* Color Variants with Outline */}
      <section>
        <h3>Outline Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="outline" color="primary">
            Primary Outline
          </Button>
          <Button variant="outline" color="success">
            Success Outline
          </Button>
          <Button variant="outline" color="danger">
            Danger Outline
          </Button>
        </div>
      </section>

      {/* Ghost Variants */}
      <section>
        <h3>Ghost Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="ghost" color="primary">
            Primary Ghost
          </Button>
          <Button variant="ghost" color="success">
            Success Ghost
          </Button>
          <Button variant="ghost" color="danger">
            Danger Ghost
          </Button>
        </div>
      </section>
    </div>
  );
}

// Example usage in code:
/*
import { Button } from 'components/Button';

// Basic usage
<Button>Click me</Button>

// With color and variant
<Button color="primary" variant="solid">Primary Button</Button>

// With icon
<Button icon={<SaveIcon />} color="success">Save</Button>

// Loading state
<Button loading color="primary">Saving...</Button>

// Full width
<Button fullWidth color="danger" variant="outline">Delete Account</Button>

// Icon only
<Button icon={<SettingsIcon />} variant="ghost" />

// With click handler
<Button
  color="primary"
  onClick={() => console.log('clicked')}
>
  Click Handler
</Button>
*/
