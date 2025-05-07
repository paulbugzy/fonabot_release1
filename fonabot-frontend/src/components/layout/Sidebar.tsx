import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: white;
  border-right: 1px solid #E5E7EB;
  height: 100vh;
  padding: ${theme.spacing.md};
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 80px;
`;

const SidebarLink = styled(Link)`
  display: block;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.text};
  text-decoration: none;
  border-radius: 6px;
  margin-bottom: ${theme.spacing.xs};
  
  &:hover {
    background-color: ${theme.colors.background};
    color: ${theme.colors.primary};
  }
`;

export const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarLink to="/dashboard">Overview</SidebarLink>
      <SidebarLink to="/flows">IVR Flows</SidebarLink>
      <SidebarLink to="/live-dashboard">Live Dashboard</SidebarLink>
      <SidebarLink to="/call-logs">Call Logs</SidebarLink>
      <SidebarLink to="/numbers">Phone Numbers</SidebarLink>
      <SidebarLink to="/analytics">Analytics</SidebarLink>
      <SidebarLink to="/settings">Settings</SidebarLink>
    </SidebarContainer>
  );
};