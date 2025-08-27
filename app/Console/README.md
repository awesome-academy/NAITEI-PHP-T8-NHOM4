# Hướng dẫn sử dụng Laravel Schedule & Cron Job

## Tổng quan
Laravel Schedule cho phép lập lịch chạy các lệnh artisan, jobs, và callbacks một cách tự động.

## Cách sử dụng

### 1. Test Command thủ công

Trước khi thiết lập schedule, hãy test command để đảm bảo hoạt động đúng:

```bash
# Test với daily-revenue
php artisan report:daily-revenue

# Test với ngày cụ thể
php artisan report:daily-revenue --date=2025-08-25
```

### 2. Kiểm tra lịch Schedule

```bash
# Xem danh sách tất cả các scheduled commands
php artisan schedule:list

# Kiểm tra các schedule sẽ chạy trong khoảng thời gian
php artisan schedule:list --next

# Test schedule (chạy thử mà không thực thi thật)
php artisan schedule:test
```

### 3. Chạy Schedule thủ công

```bash
# Chạy tất cả scheduled commands ngay lập tức
php artisan schedule:run

# Chạy với verbose mode để xem chi tiết
php artisan schedule:run --verbose

# Chạy schedule trong background
php artisan schedule:run > /dev/null 2>&1 &
```

## Cấu hình Schedule cho Production

### Phương pháp 1: Laravel Schedule Worker (Khuyên dùng cho Laravel 11+)

Laravel Schedule Worker giúp chạy schedule liên tục mà không cần cron job:

```bash
# Chạy schedule worker trong background
nohup php artisan schedule:work > storage/logs/scheduler.log 2>&1 &

# Sử dụng screen để quản lý process
screen -S laravel-scheduler
php artisan schedule:work
# Nhấn Ctrl+A+D để detach khỏi screen

# Sử dụng tmux
tmux new-session -d -s scheduler 'php artisan schedule:work'

# Kiểm tra process đang chạy
ps aux | grep "schedule:work"
```

### Phương pháp 2: Cron Job truyền thống

Thêm cron job vào hệ thống để chạy Laravel scheduler:

```bash
# Mở crontab editor
crontab -e

# Thêm dòng sau vào crontab (thay đổi đường dẫn cho phù hợp)
* * * * * cd /home/nkduyen/Projects/NAITEI-PHP-T8-NHOM4 && php artisan schedule:run >> storage/logs/scheduler.log 2>&1

# Hoặc sử dụng full path của PHP
* * * * * cd /home/nkduyen/Projects/NAITEI-PHP-T8-NHOM4 && /usr/bin/php artisan schedule:run >> storage/logs/scheduler.log 2>&1
```
Sau khi thêm path và lưu vào file crontab thì cronjob sẽ tự động chạy ngầm khi máy tính hoạt động, cần sử dụng các lệnh dưới đây nếu muốn bật/dừng hoạt động hoặc enable/disable cronjob không chạy ngầm khi bật máy thì dùng các lệnh:

```bash
# Chạy cron service
sudo service cron start

# Dừng cron service  
sudo service cron stop

# Restart cron service
sudo service cron restart

# Check cron status
sudo service cron status

# Enable cron at boot (Enable chạy cùng khi khởi động máy)
sudo systemctl enable cron

# Disable cron at boot (Disable khi khởi động máy)
sudo systemctl disable cron
```

## Cấu hình Email

Đảm bảo file `.env` có cấu hình mail đúng:

```env
# Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD="your-app-password"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Cấu hình Gmail App Password

1. Bật 2-Factor Authentication cho Gmail
2. Tạo App Password: Google Account → Security → 2-Step Verification → App Passwords
   Nếu không tìm thấy App Passwords thì truy cập thẳng đường link: https://myaccount.google.com/apppasswords
3. Tạo 1 app mới có tên tùy chỉnh VD: Laravel App
4. Lấy password và đưa vào phần `MAIL_PASSWORD="your-app-password"`
