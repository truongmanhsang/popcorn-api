#!/usr/bin/env node

// Import the necessary modules.
import dotenv from 'dotenv'
import { join } from 'path'

// initialize the dotenv module.
dotenv.config()

import('./CLI').then(res => {
  // Set the TEMP_DIR environment variable if it is not set in the .env file.
  process.env.TEMP_DIR = process.env.TEMP_DIR
    ? process.env.TEMP_DIR
    : join(process.cwd(), 'tmp')

  // Run the CLI program.
  const CLI = res.default
  new CLI().run()
})
