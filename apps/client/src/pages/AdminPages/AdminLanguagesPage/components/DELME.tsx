import { Col, Row, Visible } from 'react-grid-system';
import { useNavigateState } from 'hooks/useNavigateState';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import type { Action, TableConfig } from 'types';
import { useRouter } from 'routes/hooks';
import { DATE_FORMAT } from 'i18n';
import { CalendarDay } from 'components/CalendarDay';
import { ArrayJSX } from 'utils/ArrayJSX';
import { getFakerImageURLv3 } from 'data/generators/data.images';
import { ES } from 'i18n/locale';
import { SPAIN_PROVINCES } from 'forms/config/form.select-options/spain/spain.select-options';
import { styles } from './EventCard.styles';

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  if (!value) return null;
  return (
    <div className="info-row">
      <label>{label}:</label>
      {value}
    </div>
  );
};

interface DataListItemProps {
  data: any;
  single?: boolean;
  config: TableConfig;
  index: number;
}

export const EventCard = ({ data, config, single = false, index }: DataListItemProps): ReactElement => {
  const { params, route } = useRouter();
  const { navigate } = useNavigateState();
  const imageSrc = getFakerImageURLv3();

  const isEven: boolean = index % 2 == 0;
  const listItemConfig = config.list?.listItem;
  const [hasImageError, setHasImageError] = useState(false);

  const pathname = location.pathname;
  const isAdminPath = !!pathname.startsWith('/admin');
  const isCatPath = !!location.pathname.startsWith('/cat/');
  const isExternalURL = !!data?.url?.startsWith('http');

  const handleClick = () => {
    navigate(`view/${data.id}`);
  };

  // CSS CLASSES
  const cssClasses = new ArrayJSX('card');
  cssClasses.push(`item-${isEven ? 'even' : 'odd'}`);
  single && cssClasses.push('single');

  // const bgImage = data.image ? { backgroundImage: `url(${imageSrc})` } : null;
  const bgImage = { backgroundImage: `url(${imageSrc}), url(${getFakerImageURLv3()})` };
  const date = new Date(data.date) || new Date();
  const eventDate = data.date ? format(date, DATE_FORMAT.DEFAULT, { locale: ES }) : '';

  // VALUE PARSING
  const provinceLabel = Object.values(SPAIN_PROVINCES).find(
    (province: any) => province.value === data.province,
  )?.label as string;

  // console.log('%cPROVINCE', 'color:grey', provinceLabel);

  return (
    <div css={styles} className={cssClasses.inline()} onClick={handleClick}>
      <aside className="card-aside">
        <Row className="row">
          <Col xs={12} sm={12} md={12} lg={12} xl={9} xxl={9} className="col col-test">
            <Row className="row row-test">
              <Col xs={3} sm={2} md={3} lg={3} xl={3} xxl={3} className="col col-date">
                <CalendarDay date={eventDate} time={data?.time_start} />
              </Col>
              <Visible xs sm>
                <Col xs={9} sm={10} className="col col-title">
                  <h2>{data.name}</h2>
                </Col>
              </Visible>
              <Col xs={12} sm={10} md={9} lg={9} xl={9} xxl={9} className="col col-info">
                <section className="info">
                  <Visible md lg xl xxl>
                    <h2>{data.name}</h2>
                  </Visible>
                  <InfoRow label="Tipo de Evento" value={data.event_type} />
                  <InfoRow label="Ciudad" value={data.city} />
                  <InfoRow label="Province" value={provinceLabel} />
                </section>
              </Col>
            </Row>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={3}
            xxl={3}
            style={{ ...bgImage }}
            className="col col-image"
          ></Col>
        </Row>
      </aside>
    </div>
  );
};
