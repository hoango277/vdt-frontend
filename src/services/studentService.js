import api from './authService';

// Lấy danh sách sinh viên
export const getStudents = async (skip = 0, limit = 1000) => {
  const response = await api.get(`/api/students?skip=${skip}&limit=${limit}`);
  return response.data;
};

// Lấy chi tiết sinh viên theo id
export const getStudentById = async (id) => {
  const response = await api.get(`/api/students/${id}`);
  return response.data;
};

// Thêm mới sinh viên
export const createStudent = async (student) => {
  const response = await api.post('/api/students', student);
  return response.data;
};

// Cập nhật sinh viên
export const updateStudent = async (id, student) => {
  const response = await api.put(`/api/students/${id}`, student);
  return response.data;
};

// Xóa sinh viên
export const deleteStudent = async (id) => {
  const response = await api.delete(`/api/students/${id}`);
  return response.data;
}; 