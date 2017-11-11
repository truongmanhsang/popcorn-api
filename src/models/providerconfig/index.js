// Import the necessary modules.
import mongoose from 'mongoose'

import ProviderConfigModel from './ProviderConfigModel'
import providerConfigSchema from './providerConfigSchema'

// Attach the functions from the classes to the schemas.
providerConfigSchema.loadClass(ProviderConfigModel)

/**
 * The provider configuration model.
 * @ignore
 * @type {ProviderConfig}
 */
export default mongoose.model(
  ProviderConfigModel, providerConfigSchema, 'providerconfigs'
)
