import fs from 'fs'; // Use ES module imports
import { Kafka } from 'kafkajs'; // Import Kafka from kafkajs
import CameraReport from './api/v1/models/cameraReport.js';
import User from "./api/v1/models/user.js";
import Notification from "./api/v1/models/notification.js";
import {NotificationStatus} from "./api/shared/constants/notification.js";
import {calculateDistance} from "./api/v1/services/distance.js";
import {config} from "dotenv";
config();


const buildNotificationMessage = (type, typeReport, description, timestamp, latitude, longitude, img) => {
  // Định nghĩa bản đồ ánh xạ từ typeReport
  const reportTypeMap = {
    'TRAFFIC_JAM': 'Traffic Jam',
    'FLOOD': 'Flood',
    'ACCIDENT': 'Accident',
    'ROADWORK': 'Road Work',
  };

  // Chuyển đổi typeReport thành dạng thân thiện với người dùng
  const typeDescription = reportTypeMap[typeReport] || 'Unknown';

  const baseMessage = {
    title: `${typeDescription} notification`,
    content: `${typeDescription} reported near you: ${description}`,
    typeReport: typeReport,
    status: 'PENDING', // Default to 'read' or handle as per your logic
    isRead: false, // If the notification is read or not
    timestamp,
    distance: '', // Leave this empty for frontend to calculate
    longitude,
    latitude,
    img
  };

  return baseMessage;
};


function readConfig(fileName) {
  const data = fs.readFileSync(fileName, "utf8").toString().split("\n");
  return data.reduce((config, line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      config[key] = value;
    }
    return config;
  }, {});
}

const produceMessage = async (topic, messageObject, type) => {
  const kafka = new Kafka({
    brokers: [process.env.bootstrap_servers],
    ssl: true,
    sasl: {
      mechanism: 'plain', // Phương thức xác thực
      username: process.env.sasl_username, // Thay bằng username của bạn
      password: process.env.sasl_password, // Thay bằng password của bạn
    },
  });

  const producer = kafka.producer();
  await producer.connect();

  const message = JSON.stringify({ type, ...messageObject }); // Thêm `type` vào message
  await producer.send({
    topic,
    messages: [{ value: message }],
  });

  console.log(`Produced message to topic ${topic}: ${message}`);
  await producer.disconnect();
};


const consumeMessages = async (topic, sendMessageToFrontend) => {
  const kafka = new Kafka({
    brokers: [process.env.bootstrap_servers],
    ssl: true,
    sasl: {
      mechanism: 'plain', 
      username: process.env.sasl_username, 
      password: process.env.sasl_password,
    },
  });
  const consumer = kafka.consumer({ groupId: 'express-group1' });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        console.log(`Consumed message from topic ${topic}:`, data);

        const { type, latitude, camera_id, longitude, account_id, typeReport, trafficVolume, timestamp, congestionLevel, img, description } = data;

        const notificationMessage = buildNotificationMessage(type, typeReport, description, timestamp, latitude, longitude, img);
        sendMessageToFrontend(notificationMessage);

        if (type === "camera report") {
          const report = new CameraReport({ camera_id, trafficVolume, congestionLevel, typeReport, img, timestamp });
          await report.save();
        } else if (type === "user report") {
          const reportTypeMap = {
            'TRAFFIC_JAM': 'Traffic Jam',
            'FLOOD': 'Flood',
            'ACCIDENT': 'Accident',
            'ROADWORK': 'Road Work',
          };
        
          const typeDescription = reportTypeMap[typeReport] || 'Unknown';
          const allUsers = await User.find({ latitude: { $exists: true }, longitude: { $exists: true } });
          const usersInRange = allUsers.filter((user) => calculateDistance(latitude, longitude, user.latitude, user.longitude) <= 10);
          for (const user of usersInRange) {
            if(user.account_id){
              const notification = new Notification({
                account_id: user.account_id,
                message: `${typeDescription} reported near you: ${description}`,
                longitude,
                latitude,
                img,
                status: NotificationStatus.PENDING,
              });
              await notification.save();
            }
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
};


export { produceMessage, consumeMessages, readConfig };
