import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config()

export function getMongoErrorMsg(errors) {
    const errMsg = {}
    for(const key in errors) {
        errMsg[key] = errors[key].message
    }
    return errMsg
}

export function createConnection() {
    let conn = undefined;
    const mongoUsername = process.env.MONGO_USERNAME;
    const mongoPassword = process.env.MONGO_PASSWORD;
    const mongoUrl = process.env.MONGO_URL;
    
    console.log("mongodb://" + mongoUsername + ":" + mongoPassword + "@" + mongoUrl + "?authSource=admin");
    try {
        conn = mongoose.createConnection("mongodb://" + mongoUsername + ":" + mongoPassword + "@" + mongoUrl + "?authSource=admin")
        
    }
    catch(err) {
        console.log(err);
    }
    return conn;
}