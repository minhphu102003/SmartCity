/*
  File ecosystem.config.js thường được sử dụng trong các dự án Node.js
  để cấu hình và quản lý các ứng dụng với PM2, một trình quản lý tiến
  trình dành cho Node.js. PM2 giúp bạn dễ dàng khởi động, dừng, giám sát
  và quản lý các ứng dụng Node.js của mình.
*/ 

module.exports = {
    apps: [
      {
        name: "smart-city-app", //Tên của ứng dụng
        script: "./src/index.js",//Đường dẫn tới file khởi động của ứng dụng.
        instances: "max", // Số lượng instances mà PM2 sẽ khởi chạy (ở đây là max, nghĩa là PM2 sẽ khởi chạy số lượng instances bằng với số lượng CPU có sẵn).
        exec_mode: "cluster",  // Chế độ thực thi (ở đây là cluster, nghĩa là PM2 sẽ chạy ứng dụng ở chế độ cluster).
        watch: true, //PM2 sẽ theo dõi các thay đổi trong thư mục ứng dụng và tự động khởi động lại nếu có thay đổi.
        env: { // Các biến môi trường cho môi trường development.
          NODE_ENV: "development",
          PORT: 8000,
          MONGODB_URI: "mongodb://localhost/smartcity"
        },
        env_production: { // Các biến môi trường cho môi trường production.
          NODE_ENV: "production",
          PORT: 8080,
          MONGODB_URI: "mongodb://localhost/smartcity"
        }
      }
    ]
  };