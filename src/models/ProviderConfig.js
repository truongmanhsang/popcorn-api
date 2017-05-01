// Import the neccesary modules.
import mongoose from 'mongoose';

import BaseProvider from '../scraper/providers/BaseProvider';

/**
 * The provider configuration schema used by mongoose.
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
    enum: Object.keys(BaseProvider.ModelTypes)
                .map(key => BaseProvider.ModelTypes[key])
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: Object.keys(BaseProvider.Types)
                .map(key => BaseProvider.Types[key])
  },
  class: {
    type: String,
    required: true
    // XXX: Create enum based on the classnames in ./scraper/providers
  },
  query: {
    type: Object
  }
});

/**
 * Pre-hook for inserting a provider configuration. Sets the '_id' as the name
 * of the provider configuration
 */
_ProviderConfigSchema.pre('save', function(next) {
  this._id = this.name;
  return next();
});

// Create the provider configration model.
const ProviderConfig = mongoose.model('ProviderConfig', _ProviderConfigSchema);

/**
 * A model object for provider configuration.
 * @type {ProviderConfig}
 */
export default ProviderConfig;
