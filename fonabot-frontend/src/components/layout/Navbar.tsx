import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';

const Nav = styled.nav`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: ${theme.spacing.md} ${theme.spacing.xl};
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const NavLink = styled(Link)`
  color: ${theme.colors.text};
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text};
  cursor: pointer;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

export const Navbar = () => {
  const { logout } = useAuth();

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">FonaBot</Logo>
        <NavLinks>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/flows">Flows</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};