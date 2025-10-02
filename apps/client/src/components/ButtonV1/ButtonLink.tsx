import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Button } from './Button';
import type { ButtonLinkProps } from './Button.types';
import { useNavigateState } from 'routes/hooks/useNavigateState';

export const ButtonLinkV1 = ({ to, onClick, ...props }: ButtonLinkProps): ReactElement => {
  // NOTE: ENSURE `from` previous pathname ALWAYS included in router state
  const { from } = useNavigateState();
  const newState = { ...props.state };

  if (!('from' in newState)) {
    Object.assign(newState, { from });
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
