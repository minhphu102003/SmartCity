import Camera from "../models/camera.js";


export const getListCamera = async (req, res , next) => {
    try {
        // Lấy giá trị limit và page từ query
        const limit = parseInt(req.query.limit) || 10; // Giá trị mặc định là 10
        const page = parseInt(req.query.page) || 1; // Giá trị mặc định là 1

        // Tính toán số lượng camera cần bỏ qua
        const skip = (page - 1) * limit;

        // Lấy danh sách camera với limit và skip
        const cameras = await Camera.find().skip(skip).limit(limit).exec();

        // Lấy tổng số lượng camera để tính tổng trang
        const totalCameras = await Camera.countDocuments();

        // Tính tổng số trang
        const totalPages = Math.ceil(totalCameras / limit);

        // Trả về dữ liệu
        res.status(200).json({
            success: true,
            totalCameras,
            totalPages,
            currentPage: page,
            cameras,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách camera.",
        });
    }
};

export const createCamera = async (req, res , next) => {
    try{
        const {longitude, latitude, status = true} = req.body;
        const newCamera = new Camera({
            longitude,
            latitude,
            status
        });

        const savedCamera = await newCamera.save();
        
        return res.status(200).json({
            success: true,
            message: "Camera đã được tạo thành công",
            data: savedCamera
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

export const updateCamera  = async (req, res , next) => {
    try{
        const {cameraId} = req.params;
        const {longitude, latitude, status} = req.body;

        const findCamera = await Camera.findById(cameraId);
        if( !findCamera){
            return res.status(404).json({
                success: false,
                message: "Camera không tồn tại"
            });
        }
        
        if (longitude !== undefined) findCamera.longitude = longitude;
        if (latitude !== undefined) findCamera.latitude = latitude;
        if (status !== undefined) findCamera.status = status;

        const updateCamera = await findCamera.save();

        return res.status(200).json({
            success: true,
            message : "Cập nhật camera thành công",
            data: updateCamera
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const deleteCamera = async (req, res, next) => {
    try{
        const {cameraId} = req.params;
        
        const findCamera = await Camera.findById(cameraId);

        if(!findCamera){
            return res.status(404).json({
                success: false,
                message: "Camera không tồn tại"
            });
        }

        await Camera.findByIdAndDelete(cameraId);

        return res.status(200).json({
            success: true,
            message: "Camera đã được xóa thành công",
            data: findCamera
        });


    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

