import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const MainContent = styled.main`
  margin-left: 250px;
  padding: ${theme.spacing.xl};
  padding-top: 80px;
`;

export const MainContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MainContent>{children}</MainContent>;
};