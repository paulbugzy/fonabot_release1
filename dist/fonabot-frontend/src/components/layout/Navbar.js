"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navbar = void 0;
const styled_1 = require("@emotion/styled");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../../contexts/AuthContext");
const theme_1 = require("../../styles/theme");
const Nav = styled_1.default.nav `
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: ${theme_1.theme.spacing.md} ${theme_1.theme.spacing.xl};
`;
const NavContainer = styled_1.default.div `
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Logo = (0, styled_1.default)(react_router_dom_1.Link) `
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme_1.theme.colors.primary};
  text-decoration: none;
`;
const NavLinks = styled_1.default.div `
  display: flex;
  gap: ${theme_1.theme.spacing.md};
`;
const NavLink = (0, styled_1.default)(react_router_dom_1.Link) `
  color: ${theme_1.theme.colors.text};
  text-decoration: none;
  
  &:hover {
    color: ${theme_1.theme.colors.primary};
  }
`;
const LogoutButton = styled_1.default.button `
  background: none;
  border: none;
  color: ${theme_1.theme.colors.text};
  cursor: pointer;
  padding: ${theme_1.theme.spacing.sm} ${theme_1.theme.spacing.md};
  
  &:hover {
    color: ${theme_1.theme.colors.primary};
  }
`;
const Navbar = () => {
    const { logout } = (0, AuthContext_1.useAuth)();
    return (<Nav>
      <NavContainer>
        <Logo to="/">FonaBot</Logo>
        <NavLinks>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/flows">Flows</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </NavLinks>
      </NavContainer>
    </Nav>);
};
exports.Navbar = Navbar;
//# sourceMappingURL=Navbar.js.map