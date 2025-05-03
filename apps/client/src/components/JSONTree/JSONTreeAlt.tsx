import { stylesEmo } from 'components/JSONTree/JSONTree.styles';
import { type GetItemString, JSONTree, type LabelRenderer } from 'react-json-tree';

// VS Code Dark+ inspired theme
const theme = {
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

const valueRenderer = (raw: unknown): string => {
  if (typeof raw === 'string') return `"${raw}"`;
  if (raw === null) return 'null';
  if (raw === undefined) return 'undefined';
  return String(raw);
};

interface CustomJSONTreeProps {
  data: unknown;
  expanded?: boolean;
}

const getItemString: GetItemString = (type, data, itemType) => (
  <span style={{ color: theme.base05 }}>
    {itemType} {Array.isArray(data) ? `(${data.length})` : ''}
  </span>
);

const labelRenderer: LabelRenderer = (keyPath) => (
  <span style={{ color: theme.base0F }}>
    {typeof keyPath[0] === 'string' ? `"${keyPath[0]}"` : keyPath[0]}
  </span>
);

const JSONTreeAlt = ({ data, expanded = false }: CustomJSONTreeProps) => {
  return (
    <span css={stylesEmo}>
      <JSONTree
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

export default JSONTreeAlt;
