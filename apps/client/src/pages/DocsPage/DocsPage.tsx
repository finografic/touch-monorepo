import { Container } from 'react-grid-system';
import { useEffect } from 'react';
import mermaid from 'mermaid';
import { styles } from './DocsPage.styles';

const SCHEMA_DIAGRAM = `
erDiagram
    drinkTypes ||--o{ drinkSubtypes : "has subtypes"
    drinkTypes ||--o{ DrinkConfigs : "used in"
    drinkSubtypes ||--o{ DrinkConfigs : "used in"
    ContainerTypes ||--o{ DrinkConfigs : "used in"
    Volumes ||--o{ DrinkConfigs : "used in"

    TemperatureTables ||--o{ TemperatureTableEntries : "contains"
    DrinkConfigs ||--o{ TemperatureTables : "references"

    Elements ||--o{ RunningOrders : "executes"
    DrinkConfigs ||--o{ RunningOrders : "configures"
`;

export function DocsPage() {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      er: {
        useMaxWidth: true,
      },
    });
  }, []);

  return (
    <div css={styles}>
      <Container>
        <h1>ServiFresc Documentation</h1>

        <section className="schema-section">
          <h2>Database Schema Relationships</h2>
          <div className="mermaid-container">
            <div className="mermaid">{SCHEMA_DIAGRAM}</div>
          </div>

          <div className="schema-legend">
            <h3>Core Entities</h3>
            <ul>
              <li>
                <strong>drinkTypes & Subtypes:</strong> Define available DRINKs and their variants
              </li>
              <li>
                <strong>ContainerTypes:</strong> Material types (Plástico, Vidrio, Metal)
              </li>
              <li>
                <strong>Volumes:</strong> Available container sizes
              </li>
              <li>
                <strong>DrinkConfigs:</strong> Valid combinations of types, containers, and volumes
              </li>
            </ul>

            <h3>Operational Entities</h3>
            <ul>
              <li>
                <strong>TemperatureTables:</strong> Time-temperature relationships
              </li>
              <li>
                <strong>Elements:</strong> The 11 dispensing stations
              </li>
              <li>
                <strong>RunningOrders:</strong> Active dispensing operations
              </li>
            </ul>
          </div>
        </section>
      </Container>
    </div>
  );
}
