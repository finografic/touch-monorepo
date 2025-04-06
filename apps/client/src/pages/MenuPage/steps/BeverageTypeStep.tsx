import { css } from '@emotion/react';
import { Button } from '@radix-ui/themes';

const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  h2 {
    font-size: 1.5rem;
    color: #00bfff;
    margin: 0;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .option-btn {
    width: 100%;
    padding: 1rem;
    background: transparent;
    border: 2px solid #666;
    border-radius: 8px;
    color: white;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #00bfff;
      background-color: rgba(0, 191, 255, 0.1);
    }

    &.selected {
      border-color: #00bfff;
      background-color: rgba(0, 191, 255, 0.2);
    }
  }

  .navigation {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 2rem;
  }
`;

const beverageOptions = [
  'Vino',
  'Licor',
  'Cava',
  'Zumo',
  'Cerveza',
  'Agua',
  'Refresco',
];

interface BeverageTypeStepProps {
  onNext: (selectedBeverage: string) => void;
  onBack: () => void;
}

export function BeverageTypeStep({ onNext, onBack }: BeverageTypeStepProps) {
  const [selectedBeverage, setSelectedBeverage] = useState<string | null>(null);

  return (
    <div css={styles}>
      <h2>Select drink type:</h2>

      <div className="options">
        {beverageOptions.map((beverage) => (
          <button
            key={beverage}
            className={\`option-btn \${selectedBeverage === beverage ? 'selected' : ''}\`}
            onClick={() => setSelectedBeverage(beverage)}
          >
            {beverage}
          </button>
        ))}
      </div>

      <div className="navigation">
        <Button onClick={onBack} color="gray">
          « Back
        </Button>
        <Button
          onClick={() => selectedBeverage && onNext(selectedBeverage)}
          disabled={!selectedBeverage}
        >
          Next »
        </Button>
      </div>
    </div>
  );
}
