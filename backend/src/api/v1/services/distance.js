import AccountReport from "../models/accountReport.js";
import RoadSegment from "../models/roadSegment.js";

export const calculateDistance = (lat1, lon1, lat2, lon2) =>{
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI)/ 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
    Math.cos((lat1 * Math.PI)/180) * 
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon/2) *
    Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

export const updateReportsWithRoadSegments = async () => {
  try {
    const reports = await AccountReport.find({ roadSegment_id: null });
    for (const report of reports) {
      const { coordinates } = report.location;
      // Tìm đoạn đường gần nhất với báo cáo
      const nearestRoadSegment = await RoadSegment.findOne({
        roadSegmentLine: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: coordinates,
            },
            $maxDistance: 20, // Giới hạn khoảng cách: 20m
          },
        },
      });

      // Nếu tìm thấy đoạn đường, cập nhật roadSegment_id
      if (nearestRoadSegment) {
        report.roadSegment_id = nearestRoadSegment._id;
        await report.save(); // Lưu báo cáo sau khi cập nhật
      }
    }

    console.log("Hoàn tất cập nhật roadSegment_id cho các báo cáo gần đoạn đường.");
  } catch (error) {
    console.error("Lỗi khi cập nhật roadSegment_id:", error.message);
  }
};
