import { Code } from '@radix-ui/themes';

export const JsonView = ({ data, color }: { data: any; color: 'blue' | 'amber' | 'gray' | 'orange' }) => {
  if (!data) return null;
  return (
    <Code color={color} className="jsonView">
      {JSON.stringify(data, null, 2)}
    </Code>
  );
};
