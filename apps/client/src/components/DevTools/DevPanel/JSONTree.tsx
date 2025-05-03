import JSONTreeReact from 'components/DevTools/JSONTree/JSONTreeAlt';
import { styles } from './DevPanel.styles';

export const JSONTree = ({ data }: any) => {
  return (
    <aside css={styles}>
      <JSONTreeReact data={data} expanded={true} />
    </aside>
  );
};
