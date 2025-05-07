import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { theme } from '../styles/theme';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background};
`;

const RegisterLink = styled.div`
  margin-top: ${theme.spacing.lg};
  text-align: center;
`;

export const LoginPage = () => {
  return (
    <Container>
      <LoginForm />
      <RegisterLink>
        Don't have an account?{' '}
        <Link to="/register">Create one now</Link>
      </RegisterLink>
    </Container>
  );
};