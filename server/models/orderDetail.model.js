// models/orderDetail.model.js
import mongoose from 'mongoose';

const orderDetailSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order', // Reference to the Order model
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', // Reference to the Product model
        required: true,
    },
    product_details: {
        name: { type: String, required: true },
        image: { type: String, required: true },
    } ,
}, { timestamps: true });

 const orderDetailModel  = mongoose.model('orderDetail',orderDetailSchema);
 
 export default orderDetailModel;