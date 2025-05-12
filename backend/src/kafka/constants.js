export const KAFKA_BROKERS = process.env.bootstrap_servers?.split(',') || [];

export const KAFKA_SASL = {
  mechanism: 'plain',
  username: process.env.sasl_username || '',
  password: process.env.sasl_password || '',
};

export const KAFKA_PRODUCER_CONFIG = {
  allowAutoTopicCreation: true,
};

export const PRODUCER_OPTIONS = {
  maxInFlightRequests: 5,
  idempotent: true,
  requestTimeout: 10000,
  maxRequestSize: 20000000,
};

export const NOTIFICATION_TYPES = {
  CAMERA_REPORT: 'camera report',
  USER_REPORT: 'user report',
  CREATE_NOTIFICATION: 'create notification',
};

export const NOTIFICATION_FIELDS = {
  TITLE: 'title',
  MESSAGE: 'message',
};

