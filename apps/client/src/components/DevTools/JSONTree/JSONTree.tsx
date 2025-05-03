import { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { styles } from './JSONTree.styles';

interface JSONTreeProps {
  data: unknown;
  level?: number;
  expanded?: boolean;
}

const JSONTree = ({ data, level = 0, expanded = false }: JSONTreeProps) => {
  const [isOpen, setIsOpen] = useState(expanded);
  const [isHovered, setIsHovered] = useState(false);
  const indent = level * 12; // Reduced from 16px to 12px

  if (data === null) return <span style={styles.null}>null</span>;
  if (data === undefined) return <span style={styles.undefined}>undefined</span>;
  if (typeof data === 'string') return <span style={styles.string}>"{data}"</span>;
  if (typeof data === 'number') return <span style={styles.number}>{data}</span>;
  if (typeof data === 'boolean') return <span style={styles.boolean}>{data.toString()}</span>;

  if (Array.isArray(data) || typeof data === 'object') {
    const isArray = Array.isArray(data);
    const items = isArray ? data : Object.entries(data);
    const isEmpty = items.length === 0;

    if (isEmpty) {
      return <span style={styles.punctuation}>{isArray ? '[]' : '{}'}</span>;
    }

    return (
      <div style={{ ...styles.container, marginLeft: indent }}>
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
          <Collapsible.Trigger
            style={{ ...styles.trigger, ...(isHovered ? styles.triggerHover : {}) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isOpen ? (
              <ChevronDownIcon style={styles.chevron} />
            ) : (
              <ChevronRightIcon style={styles.chevron} />
            )}
            <span style={styles.punctuation}>{isArray ? '[' : '{'}</span>
          </Collapsible.Trigger>

          <Collapsible.Content style={styles.content}>
            {(isArray ? items : (items as [string, unknown][])).map((item, index) => (
              <div key={isArray ? index : item[0]} style={styles.item}>
                {!isArray && (
                  <>
                    <span style={styles.key}>"{item[0]}"</span>
                    <span style={styles.punctuation}>:</span>
                  </>
                )}
                <JSONTree data={isArray ? item : item[1]} level={level + 1} expanded={expanded} />
                {index < items.length - 1 && <span style={styles.punctuation}>,</span>}
              </div>
            ))}
          </Collapsible.Content>

          <span style={styles.punctuation}>{isArray ? ']' : '}'}</span>
        </Collapsible.Root>
      </div>
    );
  }

  return null;
};

export default JSONTree;
