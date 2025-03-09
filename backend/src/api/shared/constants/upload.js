import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOAD_DIRECTORY = path.join(__dirname, '../../../../uploads/'); 
export const MAX_FILE_SIZE = 5 * 1024 * 1024; 
export const MAX_FILE_COUNT = 10; 