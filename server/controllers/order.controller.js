import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import { sendOrderToWhatsApp } from '../utils/sendWhatsApp.js';
import OrderDetailModel from '../models/orderDetail.model.js'; // Import the orderDetail model
import AddressModel from '../models/address.model.js';

export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId; // auth middleware 
        const { totalAmt, addressId, subTotalAmt, fullName } = request.body;

        // Fetch all items in the user's cart
        const cartItems = await CartProductModel.find({ userId }).populate('productId');

        if (!cartItems.length) {
            return response.status(400).json({
                message: "Cart is empty",
                error: true,
                success: false
            });
        }

        const payload = cartItems.map(item => ({
            userId: userId,
            orderId: new mongoose.Types.ObjectId(), // Ensure orderId is an ObjectId
            productId: item.productId._id,
            product_details: {
                name: item.productId.name,
                image: item.productId.image[0], // Ensure image is a string
            },
            quantity: item.quantity, // Add quantity
            paymentId: "",
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        }));

        const generatedOrder = await OrderModel.insertMany(payload);

        // Save order details to orderDetail collection
        const orderDetailsPayload = payload.map(order => ({
            orderId: order.orderId,
            productId: order.productId,
            product_details: order.product_details
        }));
        await OrderDetailModel.insertMany(orderDetailsPayload);

        // Fetch the address details
        const address = await AddressModel.findById(addressId);

        // Send order details to WhatsApp
        sendOrderToWhatsApp({
            name: fullName, // Use full name
            phone: userId, // Assuming userId is the phone number, adjust as needed
            address: address, // Pass the address details
            products: cartItems, // Pass the list of products from the cart
            _id: generatedOrder[0]._id
        }, ['916205165191', '918252241135','919122230800']); // Pass the array of phone numbers

        // Remove from the cart
        await CartProductModel.deleteMany({ userId: userId });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

        return response.json({
            message: "Order successfully",
            error: false,
            success: true,
            data: generatedOrder
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            const paylod = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : product.metadata.productId, 
                product_details : {
                    name : product.name,
                    image : product.images
                } ,
                paymentId : paymentId,
                payment_status : payment_status,
                delivery_address : addressId,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
            }

            productList.push(paylod)
        }
    }

    return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event",event)

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
            lineItems : lineItems,
            userId : userId,
            addressId : session.metadata.addressId,
            paymentId  : session.payment_intent,
            payment_status : session.payment_status,
        })
    
      const order = await OrderModel.insertMany(orderProduct)

        console.log(order)
        if(Boolean(order[0])){
            const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                shopping_cart : []
            })
            const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
        }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}


export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// Example function for creating an order
export async function createOrderController(req, res) {
    try {
        const { userId, products, addressId, totalAmt } = req.body;

        // Create the order
        const newOrder = await OrderModel.create({
            userId,
            products,
            addressId,
            totalAmt
        });

        // Fetch product details
        const productDetails = await Promise.all(products.map(async (item) => {
            const product = await ProductModel.findById(item.productId);
            return {
                name: product.name,
                quantity: item.quantity
            };
        }));

        // Send order details to WhatsApp
        sendOrderToWhatsApp({
            userId,
            addressId,
            products: productDetails,
            totalAmt,
            _id: newOrder._id
        }, ['916205165191', '918252241135']);

        res.status(201).json({
            message: 'Order created successfully',
            order: newOrder,
            success: true,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            message: 'Server error',
            error: true,
            success: false,
        });
    }
}