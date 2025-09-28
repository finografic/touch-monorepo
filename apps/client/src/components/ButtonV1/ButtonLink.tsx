import { Link } from 'react-router-dom';
import { ReactElement } from 'react';
import { useNavigateState } from 'hooks/useNavigateState';
import { Button } from './Button';
import { ButtonLinkProps } from './Button.types';
import { useRouter } from 'routes/hooks/useRouter';

export const ButtonLinkV1 = ({ to, onClick, ...props }: ButtonLinkProps): ReactElement => {
  const { fromLocation } = useRouter();
  // NOTE: ENSURE `from` previous pathname ALWAYS included in router state
  // const { pathname /* basePath */ } = useLocation();
  const newState = { ...props.state };

  if (!('from' in newState)) {
    Object.assign(newState, { from: fromLocation });
  }

  // TODO: `basePath` SAME as `pathname` ?? -- REMOVE / MERGE ??
  // TODO: NATIVE `location.pathname` SUFFICIENT ??

  return (
    <Link to={to} state={newState}>
      <Button {...props} />
    </Link>
  );
};

// TODO: THIS IS THE NEW VERSION...
export const ButtonLink = ({ to, onClick, ...props }: ButtonLinkProps): ReactElement => {
  const { navigate } = useNavigateState();
  const handleClick = () => {
    props?.state ? navigate(to, { state: { ...props?.state } }) : navigate(to);
  };

  return <Button {...props} onClick={handleClick} />;
};
