import express from 'express';
import Order from '../models/order.model.js';  // Adjust the path if necessary

const router = express.Router();

// Route to display order details
router.get('/view/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        const statusMessage = order.status === 'Taken' ? '<strong>Status: Order already taken</strong>' : '<button onclick="markOrderTaken()">Mark as Taken</button>';

        res.send(`
            <h1>Order Details</h1>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Product:</strong> ${order.product}</p>
            ${statusMessage}
            <script>
                function markOrderTaken() {
                    fetch('/api/orders/taken/${order._id}', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Order marked as taken.');
                            location.reload();
                        } else {
                            alert('Order is already taken.');
                        }
                    });
                }
            </script>
        `);
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
});

router.post('/taken/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        if (order.status === 'Taken') {
            return res.status(400).json({ success: false, message: 'Order already taken' });
        }

        order.status = 'Taken';
        await order.save();
        res.json({ success: true, message: 'Order marked as taken' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
