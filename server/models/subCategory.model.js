import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  

const subCategorySchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "category"
        }
    ]
},{
    timestamps : true
})

const SubCategoryModel = mongoose.model('subCategory',subCategorySchema)

export default SubCategoryModel