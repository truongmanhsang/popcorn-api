// Import the neccesary modules.
import mongoose from 'mongoose';

import BaseProvider from '../scraper/providers/BaseProvider';

/**
 * The provider schema used by mongoose.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
const _ProviderConfigSchema = new mongoose.Schema({
  _id: {
    type: String,
    index: {
      unique: true
    }
  },
  api: {
    type: String,
    required: true
  },
  modelType: {
    type: String,
    required: true,
    enumType: BaseProvider.ModelTypes
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enumType: BaseProvider.Types
  },
  class: {
    type: String,
    required: true
    // enumType: based on the classnames in ./scraper/providers
  },
  query: {
    type: Object
  }
});

_ProviderConfigSchema.pre('save', function(next) {
  this._id = this.name;
  return next();
});

// Create the providerConfig model.
const ProviderConfig = mongoose.model('Provider', _ProviderConfigSchema);

/**
 * A model object for providers.
 * @type {Provider}
 */
export default ProviderConfig;
