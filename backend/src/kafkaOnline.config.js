import { produceMessage, consumeMessages } from './kafka/kafka.js';
import { readConfig } from './api/shared/utils/config.js';
import { handleKafkaMessage } from './kafka/messageHandler.js';
import { handleImageUploadConsumer } from './kafka/videoUploadConsumer.js';

export { produceMessage, consumeMessages, readConfig };

export const startKafkaConsumer = async (topic, cachedReportsForRouting, sendMessageToFrontend) => {
  await consumeMessages(topic, 'express-group1', async (data) => {
    await handleKafkaMessage(data, cachedReportsForRouting, sendMessageToFrontend);
  });
};

export const startVideoUploadConsumer = async (topic) => {
  await consumeMessages(topic, 'video-upload-group', async (data) => {
    await handleImageUploadConsumer(data);
  });
};