
# Hướng Dẫn Cấu Hình và Chạy Unit Test trong Laravel với MySQL

## 1. Sửa phpunit.xml để sử dụng MySQL thay vì SQLite
- Mở file **phpunit.xml**  
- Thay đổi cấu hình kết nối cơ sở dữ liệu từ SQLite sang MySQL:  
  ```xml
  <php>
      <env name="DB_CONNECTION" value="mysql"/>
      <env name="DB_DATABASE" value="ecommerce_test"/>
      <env name="DB_USERNAME" value="root"/>
      <env name="DB_PASSWORD" value=""/>
  </php>
  ```

## 2. Tạo database cho testing
```bash
mysql -u root -p -e "CREATE DATABASE ecommerce_test;"
```
Hoặc tự tạo qua UI
## 3. Tạo file `.env.testing`
Tạo file `.env.testing` tại thư mục gốc của dự án với nội dung:  
```dotenv
APP_ENV=testing
APP_DEBUG=true
DB_CONNECTION=mysql
DB_DATABASE=ecommerce_test
DB_USERNAME=root
DB_PASSWORD=
```

## 4. Chạy migrate với môi trường testing
```bash
php artisan migrate:fresh --env=testing
```

## 5. Chạy test cho Model
```bash
php artisan test tests/Unit/Models/ProductTest.php
```

## 6. Sửa lại `products` theo Service & Repository Pattern

### 6.1 Tạo `ProductService` và `ProductRepository`
```bash
php artisan make:service ProductService
php artisan make:repository ProductRepository
```

### 6.2 Chuyển logic từ `ProductController` sang `ProductService`
- Loại bỏ xử lý nghiệp vụ trong `ProductController`
- Gọi các method từ `ProductService` thay cho trực tiếp xử lý trong controller

### 6.3 Sử dụng `ProductRepository` trong `ProductService`
- `ProductService` gọi các method từ `ProductRepository` để thao tác dữ liệu

## 7. Chạy test cho ProductService
```bash
php artisan test tests/Unit/Services/ProductServiceTest.php
```

## 8. Chạy test cho Controller
```bash
php artisan test tests/Unit/Http/Controllers/Admin/ProductControllerTest.php
```

## 9. Chạy test cho Repository
```bash
php artisan test tests/Unit/Repositories/ProductRepositoryTest.php
```

## 10. Chạy tất cả Unit Test
```bash
php artisan test tests/Unit/
```

## 11. Xem độ phủ của Unit Test (Test Coverage)
```bash
php artisan test --coverage-html=coverage
```

## 12. Mở báo cáo coverage
```bash
xdg-open coverage/index.html
```

## 13. Cấu trúc thư mục mẫu (Service & Repository Pattern)
```
app/
├── Http/
│   └── Controllers/
│       └── Admin/
│           └── ProductController.php
├── Services/
│   └── ProductService.php
└── Repositories/
    └── ProductRepository.php

tests/
└── Unit/
    ├── Models/
    │   └── ProductTest.php
    ├── Services/
    │   └── ProductServiceTest.php
    ├── Http/
    │   └── Controllers/
    │       └── Admin/
    │           └── ProductControllerTest.php
    └── Repositories/
        └── ProductRepositoryTest.php
```
