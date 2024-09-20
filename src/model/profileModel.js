import mongoose from "mongoose";
const {Schema}=mongoose
const profileSchema=new Schema({
    owner: {
        type: String,
        required: true,
      },
      file:{
        type:String,
        required:false
      }
})
 const Profile=mongoose.model("profiles",profileSchema)
 export default Profile