import { Schema, model } from 'mongoose';

const articleSchema = new Schema({
    barcode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    retailPrice: { type: Number, required: true },
    stockLevel: { type: Number, default: 0 },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true }
}, { timestamps: true });

export default model('Article', articleSchema);