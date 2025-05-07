"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectedRoute = void 0;
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../../contexts/AuthContext");
const ProtectedRoute = ({ children }) => {
    const { user, loading } = (0, AuthContext_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <react_router_dom_1.Navigate to="/login" state={{ from: location }} replace/>;
    }
    return <>{children}</>;
};
exports.ProtectedRoute = ProtectedRoute;
//# sourceMappingURL=ProtectedRoute.js.map