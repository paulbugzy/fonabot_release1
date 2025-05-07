"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const react_1 = require("react");
const apiService_1 = require("../services/apiService");
const AuthContext = (0, react_1.createContext)(null);
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        checkAuth();
    }, []);
    const checkAuth = async () => {
        try {
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
        }
    };
    const login = async (email, password) => {
        try {
            const response = await apiService_1.apiService.post('/auth/login', {
                email,
                password,
            });
            localStorage.setItem('auth_token', response.data.token);
            setUser(response.data.user);
        }
        catch (error) {
            throw new Error('Login failed');
        }
    };
    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };
    return (<AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
//# sourceMappingURL=AuthContext.js.map