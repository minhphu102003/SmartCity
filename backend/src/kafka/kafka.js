import { Kafka } from 'kafkajs';
import {config} from "dotenv";
config();

const kafka = new Kafka({
  brokers: [process.env.bootstrap_servers],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.sasl_username,
    password: process.env.sasl_password,
  },
  producer: {
    allowAutoTopicCreation: true,
  },
});

export const  produceMessage = async (topic, messageObject, type) => {
  const producer = kafka.producer({
    maxInFlightRequests: 5,
    idempotent: true,
    requestTimeout: 10000,
    maxRequestSize: 20000000,
  });
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
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        await messageHandler(data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
};