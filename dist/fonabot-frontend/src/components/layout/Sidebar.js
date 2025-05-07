"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const styled_1 = require("@emotion/styled");
const react_router_dom_1 = require("react-router-dom");
const theme_1 = require("../../styles/theme");
const SidebarContainer = styled_1.default.aside `
  width: 250px;
  background-color: white;
  border-right: 1px solid #E5E7EB;
  height: 100vh;
  padding: ${theme_1.theme.spacing.md};
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 80px;
`;
const SidebarLink = (0, styled_1.default)(react_router_dom_1.Link) `
  display: block;
  padding: ${theme_1.theme.spacing.sm} ${theme_1.theme.spacing.md};
  color: ${theme_1.theme.colors.text};
  text-decoration: none;
  border-radius: 6px;
  margin-bottom: ${theme_1.theme.spacing.xs};
  
  &:hover {
    background-color: ${theme_1.theme.colors.background};
    color: ${theme_1.theme.colors.primary};
  }
`;
const Sidebar = () => {
    return (<SidebarContainer>
      <SidebarLink to="/dashboard">Overview</SidebarLink>
      <SidebarLink to="/flows">IVR Flows</SidebarLink>
      <SidebarLink to="/live-dashboard">Live Dashboard</SidebarLink>
      <SidebarLink to="/call-logs">Call Logs</SidebarLink>
      <SidebarLink to="/numbers">Phone Numbers</SidebarLink>
      <SidebarLink to="/analytics">Analytics</SidebarLink>
      <SidebarLink to="/settings">Settings</SidebarLink>
    </SidebarContainer>);
};
exports.Sidebar = Sidebar;
//# sourceMappingURL=Sidebar.js.map