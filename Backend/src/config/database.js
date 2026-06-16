import mongoose from 'mongoose'

const databaseConnect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database Connected");
    } 
    catch (error) {
        console.error(error)
    }
}

export default databaseConnect;