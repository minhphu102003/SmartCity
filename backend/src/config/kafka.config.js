import { Kafka } from "kafkajs";
import CameraReport from '../api/v1/models/cameraReport.js';
import User from "../api/v1/models/user.js";
import Notification from "../api/v1/models/notification.js";
import {NotificationStatus} from "../api/v1/constants/enum.js";
import {calculateDistance} from "../api/v1/services/distance.js";

const kafka = new Kafka({
  clientId: 'express-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'express-group' });
const admin = kafka.admin();

const initializeTopic = async (topic) => {
  await admin.connect();
  
  // Check if the topic exists
  const topics = await admin.listTopics();
  if (!topics.includes(topic)) {
    // Create the topic if it doesn't exist
    await admin.createTopics({
      topics: [{ topic }],
      waitForLeaders: true, // Ensures the topic is fully created and ready to use
    });
    console.log(`Topic "${topic}" created`);
  } else {
    console.log(`Topic "${topic}" already exists`);
  }
  
  await admin.disconnect();
};

// Produce message to Kafka
const produceMessage = async (topic, messageObject, type) => {
    await initializeTopic(topic); // Ensure topic exists
    await producer.connect();
    const message = JSON.stringify({ type, ...messageObject }); // Add type to message
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    await producer.disconnect();
};

const buildNotificationMessage = (type, description, latitude, longitude, img) => {
  const baseMessage = {
    title: 'Traffic jam notification',
    content: `Traffic jams reported near you: ${description}`,
    status: 'PENDING', // Default to 'read' or handle as per your logic
    isRead: false, // If the notification is read or not
    timestamp: new Date().toISOString(),
    distance: '', // Leave this empty for frontend to calculate
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
          const { type, latitude, longitude, account_id,typeReport, img, description } = data;

          // Build the notification message using the helper function
          const notificationMessage = buildNotificationMessage(type, description, latitude, longitude, img);

          // Send message to all connected WebSocket clients
          sendMessageToFrontend(notificationMessage);

          // Handle Camera Report
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
          // Handle User Report
          if (type === "user report") {
              // Lấy danh sách tất cả người dùng
            const allUsers = await User.find({ latitude: { $exists: true }, longitude: { $exists: true } });
            // Lọc người dùng trong bán kính 10km
            const usersInRange = allUsers.filter((user) => {
              const distance = calculateDistance(latitude, longitude, user.latitude, user.longitude);
              return distance <= 10; // Bán kính 10km
            });
            // Create notification for each user in range
            for (const user of usersInRange) {
              if (user.account_id) {
                const notification = new Notification({
                  account_id: user.account_id,
                  message: `Có báo cáo tắc đường gần bạn: ${description}`,
                  longitude,
                  latitude,
                  img: img, // First image
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
