import React, { useEffect, useState } from 'react';

const QRCodeDisplay = () => {
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_API_URL.replace('http', 'ws'); // Convert http://localhost:8050 to ws://localhost:8050
        const ws = new WebSocket(wsUrl); // Use the correct WebSocket URL

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
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

    useEffect(() => {
        console.log('QR Code state updated:', qrCode);
    }, [qrCode]);

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
