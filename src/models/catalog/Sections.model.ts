import { Schema, model } from 'mongoose';

const sectionSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Section', sectionSchema);