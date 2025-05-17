import { useFilters } from 'hooks/useFilters';
import { styles } from './DevFilterResults.styles';
import { Col, Row } from 'react-grid-system';

export const DevFilterResults = () => {
  //
  const { filteredData, filters } = useFilters({});

  return (
    <div id="dev-filter-results" css={styles}>
      <Row>
        <Col xs={12} className="filters">
          <h4>Filters ({Object.keys(filters).length}):</h4>
          <pre>{JSON.stringify(filters, null, 2)}</pre>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="results-list">
          <h4>Results: {filteredData.length}</h4>
          <pre>
            {filteredData.map((item: any) => (
              <Row key={item.id} direction="row" align="center">
                <Col xs={4}>
                  <strong>{item.drinkTypeName}</strong>
                </Col>
                <Col xs={2}>
                  <p>{item.drinkSubtypeName}</p>
                </Col>
                <Col xs={3}>
                  <p>{item.volumeName}</p>
                </Col>
                <Col xs={3}>
                  <p>{item.containerTypeName}</p>
                </Col>
              </Row>
            ))}
          </pre>
        </Col>
      </Row>
    </div>
  );
};
