"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPage = void 0;
const styled_1 = require("@emotion/styled");
const react_router_dom_1 = require("react-router-dom");
const RegisterForm_1 = require("../components/auth/RegisterForm");
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
const LoginLink = styled_1.default.div `
  margin-top: ${theme_1.theme.spacing.lg};
  text-align: center;
`;
const RegisterPage = () => {
    return (<Container>
      <RegisterForm_1.RegisterForm />
      <LoginLink>
        Already have an account?{' '}
        <react_router_dom_1.Link to="/login">Login here</react_router_dom_1.Link>
      </LoginLink>
    </Container>);
};
exports.RegisterPage = RegisterPage;
//# sourceMappingURL=RegisterPage.js.map