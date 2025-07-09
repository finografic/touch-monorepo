import React, { useState } from 'react';
import { OrdersFormPOC } from '../AdminOrdersPage/forms/OrdersFormPOC';
import type { OrdersFormValues } from 'forms/FormMiddleware/OrdersFormFieldConfigs';

export const FormMiddlewareDemo: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<OrdersFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: OrdersFormValues) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmittedData(formData);
    setIsLoading(false);

    console.log('Form submitted with middleware system:', formData);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem' }}>🧙‍♂️ Form Middleware System Demo</h1>
        <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>
          Experience the power of centralized form logic, validation, and localization!
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: submittedData ? '1fr 1fr' : '1fr',
        }}
      >
        {/* Form Demo */}
        <div>
          <OrdersFormPOC onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Results Panel */}
        {submittedData && (
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <h3
              style={{
                color: '#1e293b',
                margin: '0 0 1rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              ✅ Form Submitted Successfully!
            </h3>

            <div
              style={{
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '1rem',
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Submitted Data:</h4>
              <pre
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#111827',
                  overflow: 'auto',
                  maxHeight: '400px',
                }}
              >
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
                🎯 Middleware Features Demonstrated:
              </h4>
              <ul style={{ margin: 0, color: '#6b7280' }}>
                <li>✓ Spanish localization (comma formatting)</li>
                <li>✓ Dynamic temperature constraints</li>
                <li>✓ Field dependency management</li>
                <li>✓ Centralized validation logic</li>
                <li>✓ Clean component architecture</li>
              </ul>
            </div>

            <button
              onClick={() => setSubmittedData(null)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Clear Results
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fefce8',
          border: '1px solid #facc15',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ color: '#92400e', margin: '0 0 1rem 0' }}>🧪 Try These Features:</h3>
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
        >
          <div>
            <h4 style={{ color: '#78350f', margin: '0 0 0.5rem 0' }}>Spanish Localization:</h4>
            <ul style={{ color: '#78350f', margin: 0 }}>
              <li>Type "8,5" → displays "8,5"</li>
              <li>Stores as 8.5 in form data</li>
              <li>Use arrow keys to step values</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#78350f', margin: '0 0 0.5rem 0' }}>Dynamic Constraints:</h4>
            <ul style={{ color: '#78350f', margin: 0 }}>
              <li>Change "Temperatura consumo" to 10</li>
              <li>Watch "Temperatura congelación" max update to 7.5</li>
              <li>Constraints update automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
