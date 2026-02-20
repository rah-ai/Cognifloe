import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { ToastProvider } from "./components/ui/Toast"
import DashboardLayout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import WorkflowInput from "./pages/WorkflowInput"
import AgentArchitectures from "./pages/AgentArchitectures"
import Metrics from "./pages/Metrics"
import Settings from "./pages/Settings"
import MLPredictions from "./pages/MLPredictions"
import ShadowMode from "./pages/ShadowMode"
import AgentCatalog from "./pages/AgentCatalog"

import ScrollToTop from "./components/ScrollToTop"

import { WorkflowProvider } from "./context/WorkflowContext"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cognifloe-theme">
      <ToastProvider>
        <WorkflowProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="input" element={<WorkflowInput />} />
                <Route path="agents" element={<AgentArchitectures />} />
                <Route path="metrics" element={<Metrics />} />
                <Route path="ml-predictions" element={<MLPredictions />} />
                <Route path="catalog" element={<AgentCatalog />} />
                <Route path="shadow-mode" element={<ShadowMode />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
            <ScrollToTop />
          </Router>
        </WorkflowProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
