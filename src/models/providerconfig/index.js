// Import the necessary modules.
// @flow
import mongoose from 'mongoose'

import ProviderConfigModel from './ProviderConfigModel'
import providerConfigSchema from './providerConfigSchema'

// Attach the functions from the classes to the schemas.
providerConfigSchema.loadClass(ProviderConfigModel)

/**
 * The provider configuration model.
 * @type {ProviderConfig}
 * @ignore
 */
export default mongoose.model(
  ProviderConfigModel, providerConfigSchema, 'providerconfigs'
)
