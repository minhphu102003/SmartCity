import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

// Đường dẫn tới thư mục logs từ thư mục gốc của dự án
const logsDirectory = path.join(__dirname, '..', 'api', 'v1', 'logs');

// Tạo một stream để ghi log vào file
const logStream = fs.createWriteStream(path.join(logsDirectory, 'access.log'), { flags: 'a' });

// Cấu hình morgan
const morganMiddleware = morgan('combined', { stream: logStream });

export default morganMiddleware;
