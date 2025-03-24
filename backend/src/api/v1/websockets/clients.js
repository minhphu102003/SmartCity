const wsClients = [];

export const addClient = (ws) => {
    wsClients.push(ws);
};

export const removeClient = (ws) => {
    const index = wsClients.indexOf(ws);
    if (index > -1) {
        wsClients.splice(index, 1);
    }
};

export const broadcastMessage = (message) => {
    wsClients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
            console.log('Message sent to client:', message);
        }
    });
};

export default wsClients;
