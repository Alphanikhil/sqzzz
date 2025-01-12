import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    }
},{
    timestamps : true
})

const CategoryModel = mongoose.model('category',categorySchema)

export default CategoryModel