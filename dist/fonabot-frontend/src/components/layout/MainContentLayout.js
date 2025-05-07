"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainContentLayout = void 0;
const styled_1 = require("@emotion/styled");
const theme_1 = require("../../styles/theme");
const MainContent = styled_1.default.main `
  margin-left: 250px;
  padding: ${theme_1.theme.spacing.xl};
  padding-top: 80px;
`;
const MainContentLayout = ({ children }) => {
    return <MainContent>{children}</MainContent>;
};
exports.MainContentLayout = MainContentLayout;
//# sourceMappingURL=MainContentLayout.js.map