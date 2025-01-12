import { Router } from 'express';
import auth from '../middleware/auth.js';
import { CashOnDeliveryOrderController, createOrderController, getOrderDetailsController, paymentController, webhookStripe } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);
orderRouter.post('/checkout', auth, paymentController);
orderRouter.post('/webhook', webhookStripe);
orderRouter.get("/order-list", auth, getOrderDetailsController);
orderRouter.post("/create-order", auth, createOrderController);

export default orderRouter;