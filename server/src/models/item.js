import mongoose from 'mongoose'
import Sale from './sale'

const itemSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: "sale" },
  name: { type: String, required: [true, "Name is required."] },
  unit: { type: String, required: [true, "Unit is required."] },
  quantity: { type: Number, required: [true, "Quantity is required."] },
  price: { type: Number, required: [true, "Price is required."] },
  vat: { type: Number, min: 1, max: 100, required: [true, "Vat is required."] }
},{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp. 
})

itemSchema.post('save', (doc, next) => {

  // Push items and increment total to related Sale object
  Sale.findByIdAndUpdate(this._creator, { $push: {items: this._id}, $inc: {total: this.price} }, { new: true }, (err, sale) => {
    if (err) {
      errors: {
        cant_update_sale: {
          message: err
        } 
      }
    }
  })

  next()
})

module.exports = mongoose.model('item', itemSchema)
