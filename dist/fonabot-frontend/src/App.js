"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const GlobalStyles_1 = require("./styles/GlobalStyles");
const AuthContext_1 = require("./contexts/AuthContext");
const ProtectedRoute_1 = require("./components/auth/ProtectedRoute");
const LoginPage_1 = require("./pages/LoginPage");
const RegisterPage_1 = require("./pages/RegisterPage");
const IvrFlowListPage_1 = require("./pages/IvrFlowListPage");
const IvrFlowBuilderPage_1 = require("./pages/IvrFlowBuilderPage");
const LiveDashboardPage_1 = require("./pages/LiveDashboardPage");
const CallLogsPage_1 = require("./pages/CallLogsPage");
const Navbar_1 = require("./components/layout/Navbar");
const Sidebar_1 = require("./components/layout/Sidebar");
const MainContentLayout_1 = require("./components/layout/MainContentLayout");
function App() {
    return (<AuthContext_1.AuthProvider>
      <react_router_dom_1.BrowserRouter>
        <GlobalStyles_1.GlobalStyles />
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/login" element={<LoginPage_1.LoginPage />}/>
          <react_router_dom_1.Route path="/register" element={<RegisterPage_1.RegisterPage />}/>
          <react_router_dom_1.Route path="/" element={<ProtectedRoute_1.ProtectedRoute>
                <>
                  <Navbar_1.Navbar />
                  <Sidebar_1.Sidebar />
                  <MainContentLayout_1.MainContentLayout>
                    <div>Welcome to FonaBot</div>
                  </MainContentLayout_1.MainContentLayout>
                </>
              </ProtectedRoute_1.ProtectedRoute>}/>
          <react_router_dom_1.Route path="/dashboard" element={<ProtectedRoute_1.ProtectedRoute>
                <>
                  <Navbar_1.Navbar />
                  <Sidebar_1.Sidebar />
                  <MainContentLayout_1.MainContentLayout>
                    <div>Dashboard</div>
                  </MainContentLayout_1.MainContentLayout>
                </>
              </ProtectedRoute_1.ProtectedRoute>}/>
          <react_router_dom_1.Route path="/flows" element={<ProtectedRoute_1.ProtectedRoute>
                <>
                  <Navbar_1.Navbar />
                  <Sidebar_1.Sidebar />
                  <MainContentLayout_1.MainContentLayout>
                    <IvrFlowListPage_1.IvrFlowListPage />
                  </MainContentLayout_1.MainContentLayout>
                </>
              </ProtectedRoute_1.ProtectedRoute>}/>
          <react_router_dom_1.Route path="/flows/:flowId/builder" element={<ProtectedRoute_1.ProtectedRoute>
                <>
                  <Navbar_1.Navbar />
                  <Sidebar_1.Sidebar />
                  <MainContentLayout_1.MainContentLayout>
                    <IvrFlowBuilderPage_1.IvrFlowBuilderPage />
                  </MainContentLayout_1.MainContentLayout>
                </>
              </ProtectedRoute_1.ProtectedRoute>}/>
          <react_router_dom_1.Route path="/live-dashboard" element={<ProtectedRoute_1.ProtectedRoute>
                <>
                  <Navbar_1.Navbar />
                  <Sidebar_1.Sidebar />
                  <MainContentLayout_1.MainContentLayout>
                    <LiveDashboardPage_1.LiveDashboardPage />
                  </MainContentLayout_1.MainContentLayout>
                </>
              </ProtectedRoute_1.ProtectedRoute>}/>
          <react_router_dom_1.Route path="/call-logs" element={<ProtectedRoute_1.ProtectedRoute>
                <>
                  <Navbar_1.Navbar />
                  <Sidebar_1.Sidebar />
                  <MainContentLayout_1.MainContentLayout>
                    <CallLogsPage_1.CallLogsPage />
                  </MainContentLayout_1.MainContentLayout>
                </>
              </ProtectedRoute_1.ProtectedRoute>}/>
          <react_router_dom_1.Route path="/settings" element={<ProtectedRoute_1.ProtectedRoute>
                <>
                  <Navbar_1.Navbar />
                  <Sidebar_1.Sidebar />
                  <MainContentLayout_1.MainContentLayout>
                    <div>Settings</div>
                  </MainContentLayout_1.MainContentLayout>
                </>
              </ProtectedRoute_1.ProtectedRoute>}/>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </AuthContext_1.AuthProvider>);
}
exports.default = App;
//# sourceMappingURL=App.js.map