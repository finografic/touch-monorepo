import { Row, Col } from 'react-grid-system';
import { memo } from 'react';
import { colors } from 'styles';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

export const DragPreview = memo(({ valueName }) => {
  return (
    <div className={'card-item'} style={{ transform: 'translateY(-8px)' }}>
      <header>
        <Row direction="row" align="stretch">
          <Col xs={1} className="col col-drag">
            <HamburgerMenuIcon width={24} height={24} />
          </Col>
          <Col xs={11} style={{ paddingLeft: 0 }}>
            <Row>
              <Col xs={1} className="col col-icons-left">
                {/* TOGGLE-ICON */}
              </Col>
              <Col xs={10} className="col col-name">
                <fieldset className={'fieldset-name'}>
                  <input value={valueName} data-type="name" readOnly={true} className={'input-name'} />
                  {/* EDIT-ICON */}
                </fieldset>
              </Col>
              <Col xs={1} className="col col-remove">
                {/* REMOVE-ICON */}
              </Col>
            </Row>
          </Col>
        </Row>
      </header>
    </div>
  );
});
