"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalStyles = void 0;
const react_1 = require("@emotion/react");
const theme_1 = require("./theme");
const GlobalStyles = () => (<react_1.Global styles={(0, react_1.css) `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: ${theme_1.theme.fonts.body};
        background-color: ${theme_1.theme.colors.background};
        color: ${theme_1.theme.colors.text};
        line-height: 1.5;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: ${theme_1.theme.fonts.heading};
        font-weight: 600;
      }

      a {
        color: ${theme_1.theme.colors.primary};
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    `}/>);
exports.GlobalStyles = GlobalStyles;
//# sourceMappingURL=GlobalStyles.js.map