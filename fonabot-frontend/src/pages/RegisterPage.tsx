import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
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

const LoginLink = styled.div`
  margin-top: ${theme.spacing.lg};
  text-align: center;
`;

export const RegisterPage = () => {
  return (
    <Container>
      <RegisterForm />
      <LoginLink>
        Already have an account?{' '}
        <Link to="/login">Login here</Link>
      </LoginLink>
    </Container>
  );
};