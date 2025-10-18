import type { GetItemString, LabelRenderer } from 'react-json-tree';
import { JSONTree as JSONTreeReact } from 'react-json-tree';

import { styles } from './JSONTree.styles';

// VS Code Dark+ inspired theme
const _theme_vscode_dark = {
  scheme: 'vs-dark',
  base00: '#1E1E1E', // background
  base01: '#262626', // lighter background
  base02: '#303030', // selection background
  base03: '#6D6D6D', // comments, invisibles
  base04: '#808080', // dark foreground
  base05: '#D4D4D4', // default foreground
  base06: '#E9E9E9', // light foreground
  base07: '#FFFFFF', // light background
  base08: '#CD9077', // variables
  base09: '#6B9955', // integers, booleans
  base0A: '#DCDCAA', // classes, css classes
  base0B: '#CE9178', // strings
  base0C: '#4EC9B0', // support, regular expressions
  base0D: '#569CD6', // functions, methods
  base0E: '#C586C0', // keywords
  base0F: '#9CDCFE', // object keys
};

const _theme_monokai = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#f92672',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#4EC9B0', // object keys
};

const valueRenderer = (raw: unknown): string => {
  // if (typeof raw === 'string') return `"${raw}"`;
  if (typeof raw === 'string') return `${raw}`;
  if (raw === null) return 'null';
  if (raw === undefined) return 'undefined';
  return String(raw);
};

interface CustomJSONTreeProps {
  data: any;
  expanded?: boolean;
}

const getItemString: GetItemString = (type, data, slotType) => (
  <span style={{ color: theme.base05 }}>
    {slotType} {Array.isArray(data) ? `(${data.length})` : ''}
  </span>
);

const labelRenderer: LabelRenderer = (keyPath) => (
  <span style={{ color: theme.base0F }}>{typeof keyPath[0] === 'string' ? `${keyPath[0]}` : keyPath[0]}</span>
);

export const JSONTree = ({ data, expanded = true }: CustomJSONTreeProps) => {
  return (
    <span css={styles}>
      <JSONTreeReact
        data={data}
        theme={theme}
        invertTheme={false}
        valueRenderer={valueRenderer}
        shouldExpandNodeInitially={() => expanded}
        hideRoot
        getItemString={getItemString}
        labelRenderer={labelRenderer}
        {...{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '13px',
            lineHeight: '1.4',
            backgroundColor: 'transparent',
          },
        }}
      />
    </span>
  );
};
