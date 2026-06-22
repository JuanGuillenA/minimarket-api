import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
    roleName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Role', roleSchema);