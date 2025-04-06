import fs from 'fs'; // Use ES module imports
import { Kafka } from 'kafkajs'; // Import Kafka from kafkajs
import CameraReport from './api/v1/models/cameraReport.js';
import User from "./api/v1/models/user.js";
import Notification from "./api/v1/models/notification.js";
import {NotificationStatus} from "./api/shared/constants/notification.js";
import {calculateDistance} from "./api/v1/services/distance.js";
import {config} from "dotenv";
import notification from './api/shared/models/notification.js';
config();


const buildNotificationMessage = (type, typeReport, description, timestamp, latitude, longitude, img) => {
  const reportTypeMap = {
    'TRAFFIC_JAM': 'Traffic Jam',
    'FLOOD': 'Flood',
    'ACCIDENT': 'Accident',
    'ROADWORK': 'Road Work',
  };

  const typeDescription = reportTypeMap[typeReport] || 'Unknown';

  const baseMessage = {
    title: `${typeDescription} notification`,
    content: `${typeDescription} reported near you: ${description}`,
    typeReport: typeReport,
    status: 'PENDING',
    isRead: false,
    timestamp,
    distance: '',
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
      mechanism: 'plain',
      username: process.env.sasl_username, 
      password: process.env.sasl_password,
    },
  });

  const producer = kafka.producer();
  await producer.connect();

  const message = JSON.stringify({ type, ...messageObject });
  await producer.send({
    topic,
    messages: [{ value: message }],
  });

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
        
        const { type, latitude, camera_id, longitude, account_id, typeReport, trafficVolume, timestamp, congestionLevel, img, description } = data;

        if (type === "camera report") {
          const report = new CameraReport({ camera_id, trafficVolume, congestionLevel, typeReport, img, timestamp });
          await report.save();
          const notificationMessage = buildNotificationMessage(type, typeReport, description, timestamp, latitude, longitude, img);
          sendMessageToFrontend(notificationMessage);
        } else if (type === "user report") {
          const notificationMessage = buildNotificationMessage(type, typeReport, description, timestamp, latitude, longitude, img);
          sendMessageToFrontend(notificationMessage);

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
        } else if (type === "create notification"){
          const { type, ...notification} = data;
          notification.typeReport = 'create notification';
          sendMessageToFrontend(notification);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
};


export { produceMessage, consumeMessages, readConfig };
