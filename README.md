# Web Book - Ứng dụng Cửa hàng Sách Thương mại Điện tử

Ứng dụng cửa hàng sách thương mại điện tử full-stack được xây dựng với backend Spring Boot và frontend React, có tính năng xác thực người dùng, quản lý sách, xử lý đơn hàng và tích hợp thanh toán.

## 🏗️ Kiến trúc

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.4.5
- **Ngôn ngữ**: Java 21
- **Cơ sở dữ liệu**: MySQL 8.0
- **Cache**: Redis
- **Xác thực**: JWT + OAuth2 (Google)
- **Thanh toán**: Tích hợp VNPay
- **Email**: SendGrid
- **AI**: Spring AI với OpenAI

### Frontend (React)
- **Framework**: React 19 với TypeScript
- **Công cụ xây dựng**: Vite
- **Thư viện UI**: Ant Design 5.25.1
- **Định tuyến**: React Router 7.6.0
- **HTTP Client**: Axios 1.9.0
- **Quản lý trạng thái**: React Context API
- **OAuth**: @react-oauth/google

## 📋 Tính năng

### Tính năng Người dùng
- **Xác thực**: Đăng ký/Đăng nhập với email và mật khẩu
- **Đăng nhập xã hội**: Tích hợp Google OAuth2
- **Xác thực Email**: Xác thực email qua SendGrid
- **Đặt lại mật khẩu**: Chức năng đặt lại mật khẩu an toàn
- **Quản lý hồ sơ**: Cập nhật thông tin người dùng và avatar
- **Duyệt sách**: Xem sách với chi tiết, hình ảnh và danh mục
- **Giỏ hàng**: Thêm sách vào giỏ và quản lý số lượng
- **Đặt hàng**: Đặt hàng với tích hợp thanh toán VNPay
- **Lịch sử đơn hàng**: Xem các đơn hàng trước đó và chi tiết

### Tính năng Admin
- **Dashboard**: Tổng quan thống kê hệ thống
- **Quản lý người dùng**: Tạo, cập nhật và quản lý người dùng
- **Quản lý sách**: Thao tác CRUD đầy đủ cho sách
  - Tải lên ảnh bìa và thư viện ảnh sách
  - Quản lý chi tiết sách (tác giả, giá, số lượng, danh mục)
  - Nhập/xuất dữ liệu người dùng qua Excel
- **Quản lý đơn hàng**: Xem và quản lý tất cả đơn hàng

## 🗄️ Cơ sở dữ liệu

### Bảng
- **users**: Tài khoản người dùng với thông tin xác thực và hồ sơ
- **books**: Danh mục sách với hình ảnh, giá và tồn kho
- **orders**: Đơn hàng khách hàng với chi tiết thanh toán và vận chuyển
- **order_details**: Các mục riêng lẻ trong đơn hàng

### Dữ liệu mẫu
Được điền sẵn với sách mẫu qua nhiều danh mục (Tâm lý, Truyện tranh, Kinh doanh, Âm nhạc, Sức khỏe, Nấu ăn, Lịch sử, Du lịch, Thể thao, Nghệ thuật, Tuổi mới lớn) và người dùng thử.

## 🚀 Bắt đầu

### Điều kiện tiên quyết
- Docker và Docker Compose
- Java 21 (cho phát triển local)
- Node.js 20 (cho phát triển local)
- MySQL 8.0
- Redis

### Biến môi trường

#### Backend (application.yaml)
```yaml
# Database
DB_USERNAME: root
DB_PASSWORD: your_password

# Redis
REDIS_HOST: localhost
REDIS_PORT: 6379
REDIS_TIMEOUT: 6000

# JWT
JWT_SECRET: your_jwt_secret_key
JWT_ACCESS_TOKEN_VALIDITY: 86400
JWT_REFRESH_TOKEN_VALIDITY: 2592000

# SendGrid
SENDGRID_API_KEY: your_sendgrid_api_key
SENDGRID_FROM_EMAIL: your_email@example.com
SENDGRID_TEMPLATE_ID: your_template_id
SENDGRID_VERIFY_URL: http://localhost:3000/verify-email

# Google OAuth
GOOGLE_CLIENT_ID: your_google_client_id
GOOGLE_CLIENT_SECRET: your_google_client_secret
GOOGLE_REDIRECT_URI: http://localhost:3000/auth/google/callback

# OpenAI
OPENAI_API_KEY: your_openai_api_key

# File Upload
UPLOAD_FILE_BASE_URI: file:///path/to/upload/image/

# Server
SERVER_PORT: 8080
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:8080
```

### Bắt đầu nhanh với Docker

1. Clone repository
```bash
git clone <repository-url>
cd web-book
```

2. Tạo thư mục upload
```bash
mkdir -p upload/image
```

3. Khởi động tất cả dịch vụ
```bash
docker-compose up -d
```

4. Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Admin Panel: http://localhost:3000/admin
- Nginx (Reverse Proxy): http://localhost:80

### Phát triển Local

#### Backend
```bash
cd backend-springboot
./mvnw spring-boot:run
```

#### Frontend
```bash
cd prondend-reactjs
npm install
npm run dev
```

## 📁 Cấu trúc dự án

```
web-book/
├── backend-springboot/          # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── vn/vuhoang/backend_springboot/
│   │   │   │       ├── config/          # Cấu hình Security, JWT, OAuth2
│   │   │   │       ├── controller/     # REST controllers
│   │   │   │       ├── domain/
│   │   │   │       │   ├── entity/     # JPA entities
│   │   │   │       │   └── dto/        # Data transfer objects
│   │   │   │       ├── exception/      # Custom exceptions
│   │   │   │       ├── mapper/         # MapStruct mappers
│   │   │   │       ├── repository/     # JPA repositories
│   │   │   │       └── service/        # Business logic
│   │   │   └── resources/
│   │   │       └── application.yaml    # Cấu hình ứng dụng
│   │   └── test/
│   └── pom.xml                        # Maven dependencies
│
├── prondend-reactjs/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/               # Admin components
│   │   │   ├── client/              # Client components
│   │   │   ├── context/             # React context
│   │   │   └── layout/              # Layout components
│   │   ├── pages/
│   │   │   ├── admin/               # Admin pages
│   │   │   └── client/              # Client pages
│   │   ├── services/                # API services
│   │   ├── types/                   # TypeScript types
│   │   ├── main.tsx                 # App entry point
│   │   └── layout.tsx               # Root layout
│   ├── public/                      # Static assets
│   ├── package.json                 # NPM dependencies
│   └── vite.config.ts               # Vite configuration
│
├── upload/                          # File uploads
│   └── image/                       # Book images
│
├── mysql-init.sql                   # Database initialization
├── docker-compose.yaml              # Docker orchestration
└── README.md                        # File này
```

## 🔧 API Endpoints

### Xác thực
- `POST /api/v1/auth/login` - Đăng nhập người dùng
- `POST /api/v1/auth/register` - Đăng ký người dùng
- `POST /api/v1/auth/refresh` - Làm mới JWT token
- `GET /api/v1/auth/google` - Đăng nhập Google OAuth2

### Sách
- `GET /api/v1/books` - Lấy tất cả sách (với phân trang)
- `GET /api/v1/books/{id}` - Lấy sách theo ID
- `POST /api/v1/books` - Tạo sách mới (Admin)
- `PUT /api/v1/books/{id}` - Cập nhật sách (Admin)
- `DELETE /api/v1/books/{id}` - Xóa sách (Admin)

### Đơn hàng
- `POST /api/v1/orders` - Tạo đơn hàng mới
- `GET /api/v1/orders` - Lấy đơn hàng người dùng
- `GET /api/v1/orders/{id}` - Lấy đơn hàng theo ID
- `GET /api/v1/orders/admin` - Lấy tất cả đơn hàng (Admin)

### Người dùng
- `GET /api/v1/users` - Lấy tất cả người dùng (Admin)
- `GET /api/v1/users/{id}` - Lấy người dùng theo ID
- `PUT /api/v1/users/{id}` - Cập nhật người dùng
- `DELETE /api/v1/users/{id}` - Xóa người dùng (Admin)

### Files
- `POST /api/v1/files/upload` - Tải lên file
- `GET /static/{filename}` - Phục vụ file tĩnh

### Thanh toán
- `POST /api/v1/payment/create` - Tạo thanh toán VNPay
- `GET /api/v1/payment/callback` - Callback thanh toán VNPay

## 🔐 Bảo mật

- **Xác thực JWT**: Xác thực dựa trên token không trạng thái
- **OAuth2**: Tích hợp đăng nhập xã hội Google
- **Mã hóa mật khẩu**: BCrypt hashing
- **Kiểm soát truy cập dựa trên vai trò**: Vai trò ADMIN và USER
- **Cấu hình CORS**: Chia sẻ tài nguyên đa nguồn gốc
- **Xác thực đầu vào**: Xác thực yêu cầu với Jakarta Validation

## 💳 Tích hợp Thanh toán

Ứng dụng tích hợp với VNPay để xử lý thanh toán:
- Tích hợp cổng thanh toán an toàn
- Xử lý callback thanh toán
- Cập nhật trạng thái đơn hàng dựa trên kết quả thanh toán

## 📧 Dịch vụ Email

Tích hợp SendGrid cho:
- Xác thực email trong quá trình đăng ký
- Chức năng đặt lại mật khẩu
- Email giao dịch

## 🤖 Tích hợp AI

Spring AI với OpenAI cho:
- Đề xuất sách thông minh
- Tính năng tạo nội dung
- Xử lý ngôn ngữ tự nhiên

## 🛠️ Công nghệ

### Backend
- Spring Boot 3.4.5
- Spring Security
- Spring Data JPA
- Spring Data Redis
- Spring AI
- MySQL Connector
- SendGrid Java
- MapStruct
- Lombok
- Google API Client

### Frontend
- React 19
- TypeScript 5.8
- Vite 6.3
- Ant Design 5.25
- Ant Design Pro Components 2.8
- React Router 7.6
- Axios 1.9
- Day.js 1.11
- ExcelJS 4.4
- React Icons 5.5
- React CSV 2.2
- React CountUp 6.5
- React Spinners 0.17
- Sass 1.89

### DevOps
- Docker & Docker Compose
- Nginx (Reverse Proxy)
- MySQL 8.0
- Redis



## 👤 Tác giả

**Vũ Đình Hoàng**
- Email: vuhoang5053@gmail.com

