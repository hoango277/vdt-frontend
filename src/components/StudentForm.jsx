import { useState, useEffect } from 'react';
import { createStudent, getStudentById, updateStudent } from '../services/studentService';
import { removeToken, getToken } from '../services/authService';
import { useNavigate, useParams } from 'react-router-dom';
import './Student.css';

const StudentForm = () => {
  const { studentId } = useParams();
  const isEdit = Boolean(studentId);
  const [form, setForm] = useState({
    ho_ten: '',
    ngay_sinh: '',
    truong: '',
  });
  const [loading, setLoading] = useState(false);
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
    if (isEdit) {
      setLoading(true);
      getStudentById(studentId)
        .then((data) => setForm(data))
        .catch(() => setError('Không tìm thấy sinh viên!'))
        .finally(() => setLoading(false));
    }
  }, [isEdit, studentId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await updateStudent(studentId, form);
        navigate('/students');
      } else {
        await createStudent(form);
        navigate('/students');
      }
    } catch (err) {
      setError('Lưu thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

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
      
      <div className="student-form-container">
        <h2>{isEdit ? 'Sửa sinh viên' : 'Thêm sinh viên mới'}</h2>
        <form className="student-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ tên</label>
            <input
              type="text"
              name="ho_ten"
              value={form.ho_ten}
              onChange={handleChange}
              required
              placeholder="Nhập họ tên"
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="ngay_sinh"
              value={form.ngay_sinh}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Trường</label>
            <input
              type="text"
              name="truong"
              value={form.truong}
              onChange={handleChange}
              required
              placeholder="Nhập tên trường"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/students')}>
            Hủy
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm; 