import { Kafka } from "kafkajs";
import CameraReport from '../models/cameraReport.js';
import User from "../models/user.js";
import Notification from "../models/notification.js";
import {NotificationStatus} from "../../shared/constants/index.js";
import {calculateDistance} from "../services/distance.js";
import moment from "moment-timezone";

const getVietnamTimestamp = () => {
  return moment.utc().add(7, 'hours').toISOString();
};

const kafka = new Kafka({
  clientId: 'express-app',
  brokers: ['localhost:9092']
});

// ! Cần chỉnh lại notification ở đây 


const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'express-group' });
const admin = kafka.admin();

const initializeTopic = async (topic) => {
  await admin.connect();
  
  const topics = await admin.listTopics();
  if (!topics.includes(topic)) {
    await admin.createTopics({
      topics: [{ topic }],
      waitForLeaders: true,
    });
    console.log(`Topic "${topic}" created`);
  } else {
    console.log(`Topic "${topic}" already exists`);
  }
  
  await admin.disconnect();
};

const produceMessage = async (topic, messageObject, type) => {
    await initializeTopic(topic); 
    await producer.connect();
    const message = JSON.stringify({ type, ...messageObject }); 
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    await producer.disconnect();
};

const buildNotificationMessage = (type, description, timestamp, latitude, longitude, img) => {
  const baseMessage = {
    title: 'Traffic jam notification',
    content: `Traffic jams reported near you: ${description}`,
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


const consumeMessages = async (topic, sendMessageToFrontend) => {
  await initializeTopic(topic); 
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachBatch: async ({ batch }) => { 
      const promises = batch.messages.map(async (message) => {
        try {
          const data = JSON.parse(message.value.toString());
          const { type, latitude, longitude, account_id,typeReport,timestamp, img, description } = data;

          const notificationMessage = buildNotificationMessage(type, description,timestamp, latitude, longitude, img);
          sendMessageToFrontend(notificationMessage);

          if (type === "camera report") {
            const { camera_id, trafficVolume, congestionLevel, typeReport, img } = data;
            const report = new CameraReport({
              camera_id,
              trafficVolume,
              congestionLevel,
              typeReport,
              img
            });
            await report.save();
            console.log('Camera report saved:', report);
          }
          if (type === "user report") {
            const allUsers = await User.find({ latitude: { $exists: true }, longitude: { $exists: true } });
            const usersInRange = allUsers.filter((user) => {
              const distance = calculateDistance(latitude, longitude, user.latitude, user.longitude);
              return distance <= 10;
            });
            for (const user of usersInRange) {
              if (user.account_id) {
                const notification = new Notification({
                  account_id: user.account_id,
                  title: notificationMessage.title,
                  message: `Traffic jams reported near you: ${description}`,
                  longitude,
                  latitude,
                  img: img, 
                  status: NotificationStatus.PENDING
                });
                try {
                  await notification.save();
                  console.log('Notification sent to user:', user.account_id);
                } catch (saveError) {
                  console.error(`Error saving notification for user ${user.account_id}:`, saveError);
                }
              } else {
                console.log(`User ${user.uniqueId} does not have account_id, skipping notification`);
              }
            }
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });
      await Promise.all(promises);
    },
  });
};

export { produceMessage, consumeMessages };
