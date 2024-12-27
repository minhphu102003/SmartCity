import path from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn của file hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn lưu trữ ảnh
export const UPLOAD_DIRECTORY = path.join(__dirname, '../../../../uploads/'); 
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // Giới hạn kích thước 2MB
export const MAX_FILE_COUNT = 10; // Số lượng file tối đa