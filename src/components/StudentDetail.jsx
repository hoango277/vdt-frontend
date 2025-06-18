import { useEffect, useState } from 'react';
import { getStudentById } from '../services/studentService';
import { removeToken, getToken } from '../services/authService';
import { useParams, useNavigate } from 'react-router-dom';
import './Student.css';

const StudentDetail = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const getUserInfo = () => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo({
          username: payload.sub || 'User',
          role: payload.role || 'user'
        });
      } catch (err) {
        setUserInfo({
          username: 'User',
          role: 'user'
        });
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    setLoading(true);
    getStudentById(studentId)
      .then((data) => setStudent(data))
      .catch(() => setError('Không tìm thấy sinh viên!'))
      .finally(() => setLoading(false));
  }, [studentId]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;
  if (error) return <div className="error-message" style={{ margin: '50px auto', maxWidth: '500px' }}>{error}</div>;
  if (!student) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="page-header">
        <div>
          <h1>Quản lý sinh viên</h1>
          {userInfo && (
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
              Chào {userInfo.username} ({userInfo.role})
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="logout-button">
          Đăng xuất
        </button>
      </div>
      
      <div className="student-detail-container">
        <h2>Chi tiết sinh viên</h2>
        <div className="student-detail-card">
          <p><strong>ID:</strong> {student.id}</p>
          <p><strong>Họ tên:</strong> {student.ho_ten}</p>
          <p><strong>Ngày sinh:</strong> {student.ngay_sinh}</p>
          <p><strong>Trường:</strong> {student.truong}</p>
        </div>
        <button className="auth-button" onClick={() => navigate('/students')}>Quay lại danh sách</button>
        <button className="edit-btn" onClick={() => navigate(`/students/${student.id}/edit`)}>Sửa</button>
      </div>
    </div>
  );
};

export default StudentDetail; 