const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsHost = window.location.hostname.includes('localhost')
  ? 'localhost:8000'
  : 'danahub-backend-4ccd2faffe40.herokuapp.com';

export const WS_URL = `${wsProtocol}://${wsHost}/ws`;