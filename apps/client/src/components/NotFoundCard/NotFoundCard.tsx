import type { ReactElement } from 'react';
import { Col, Row } from '@finografic/design-system/grid';
import { useTranslation } from 'react-i18next';

import { PATHS } from 'config/routes/paths.constants';
import { useNavigateState } from 'routes/hooks/useNavigateState';

// import { Button } from 'components/Button';
import { styles } from './NotFoundCard.styles';

export const NotFoundCard = (): ReactElement => {
  const { t } = useTranslation();
  const { navigate } = useNavigateState();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate(PATHS.main);
  };

  return (
    <div css={styles}>
      <Row>
        <Col>
          <h3>Page Not Found</h3>
          <p>¯\_(ツ)_/¯</p>
          {/* <Button
            variant="outline"
            color="warningLight"
            label="Go Back"
            onClick={handleGoBack}
          />
          <Button
            variant="outline"
            color="primaryLight"
            label="Go to Main"
            onClick={handleGoHome}
          /> */}
        </Col>
      </Row>
    </div>
  );
};
