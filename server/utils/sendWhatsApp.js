import qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import wss from './websocket.js'; // Import the WebSocket server

import AddressModel from '../models/address.model.js'; // Import the address model
import OrderModel from '../models/order.model.js'; // Import the order model
import ProductModel from '../models/product.model.js'; // Import the product model

const client = new Client();

client.on('qr', (qr) => {
    console.log('Scan this QR code to connect to WhatsApp:');
    qrcode.generate(qr, { small: true });

    // Send the QR code to all connected clients
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(qr);
        }
    });
});

client.on('ready', () => {
    console.log('WhatsApp Bot is ready!');
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failure:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
});

client.initialize();

export default client;

/**
 * Sends order details to multiple WhatsApp numbers.
 * @param {Object} orderDetail - Order details including name, phone, address, product, and ID.
 * @param {Array} phoneNumbers - Array of phone numbers to send the message to.
 */
export async function sendOrderToWhatsApp(orderDetail, phoneNumbers) {
    try {
        console.log('sendOrderToWhatsApp called with:', orderDetail);

        // Fetch and populate the products and address details
        const order = await OrderModel.findById(orderDetail._id)
            .populate('products.productId')  // Populate product details
            .populate('delivery_address');  // Populate address details

        if (!order) {
            throw new Error('Order not found');
        }

        // Construct the message
        let message = `*New Order Received!*\n`;
        message += `*Full Name:* ${orderDetail.name || 'N/A'}\n`;
        message += `*Phone:* ${order.delivery_address?.mobile || 'N/A'}\n`;
        message += `*Address:* ${order.delivery_address?.address || 'N/A'}\n`;
        message += `*Products:*\n`;
        orderDetail.products.forEach((productItem) => {
            const product = productItem.productId;  // The populated product
            message += `- ${product?.name || 'N/A'} (Qty: ${productItem.quantity}, Unit: ${product?.unit || 'N/A'})\n`;  // Show product name, quantity, and unit
        });
        message += `*Name:* ${order.delivery_address?.country || 'N/A'}\n`;
        message += `*Total Amount:* ${order.totalAmt + 11}\n`;
        message += `*Near By:* ${order.delivery_address?.pincode || 'N/A'}\n`;
        message += `*Building Name:* ${order.delivery_address?.state || 'N/A'}\n`;
        message += `*City:* ${order.delivery_address?.city || 'N/A'}\n`;
        message += `*Order ID:* ${orderDetail._id}\n`;

        // Send the message to each phone number
        for (const phoneNumber of phoneNumbers) {
            const formattedPhoneNumber = `${phoneNumber}@c.us`; // Ensure the phone number is in the correct format
            console.log('Sending message to:', formattedPhoneNumber);
            const response = await client.sendMessage(formattedPhoneNumber, message);
            console.log('Order message sent to:', formattedPhoneNumber, response);
        }
    } catch (error) {
        console.error('Error sending order:', error);
    }
}