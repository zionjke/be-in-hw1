import {SERVICE} from "./constants";
import mongoose from "mongoose";

const mongoUri = process.env.mongoURI || SERVICE.URI;

export async function runDb() {
    try {
        await mongoose.connect(mongoUri)

        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to db");
    }
}
