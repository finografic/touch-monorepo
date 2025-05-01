import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useNavigateState } from 'hooks/useNavigateState';
import type { ReactElement } from 'react';
// import { Button } from 'components/Button';
import { styles } from './NotFoundCard.styles';

export const NotFoundCard = (): ReactElement => {
  const { t } = useTranslation();
  const { navigate } = useNavigateState();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div css={styles}>
      <Row>
        <Col>
          <h3>{t('t.errorPages.404.title')}</h3>
          <p>¯\_(ツ)_/¯</p>
          {/* <Button
            variant="outline"
            color="warningLight"
            label={t('t.errorPages.buttons.back')}
            onClick={handleGoBack}
          />
          <Button
            variant="outline"
            color="primaryLight"
            label={t('t.errorPages.buttons.goto-home')}
            onClick={handleGoHome}
          /> */}
        </Col>
      </Row>
    </div>
  );
};
