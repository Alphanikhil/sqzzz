import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
const cartProductSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'product'
    },
    quantity : {
        type : Number,
        default :''
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    }, 
    name : {
        type : String,
        ref : 'product'
    },
    

},{
    timestamps : true
})

const CartProductModel = mongoose.model('cartProduct',cartProductSchema)

export default CartProductModel