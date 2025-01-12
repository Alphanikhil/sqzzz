import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    orderId : {
        type : String,
        required : [true, "Provide orderId"],
        unique : true
    },
    products: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: "product"
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    product_details : {
        name : String,
        image : Array,
    },
    paymentId : {
        type : String,
        default : ""
    },
    payment_status : {
        type : String,
        default : ""
    },
    delivery_address : {
        type : mongoose.Schema.ObjectId,
        ref : 'address'
    },
    subTotalAmt : {
        type : Number,
        default : 0
    },
    totalAmt : {
        type : Number,
        default : 0
    },
    invoice_receipt : {
        type : String,
        default : ""
    },
    forproduct : {
        type : String,
        ref: "product"
    },
},{
    timestamps : true
})

const OrderModel = mongoose.model('order',orderSchema)

export default OrderModel