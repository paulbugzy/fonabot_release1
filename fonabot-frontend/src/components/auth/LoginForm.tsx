import { useState } from "react";
import type { FormEvent } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { theme } from "../../styles/theme";

const Form = styled.form`
  max-width: 400px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.primary};
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

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  margin-bottom: ${theme.spacing.md};
  font-size: 0.875rem;
`;

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Attempting login with:", { email });
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login form error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Login to FonaBot</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit">Login</Button>
    </Form>
  );
};
