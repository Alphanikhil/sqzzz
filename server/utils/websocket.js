import { WebSocketServer } from 'ws';
import qrcode from 'qrcode-terminal';

const initializeWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        // Generate and send QR code data
        const qrCodeData = 'Hello, World!'; // Replace with your dynamic data
        ws.send(qrCodeData);
        qrcode.generate(qrCodeData, { small: true });

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

export default initializeWebSocket;