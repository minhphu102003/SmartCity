import { Kafka } from 'kafkajs';
import { config } from 'dotenv';
import {
  KAFKA_BROKERS,
  KAFKA_SASL,
  KAFKA_PRODUCER_CONFIG,
  PRODUCER_OPTIONS,
} from './constants.js';

config();

const kafka = new Kafka({
  brokers: KAFKA_BROKERS,
  ssl: true,
  sasl: KAFKA_SASL,
  producer: KAFKA_PRODUCER_CONFIG,
});

export const produceMessage = async (topic, messageObject, type) => {
  const producer = kafka.producer(PRODUCER_OPTIONS);
  await producer.connect();

  const message = JSON.stringify({ type, ...messageObject });
  await producer.send({
    topic,
    messages: [{ value: message }],
  });

  await producer.disconnect();
};

export const consumeMessages = async (topic, groupId, messageHandler) => {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        await messageHandler(data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
};
