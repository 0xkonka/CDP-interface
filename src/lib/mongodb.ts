// lib/dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached: any = mongoose.connections[0].readyState ? mongoose.connections[0] : null;

async function dbConnect() {
    if (cached) {
        return cached;
    }

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected!');
    });
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

    cached = await mongoose.connect(MONGODB_URI as string);
    return cached;
}

export default dbConnect;
