# Dự Án Authentication React + Vite

Dự án React với Vite hỗ trợ đăng nhập và đăng ký người dùng.

## 🚀 Tính năng

- ✅ **Đăng nhập** với API `/api/auth/login`
- ✅ **Đăng ký** với API `/api/auth/register`
- ✅ **Lưu token** vào localStorage
- ✅ **Tự động thêm Bearer token** vào headers API
- ✅ **Bảo vệ route** Dashboard
- ✅ **Giao diện đẹp** và responsive
- ✅ **Xử lý lỗi** và thông báo

## 📋 API Endpoints

### Đăng nhập
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}
```

### Đăng ký
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "role": "user"
}
```

## 🛠️ Cài đặt và Chạy

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Chạy ứng dụng:**
```bash
npm run dev
```

3. **Mở trình duyệt:**
Truy cập `http://localhost:5173`

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── Login.jsx          # Component đăng nhập
│   ├── Register.jsx       # Component đăng ký
│   ├── Dashboard.jsx      # Component dashboard
│   ├── Auth.css          # CSS cho Login & Register
│   └── Dashboard.css     # CSS cho Dashboard
├── services/
│   └── authService.js    # Service xử lý API authentication
├── App.jsx               # Component chính với routing
├── App.css               # CSS toàn cục
└── main.jsx              # Entry point

```

## 🔐 Cách hoạt động

1. **Đăng ký:** Người dùng tạo tài khoản mới
2. **Đăng nhập:** Hệ thống xác thực và trả về token
3. **Lưu token:** Token được lưu vào localStorage
4. **Tự động gửi token:** Mọi API request sau đó sẽ tự động gửi Bearer token
5. **Bảo vệ route:** Dashboard chỉ truy cập được khi có token hợp lệ

## 🎨 Technologies

- **React 18** - UI Framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling với Flexbox/Grid

## 📱 Routes

- `/` - Trang chủ (chuyển hướng)
- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký
- `/dashboard` - Trang dashboard (bảo vệ)

## 🔧 Cấu hình API

Để thay đổi base URL của API, sửa file `src/services/authService.js`:

```javascript
const api = axios.create({
  baseURL: 'https://your-api-domain.com', // Thay đổi ở đây
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 🎯 Sử dụng

1. Truy cập ứng dụng
2. Chọn "Đăng ký" để tạo tài khoản mới
3. Sau khi đăng ký thành công, đăng nhập với tài khoản vừa tạo
4. Được chuyển hướng đến Dashboard
5. Sử dụng nút "Đăng xuất" để thoát khỏi hệ thống

---

**Developed with ❤️ using React + Vite**
