# Ứng Dụng Thương Mại Điện Tử Laptop Shop

Một ứng dụng web thương mại điện tử đầy đủ tính năng được xây dựng với Spring Boot để bán laptop và các thiết bị điện tử.

## 📋 Mục Lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cơ sở dữ liệu](#cơ-sở-dữ-liệu)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Triển khai Docker](#triển-khai-docker)
- [API Endpoints](#api-endpoints)
- [Người dùng mặc định](#người-dùng-mặc-định)
- [Bảo mật](#bảo-mật)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

## 🎯 Tổng quan

Laptop Shop là một nền tảng thương mại điện tử toàn diện được xây dựng với Spring Boot 3.4.3 và Java 21. Nó cung cấp trải nghiệm mua sắm hoàn chỉnh cho khách hàng và một bảng quản trị mạnh mẽ để quản lý cửa hàng. Ứng dụng theo kiến trúc MVC truyền thống với giao diện JSP và bao gồm các tính năng như quản lý sản phẩm, giỏ hàng, xử lý đơn hàng và xác thực người dùng.

## ✨ Tính năng

### Tính năng cho khách hàng
- **Xác thực người dùng**: Đăng ký và đăng nhập với email/mật khẩu
- **Duyệt sản phẩm**: Xem tất cả sản phẩm với phân trang và bộ lọc
- **Tìm kiếm sản phẩm**: Lọc sản phẩm theo nhà sản xuất, đối tượng mục tiêu và phạm vi giá
- **Chi tiết sản phẩm**: Xem chi tiết từng sản phẩm
- **Giỏ hàng**: Thêm, cập nhật và xóa mục trong giỏ hàng
- **Đặt hàng**: Quy trình thanh toán hoàn chỉnh với thông tin giao hàng
- **Lịch sử đơn hàng**: Xem các đơn hàng trước đó và trạng thái của chúng
- **Hồ sơ người dùng**: Quản lý thông tin cá nhân và avatar

### Tính năng cho quản trị viên
- **Dashboard**: Tổng quan thống kê cửa hàng
- **Quản lý sản phẩm**: Tạo, đọc, cập nhật và xóa sản phẩm
- **Quản lý người dùng**: Quản lý tài khoản người dùng và vai trò
- **Quản lý đơn hàng**: Xem, cập nhật trạng thái và quản lý đơn hàng
- **Tải lên hình ảnh**: Tải lên hình ảnh sản phẩm và avatar người dùng

### Tính năng kỹ thuật
- **Kiểm soát truy cập dựa trên vai trò**: Giao diện riêng biệt cho quản trị viên và người dùng thường
- **Quản lý phiên làm việc**: Lưu trữ phiên dựa trên JDBC với thời gian chờ 30 phút
- **Tải lên tệp**: Hỗ trợ tải lên hình ảnh (tối đa 50MB)
- **Xác thực dữ liệu**: Xác thực biểu mẫu với các trình xác thực tùy chỉnh
- **Bảo mật mật khẩu**: Mã hóa BCrypt với yêu cầu mật khẩu mạnh
- **Thiết kế phản hồi**: Giao diện thân thiện với thiết bị di động

## 🛠 Công nghệ sử dụng

### Backend
- **Java 21**: Ngôn ngữ lập trình
- **Spring Boot 3.4.3**: Framework ứng dụng
- **Spring Data JPA**: ORM cơ sở dữ liệu với Hibernate
- **Spring Security**: Xác thực và ủy quyền
- **Spring Session JDBC**: Quản lý phiên làm việc
- **Spring Validation**: Xác thực biểu mẫu
- **MySQL 8.0**: Cơ sở dữ liệu
- **Maven**: Công cụ xây dựng

### Frontend
- **JSP (JavaServer Pages)**: Công nghệ giao diện
- **JSTL (JSP Standard Tag Library)**: Thư viện thẻ cho JSP
- **Bootstrap**: Framework CSS (được suy ra từ cấu trúc)
- **Custom CSS/JS**: Tùy chỉnh kiểu và chức năng

### DevOps
- **Docker**: Container hóa
- **Docker Compose**: Điều phối đa container

## 📁 Cấu trúc dự án

```
laptopshop/
├── src/
│   ├── main/
│   │   ├── java/vn/vuhoang/laptopshop/
│   │   │   ├── config/              # Các lớp cấu hình
│   │   │   │   ├── CustomSuccessHandler.java
│   │   │   │   ├── SecurityConfiguration.java
│   │   │   │   └── WebMvcConfig.java
│   │   │   ├── controller/         # MVC Controllers
│   │   │   │   ├── admin/          # Controllers quản trị
│   │   │   │   │   ├── DashboardController.java
│   │   │   │   │   ├── OrderController.java
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   └── UserController.java
│   │   │   │   └── client/         # Controllers khách hàng
│   │   │   │       ├── HomePageController.java
│   │   │   │       └── ItemController.java
│   │   │   ├── domain/             # Các lớp Entity
│   │   │   │   ├── Cart.java
│   │   │   │   ├── CartDetail.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderDetail.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── Role.java
│   │   │   │   ├── User.java
│   │   │   │   └── dto/            # Data Transfer Objects
│   │   │   ├── repository/         # JPA Repositories
│   │   │   ├── service/            # Logic nghiệp vụ
│   │   │   │   ├── validator/      # Trình xác thực tùy chỉnh
│   │   │   │   └── specification/  # JPA Specifications
│   │   │   └── LaptopshopApplication.java
│   │   ├── resources/
│   │   │   ├── application.properties
│   │   │   └── data.sql            # Dữ liệu ban đầu
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   └── view/           # JSP views
│   │       │       ├── admin/      # Views quản trị
│   │       │       └── client/     # Views khách hàng
│   │       └── resources/          # Tài nguyên tĩnh
│   │           ├── css/
│   │           ├── js/
│   │           ├── images/
│   │           └── client/
│   └── test/
├── Dockerfile
├── docker-compose.yml
├── pom.xml
└── README.md
```

## 🗄 Cơ sở dữ liệu

### Các bảng

**users** (Người dùng)
- `id` (Long, Khóa chính, Tự tăng)
- `email` (String, Duy nhất, Bắt buộc)
- `password` (String, Bắt buộc, Tối thiểu 2 ký tự)
- `full_name` (String, Bắt buộc, Tối thiểu 3 ký tự)
- `address` (String)
- `phone` (String)
- `avatar` (String)
- `role_id` (Long, Khóa ngoại đến roles)

**roles** (Vai trò)
- `id` (Long, Khóa chính, Tự tăng)
- `name` (String, Bắt buộc)
- `description` (String)

**products** (Sản phẩm)
- `id` (Long, Khóa chính, Tự tăng)
- `name` (String, Bắt buộc)
- `price` (Double, Bắt buộc, > 0)
- `image` (String, Bắt buộc)
- `detail_desc` (String, Bắt buộc, MEDIUMTEXT)
- `short_desc` (String, Bắt buộc)
- `quantity` (Long)
- `sold` (Long)
- `factory` (String)
- `target` (String)

**carts** (Giỏ hàng)
- `id` (Long, Khóa chính, Tự tăng)
- `user_id` (Long, Khóa ngoại đến users)
- `sum` (Integer)

**cart_details** (Chi tiết giỏ hàng)
- `id` (Long, Khóa chính, Tự tăng)
- `cart_id` (Long, Khóa ngoại đến carts)
- `product_id` (Long, Khóa ngoại đến products)
- `quantity` (Integer)
- `price` (Double)

**orders** (Đơn hàng)
- `id` (Long, Khóa chính, Tự tăng)
- `user_id` (Long, Khóa ngoại đến users)
- `total_price` (Double)
- `receiver_name` (String)
- `receiver_address` (String)
- `receiver_phone` (String)
- `status` (String)

**order_details** (Chi tiết đơn hàng)
- `id` (Long, Khóa chính, Tự tăng)
- `order_id` (Long, Khóa ngoại đến orders)
- `product_id` (Long, Khóa ngoại đến products)
- `quantity` (Long)
- `price` (Double)

## 📦 Yêu cầu hệ thống

Trước khi chạy ứng dụng này, hãy đảm bảo bạn đã cài đặt các phần sau:

- **Java 21** hoặc cao hơn
- **Maven 3.6+** hoặc cao hơn
- **MySQL 8.0** hoặc cao hơn (nếu không sử dụng Docker)
- **Docker & Docker Compose** (để triển khai container)

## 🔧 Cài đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd laptopshop
```

### 2. Cấu hình Cơ sở dữ liệu

#### Tùy chọn A: Sử dụng MySQL trực tiếp

Tạo cơ sở dữ liệu MySQL:

```sql
CREATE DATABASE laptopshop;
```

Cập nhật `src/main/resources/application.properties` với thông tin đăng nhập cơ sở dữ liệu của bạn:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/laptopshop
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### Tùy chọn B: Sử dụng Docker Compose (Khuyên dùng)

Ứng dụng bao gồm tệp `docker-compose.yml` để thiết lập dễ dàng. Xem phần [Triển khai Docker](#triển-khai-docker).

### 3. Xây dựng dự án

```bash
./mvnw clean install
```

Hoặc sử dụng Maven trực tiếp:

```bash
mvn clean install
```

## ⚙️ Cấu hình

### Thuộc tính ứng dụng

Các tùy chọn cấu hình chính trong `src/main/resources/application.properties`:

```properties
# Cấu hình cơ sở dữ liệu
spring.datasource.url=jdbc:mysql://${MYSQL_HOST:localhost}:3306/laptopshop
spring.datasource.username=root
spring.datasource.password=hoang0712

# Cấu hình JPA
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode=always

# Tải lên tệp
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# Quản lý phiên làm việc
spring.session.store-type=jdbc
spring.session.timeout=30m
spring.session.jdbc.initialize-schema=always

# Cấu hình Cookie (cho Docker)
server.servlet.session.cookie.name=MY_SESSION
server.servlet.session.cookie.domain=localhost
server.servlet.session.cookie.secure=false
server.servlet.session.cookie.same-site=lax

# Ghi log
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.session=DEBUG
```

### Biến môi trường

Khi sử dụng Docker, bạn có thể ghi đè cấu hình bằng các biến môi trường:

- `MYSQL_HOST`: Địa chỉ host MySQL
- `SPRING_DATASOURCE_URL`: URL JDBC đầy đủ
- `SPRING_DATASOURCE_USERNAME`: Tên đăng nhập cơ sở dữ liệu
- `SPRING_DATASOURCE_PASSWORD`: Mật khẩu cơ sở dữ liệu
- `SPRING_SESSION_JDBC_INITIALIZE_SCHEMA`: Khởi tạo schema phiên làm việc
- `SPRING_SESSION_TIMEOUT`: Thời gian chờ phiên làm việc

## 🚀 Chạy ứng dụng

### Phát triển cục bộ

1. Khởi động cơ sở dữ liệu MySQL (nếu không sử dụng Docker)
2. Chạy ứng dụng:

```bash
./mvnw spring-boot:run
```

Hoặc sử dụng Maven:

```bash
mvn spring-boot:run
```

3. Truy cập ứng dụng tại `http://localhost:8080`

### Sử dụng tệp JAR

1. Xây dựng tệp JAR:

```bash
./mvnw clean package
```

2. Chạy tệp JAR:

```bash
java -jar target/laptopshop-0.0.1-SNAPSHOT.jar
```

## 🐳 Triển khai Docker

### Sử dụng Docker Compose (Khuyên dùng)

1. Xây dựng và khởi động tất cả dịch vụ:

```bash
docker-compose up --build
```

2. Truy cập ứng dụng tại `http://localhost:8080`

3. Để dừng dịch vụ:

```bash
docker-compose down
```

### Sử dụng Docker thủ công

1. Xây dựng Docker image:

```bash
docker build -t laptopshop .
```

2. Chạy container:

```bash
docker run -p 8080:8080 \
  -e MYSQL_HOST=mysql \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/laptopshop \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=hoang0712 \
  laptopshop
```

## 🌐 API Endpoints

### Endpoints công khai

| Phương thức | Endpoint | Mô tả |
|--------|----------|-------------|
| GET | `/` | Trang chủ |
| GET | `/login` | Trang đăng nhập |
| GET | `/register` | Trang đăng ký |
| POST | `/register` | Đăng ký người dùng mới |
| GET | `/product/{id}` | Trang chi tiết sản phẩm |
| GET | `/products` | Danh sách sản phẩm với bộ lọc |
| GET | `/deny` | Trang truy cập bị từ chối |

### Endpoints khách hàng (Cần xác thực)

| Phương thức | Endpoint | Mô tả |
|--------|----------|-------------|
| GET | `/cart` | Trang giỏ hàng |
| POST | `/add-product-to-cart/{id}` | Thêm sản phẩm vào giỏ hàng |
| POST | `/add-product-form-view-detail` | Thêm sản phẩm từ trang chi tiết |
| POST | `/delete-cart-product/{id}` | Xóa mục khỏi giỏ hàng |
| POST | `/confirm-checkout` | Xác nhận thanh toán |
| POST | `/place-order` | Đặt hàng |
| GET | `/checkout` | Trang thanh toán |
| GET | `/thanks` | Trang xác nhận đơn hàng |
| GET | `/order-history` | Xem lịch sử đơn hàng |

### Endpoints quản trị viên (Yêu cầu vai trò ADMIN)

| Phương thức | Endpoint | Mô tả |
|--------|----------|-------------|
| GET | `/admin` | Dashboard quản trị |
| GET | `/admin/product` | Danh sách sản phẩm |
| GET | `/admin/product/create` | Form tạo sản phẩm |
| POST | `/admin/product/create` | Tạo sản phẩm |
| GET | `/admin/product/update/{id}` | Form cập nhật sản phẩm |
| POST | `/admin/product/update` | Cập nhật sản phẩm |
| GET | `/admin/product/delete/{id}` | Xác nhận xóa sản phẩm |
| POST | `/admin/product/delete` | Xóa sản phẩm |
| GET | `/admin/product/view/{id}` | Xem chi tiết sản phẩm |
| GET | `/admin/user` | Danh sách người dùng |
| GET | `/admin/user/create` | Form tạo người dùng |
| POST | `/admin/user/create` | Tạo người dùng |
| GET | `/admin/user/update/{id}` | Form cập nhật người dùng |
| POST | `/admin/user/update` | Cập nhật người dùng |
| GET | `/admin/user/delete/{id}` | Xác nhận xóa người dùng |
| POST | `/admin/user/delete` | Xóa người dùng |
| GET | `/admin/user/view/{id}` | Xem chi tiết người dùng |
| GET | `/admin/order` | Danh sách đơn hàng |
| GET | `/admin/order/view/{id}` | Xem chi tiết đơn hàng |
| GET | `/admin/order/update/{id}` | Form cập nhật đơn hàng |
| POST | `/admin/order/update` | Cập nhật trạng thái đơn hàng |
| GET | `/admin/order/delete/{id}` | Xác nhận xóa đơn hàng |
| POST | `/admin/order/delete` | Xóa đơn hàng |

## 👥 Người dùng mặc định

Ứng dụng đi kèm với người dùng được cấu hình sẵn (từ `data.sql`):

### Người dùng quản trị
- **Email**: `vuhoang5053@gmail.com`
- **Mật khẩu**: (đã mã hóa trong cơ sở dữ liệu)
- **Vai trò**: ADMIN
- **Họ tên**: Vũ Đình Hoàng

### Người dùng thường
- **Email**: `23001881@hus.edu.vn`
- **Mật khẩu**: (đã mã hóa trong cơ sở dữ liệu)
- **Vai trò**: USER
- **Họ tên**: Hoàng Vũ

- **Email**: `user@gmail.com`
- **Mật khẩu**: (đã mã hóa trong cơ sở dữ liệu)
- **Vai trò**: USER
- **Họ tên**: Hoang Vu

**Lưu ý**: Bạn nên thay đổi các mật khẩu mặc định này trong môi trường sản xuất hoặc tạo người dùng mới thông qua trang đăng ký.

## 🔒 Bảo mật

### Xác thực & Ủy quyền
- **Spring Security** xử lý xác thực và ủy quyền
- **BCrypt** mã hóa băm mật khẩu
- **Kiểm soát truy cập dựa trên vai trò**: Vai trò ADMIN và USER
- **Quản lý phiên làm việc** với backend JDBC
- **Trình xử lý thành công đăng nhập tùy chỉnh** cho chuyển hướng dựa trên vai trò

### Yêu cầu mật khẩu
- Tối thiểu 2 ký tự (yêu cầu cơ bản)
- Xác thực mật khẩu mạnh có sẵn (trình xác thực tùy chỉnh)

### Cấu hình phiên làm việc
- Thời gian chờ phiên: 30 phút
- Số phiên tối đa cho mỗi người dùng: 1
- Phiên làm việc được lưu trữ trong cơ sở dữ liệu (JDBC)
- Chức năng nhớ tôi được bật

### Bảo mật tải lên tệp
- Kích thước tệp tối đa: 50MB
- Xác thực tải lên tệp
- Lưu trữ hình ảnh trong thư mục `resources/images/`

## 👨‍💻 Tác giả

**Vũ Đình Hoàng**
- Email: vuhoang5053@gmail.com


**Lưu ý**: Đây là một dự án trình diễn. Để sử dụng trong môi trường sản xuất, vui lòng đảm bảo:
- Thay đổi mật khẩu mặc định
- Cấu hình SSL/HTTPS phù hợp
- Thiết lập chiến lược sao lưu phù hợp
- Cấu hình cài đặt cơ sở dữ liệu cấp sản xuất
- Triển khai ghi log và giám sát phù hợp
- Thêm xử lý lỗi toàn diện
- Thực hiện kiểm tra bảo mật
- Thiết lập pipeline CI/CD
