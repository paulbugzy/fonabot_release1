"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const styled_1 = require("@emotion/styled");
const react_router_dom_1 = require("react-router-dom");
const LoginForm_1 = require("../components/auth/LoginForm");
const theme_1 = require("../styles/theme");
const Container = styled_1.default.div `
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme_1.theme.spacing.xl};
  background-color: ${theme_1.theme.colors.background};
`;
const RegisterLink = styled_1.default.div `
  margin-top: ${theme_1.theme.spacing.lg};
  text-align: center;
`;
const LoginPage = () => {
    return (<Container>
      <LoginForm_1.LoginForm />
      <RegisterLink>
        Don't have an account?{' '}
        <react_router_dom_1.Link to="/register">Create one now</react_router_dom_1.Link>
      </RegisterLink>
    </Container>);
};
exports.LoginPage = LoginPage;
//# sourceMappingURL=LoginPage.js.map