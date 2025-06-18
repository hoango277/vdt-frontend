import { useEffect, useState } from 'react';
import { getStudents, deleteStudent } from '../services/studentService';
import { removeToken, getToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Student.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStudents(0, 1000); // Đảm bảo lấy từ đầu với limit lớn
      console.log('Danh sách sinh viên:', data); // Debug để xem data
      setStudents(data);
    } catch (err) {
      setError('Không thể tải danh sách sinh viên!');
      console.error('Lỗi tải sinh viên:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = () => {
    const token = getToken();
    if (token) {
      try {
        // Decode JWT token để lấy thông tin user
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo({
          username: payload.sub || 'User',
          role: payload.role || 'user'
        });
      } catch (err) {
        console.error('Lỗi decode token:', err);
        setUserInfo({
          username: 'User',
          role: 'user'
        });
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này?')) return;
    try {
      await deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
    } catch (error) {
      alert(error);
      console.error('Lỗi xóa sinh viên:', error);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  console.log('StudentList component đang render...');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f9fa', 
      padding: '20px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {console.log('Header đang được render...')}
      <div className="page-header" style={{ display: 'flex', backgroundColor: 'white' }}>
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
      
      <div className="student-list-container">
        <div className="student-list-header">
          <h2>Danh sách sinh viên (Tổng: {students.length})</h2>
          <button className="add-btn" onClick={() => navigate('/students/new')}>+ Thêm sinh viên</button>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Ngày sinh</th>
                  <th>Trường</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? students.map((student) => {
                  return (
                    <tr key={student.id} style={{ backgroundColor: 'inherit' }}>
                      <td>{student.id}</td>
                      <td>{student.ho_ten}</td>
                      <td>{student.ngay_sinh}</td>
                      <td>{student.truong}</td>
                      <td>
                        <button onClick={() => navigate(`/students/${student.id}`)}>Xem</button>
                        <button onClick={() => navigate(`/students/${student.id}/edit`)}>Sửa</button>
                        <button onClick={() => handleDelete(student.id)} className="delete-btn">Xóa</button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      Không có sinh viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList; 