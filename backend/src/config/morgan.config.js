// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import morgan from 'morgan';

// // Get the directory path of the current module file
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // Đường dẫn tới thư mục logs từ thư mục gốc của dự án
// const logsDirectory = path.join(__dirname, '..', 'api', 'v1', 'logs');

// // Tạo một stream để ghi log vào file
// const logStream = fs.createWriteStream(path.join(logsDirectory, 'access.log'), { flags: 'a' });

// // Cấu hình morgan
// const morganMiddleware = morgan('combined', { stream: logStream });

// export default morganMiddleware;

import morgan from 'morgan';

// Cấu hình morgan để ghi logs vào console (stdout)
const morganMiddleware = morgan('combined', { stream: process.stdout });

export default morganMiddleware;