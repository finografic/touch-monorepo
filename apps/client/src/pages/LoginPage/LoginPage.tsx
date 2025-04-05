import { useState } from 'react';
// import { useNavigate } from '@tanstack/react-router';
import { useAuth } from 'lib/auth/AuthContext';
import { Col, Container, Row } from 'react-grid-system';
import { styles } from './LoginPage.css';

export function LoginPage() {
  // const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await login({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      // navigate({ to: '/dashboard' });
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  return (
    <div css={styles}>
      <Container>
        <Row justify="center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <form className="login-form" onSubmit={handleSubmit}>
              <h1 className="title">Login</h1>

              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>

              <button type="submit">Login</button>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
