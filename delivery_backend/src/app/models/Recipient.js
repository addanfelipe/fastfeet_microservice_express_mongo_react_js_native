import mongo from '../../mongo';

const recipientSchema = new mongo.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    complement: {
      type: String
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip_code: {
      type: String,
      required: true,
    },
  },
  { collection: 'recipient' }
);

recipientSchema.virtual('id').get(function() { return this._id; });
recipientSchema.set('toJSON', { virtuals: true });

export default mongo.model('Recipient', recipientSchema);