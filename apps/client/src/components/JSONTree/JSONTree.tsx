import { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';

interface JSONTreeProps {
  data: unknown;
  level?: number;
  expanded?: boolean;
}

const JSONTree = ({ data, level = 0, expanded = false }: JSONTreeProps) => {
  const [isOpen, setIsOpen] = useState(expanded);
  const indent = level * 20; // 20px indentation per level

  if (data === null) return <span style={{ color: '#808080' }}>null</span>;
  if (data === undefined) return <span style={{ color: '#808080' }}>undefined</span>;
  if (typeof data === 'string') return <span style={{ color: '#a31515' }}>"{data}"</span>;
  if (typeof data === 'number') return <span style={{ color: '#098658' }}>{data}</span>;
  if (typeof data === 'boolean') return <span style={{ color: '#0000ff' }}>{data.toString()}</span>;
  if (Array.isArray(data) || typeof data === 'object') {
    const isArray = Array.isArray(data);
    const items = isArray ? data : Object.entries(data);
    const isEmpty = items.length === 0;

    if (isEmpty) {
      return <span>{isArray ? '[]' : '{}'}</span>;
    }

    return (
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <div style={{ marginLeft: indent }}>
          <Collapsible.Trigger className="flex items-center gap-1 hover:bg-gray-100 rounded px-1">
            {isOpen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
            <span>{isArray ? '[' : '{'}</span>
          </Collapsible.Trigger>

          <Collapsible.Content>
            {(isArray ? items : (items as [string, unknown][])).map((item, index) => (
              <div key={isArray ? index : item[0]} className="flex items-start">
                {!isArray && <span style={{ color: '#881391' }}>"{item[0]}": </span>}
                <JSONTree data={isArray ? item : item[1]} level={level + 1} expanded={expanded} />
                {index < items.length - 1 && <span>,</span>}
              </div>
            ))}
          </Collapsible.Content>

          <div style={{ marginLeft: indent }}>
            <span>{isArray ? ']' : '}'}</span>
          </div>
        </div>
      </Collapsible.Root>
    );
  }

  return null;
};

export default JSONTree;
