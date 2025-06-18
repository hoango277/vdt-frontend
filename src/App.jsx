import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import { getToken } from './services/authService';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetail from './components/StudentDetail';
import './App.css';

// Component bảo vệ route - chỉ cho phép truy cập khi đã đăng nhập
const ProtectedRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

// Component chuyển hướng - nếu đã đăng nhập thì chuyển đến students
const PublicRoute = ({ children }) => {
  const token = getToken();
  return token ? <Navigate to="/students" replace /> : children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Trang chủ - chuyển hướng đến login hoặc students */}
          <Route 
            path="/" 
            element={
              getToken() ? 
                <Navigate to="/students" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Trang đăng nhập - chỉ truy cập khi chưa đăng nhập */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* Trang đăng ký - chỉ truy cập khi chưa đăng nhập */}
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* CRUD Student */}
          <Route 
            path="/students" 
            element={
              <ProtectedRoute>
                <StudentList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students/new" 
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students/:studentId" 
            element={
              <ProtectedRoute>
                <StudentDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students/:studentId/edit" 
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            } 
          />
          
          {/* Route không tồn tại - chuyển hướng về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
