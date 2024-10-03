import SearchHistory from "../models/searchHistory.js";


export const getListHistory = async (req, res, next) => {
    try {
        const limit = Math.max(1, parseInt(req.query.limit)) || 10; // Số mục tối thiểu là 1, mặc định là 10
        const page = Math.max(1, parseInt(req.query.page)) || 1; // Trang tối thiểu là 1, mặc định là 1
        const userId = req.userId; // Lấy userId từ token hoặc request

        // Tìm kiếm lịch sử theo userId
        const histories = await SearchHistory.find({ user_id: userId })
            .sort({ createdAt: -1 }) // Sắp xếp theo ngày mới nhất
            .skip((page - 1) * limit) // Bỏ qua các mục của các trang trước
            .limit(limit); // Giới hạn số mục trên mỗi trang

        const totalItems = await SearchHistory.countDocuments({ user_id: userId }); // Đếm tổng số mục

        return res.status(200).json({
            success: true,
            data: histories,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                totalItems,
                limit
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const createHistory = async (req, res, next) => {
    try {
        const userId = req.userId; // Lấy userId từ token hoặc request
        const { search_query } = req.body; // Lấy search_query từ body
        
        const newHistory = new SearchHistory({
            user_id: userId,
            search_query,
        });

        await newHistory.save(); // Lưu vào database

        res.status(201).json({
            success: true,
            data: newHistory,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteHistory = async (req, res, next) => {
    try {
        const userId = req.userId; // userId lấy từ token xác thực
        const { Id, timeRange } = req.query;

        // Xóa một mục lịch sử
        if (Id) {
            await SearchHistory.findOneAndDelete({ _id: Id, user_id: userId });
            return res.status(200).json({ success: true, message: "History deleted successfully" });
        }

        // Xóa theo thời gian (tính từ hiện tại)
        let dateThreshold;
        const now = new Date();

        switch (timeRange) {
            case '30m': // 30 minutes
                dateThreshold = new Date(now - 30 * 60 * 1000);
                break;
            case '1h': // 1 hour
                dateThreshold = new Date(now - 60 * 60 * 1000);
                break;
            case '8h': // 8 hours
                dateThreshold = new Date(now - 8 * 60 * 60 * 1000);
                break;
            case '12h': // 12 hours
                dateThreshold = new Date(now - 12 * 60 * 60 * 1000);
                break;
            case 'all': // Xóa tất cả
                await SearchHistory.deleteMany({ user_id: userId });
                return res.status(200).json({ success: true, message: "All history deleted successfully" });
            default:
                return res.status(400).json({ success: false, message: "Invalid time range" });
        }

        // Xóa theo khoảng thời gian đã chọn
        await SearchHistory.deleteMany({ user_id: userId, createdAt: { $gte: dateThreshold } });

        res.status(200).json({ success: true, message: `History deleted successfully for time range: ${timeRange}` });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
