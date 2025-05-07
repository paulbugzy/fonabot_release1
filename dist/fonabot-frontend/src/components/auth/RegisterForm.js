"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterForm = void 0;
const react_1 = require("react");
const styled_1 = require("@emotion/styled");
const react_router_dom_1 = require("react-router-dom");
const apiService_1 = require("../../services/apiService");
const theme_1 = require("../../styles/theme");
const Form = styled_1.default.form `
  max-width: 400px;
  margin: 0 auto;
  padding: ${theme_1.theme.spacing.xl};
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Input = styled_1.default.input `
  width: 100%;
  padding: ${theme_1.theme.spacing.md};
  margin-bottom: ${theme_1.theme.spacing.md};
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
`;
const Button = styled_1.default.button `
  width: 100%;
  padding: ${theme_1.theme.spacing.md};
  background-color: ${theme_1.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4338ca;
  }
`;
const ErrorMessage = styled_1.default.div `
  color: ${theme_1.theme.colors.error};
  margin-bottom: ${theme_1.theme.spacing.md};
  font-size: 0.875rem;
`;
const RegisterForm = () => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await apiService_1.apiService.post('/auth/register', { email, password });
            navigate('/login');
        }
        catch (err) {
            setError('Registration failed. Please try again.');
        }
    };
    return (<Form onSubmit={handleSubmit}>
      <h2>Create FonaBot Account</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
      <Button type="submit">Register</Button>
    </Form>);
};
exports.RegisterForm = RegisterForm;
//# sourceMappingURL=RegisterForm.js.map