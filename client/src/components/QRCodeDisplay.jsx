// filepath: /c:/Users/BMSIT/Desktop/nikhil/client/src/components/QRCodeDisplay.jsx
import React, { useEffect, useState } from 'react';

const QRCodeDisplay = () => {
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080'); // Ensure the port matches the backend

        ws.onmessage = (event) => {
            setQrCode(event.data);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            {qrCode ? (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=200x200`} alt="QR Code" />
            ) : (
                <p>Wait QR CODE is COMING NIKKU BOSS</p>
            )}
        </div>
    );
};

export default QRCodeDisplay;