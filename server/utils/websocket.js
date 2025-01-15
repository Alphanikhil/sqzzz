import { WebSocketServer } from 'ws';
import qrcode from 'qrcode-terminal';

let wss;

const initializeWebSocket = (server) => {
    wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('close', () => {
            console.log('Client disconnected');
        });

        ws.on('message', (message) => {
            console.log('Received message:', message);
            // Echo the message back to the client
            ws.send(message);
        });
    });

    console.log('WebSocket server is running');
};

export { initializeWebSocket, wss };
