// Import the necessary modules.
import mongoose, {
  Model,
  Schema
} from 'mongoose'

import BaseProvider from '../scraper/providers/BaseProvider'

/**
 * The provider configuration schema used by mongoose.
 * @type {Object}
 * @ignore
 * @flow
 * @see http://mongoosejs.com/docs/guide.html
 */
const _providerConfigSchema = new Schema({
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
  clazz: {
    type: String,
    required: true
    // XXX: Create enum based on the classnames in ./scraper/providers
  },
  query: {
    type: Object
  }
})

/**
 * Class for provider configuration attributes and methods.
 * @extends {Model}
 * @type {ProviderConfig}
 */
export class ProviderConfig extends Model {

  /**
   * The id of the provider configuration.
   * @type {string}
   */
  _id: string

  /**
   * The API of the provider configuration.
   * @type {string}
   */
  api: string

  /**
   * The modelType of the provider configuration.
   * @type {string}
   */
  modelType: string

  /**
   * The name of the provider configuration.
   * @type {string}
   */
  name: string

  /**
   * The type of the provider configuration.
   * @type {string}
   */
  type: string

  /**
   * The clazz of the provider configuration.
   * @type {string}
   */
  clazz: string

  /**
   * The query of the provider configuration.
   * @type {Object}
   */
  query: Object

  /**
   * Create a new ProviderConfig object.
   * @param {!Object} config - The configuration object for the content.
   * @param {!string} api - The API of the provider configuration.
   * @param {!string} modelType - The modelType of the provider configuration.
   * @param {!string} name - The name of the provider configuration.
   * @param {!string} type - The type of the provider configuration.
   * @param {!string} clazz - The clazz of the provider configuration.
   * @param {?Object} query - The query of the provider configuration.
   */
  constructor({api, modelType, name, type, clazz, query}: Object = {}): void {
    super()

    /**
     * The id of the provider configuration.
     * @type {string}
     */
    this._id = name
    /**
     * The API of the provider configuration.
     * @type {string}
     */
    this.api = api
    /**
     * The modelType of the provider configuration.
     * @type {string}
     */
    this.modelType = modelType
    /**
     * The name of the provider configuration.
     * @type {string}
     */
    this.name = name
    /**
     * The type of the provider configuration.
     * @type {string}
     */
    this.type = type
    /**
     * The clazz of the provider configuration.
     * @type {string}
     */
    this.clazz = clazz
    /**
     * The query of the provider configuration.
     * @type {Object}
     */
    this.query = query
  }

  /**
   * Getter for the id of the provider configuration.
   * @return {string} - The id of the provider configuration.
   */
  get id(): string {
    return this._id
  }

}

// Attach the fuctions from the ProviderConfig class to the
_providerConfigSchema.loadClass(ProviderConfig)

// Create the provider configuration model.
const ProviderConfigModel = mongoose
  .model(ProviderConfig, _providerConfigSchema)

/**
 * A model object for provider configuration.
 * @ignore
 * @type {ProviderConfigModel}
 */
export default ProviderConfigModel
