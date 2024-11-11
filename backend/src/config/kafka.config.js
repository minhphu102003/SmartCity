import { Kafka } from "kafkajs";
import CameraReport from '../api/v1/models/cameraReport.js';

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

const consumeMessages = async (topic) => {
  await initializeTopic(topic); 
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachBatch: async ({ batch }) => { // Sử dụng eachBatch để xử lý hàng loạt
      const promises = batch.messages.map(async (message) => {
        try {
          // Parse the message
          const data = JSON.parse(message.value.toString());

          // Extract data fields
          const { camera_id, trafficVolume, congestionLevel, typeReport, img } = data;

          // Save the report to MongoDB asynchronously
          const report = new CameraReport({
            camera_id,
            trafficVolume,
            congestionLevel,
            typeReport,
            img
          });

          return report.save(); // Trả về một promise
        } catch (error) {
          console.error('Error processing message:', error);
          return null;
        }
      });

      // Chờ tất cả các promise trong batch hoàn thành
      const results = await Promise.all(promises);

      // Log các báo cáo đã lưu thành công
      results.forEach((result) => {
        if (result) console.log('Camera report saved:', result);
      });
    },
  });
};

export { produceMessage, consumeMessages };
