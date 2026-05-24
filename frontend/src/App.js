import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Auth from "./pages/Auth";


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}


function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" /> : children;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/quiz" element={
          <PrivateRoute>
            <Quiz />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;