import * as ts from 'typescript'
import * as path from 'path'
import { merge } from 'lodash'

export function resolveConfig(filePath: string): any {
  const { config, error } = ts.readConfigFile(filePath, ts.sys.readFile)

  if (error) {
    throw error
  }

  if (config.extends) {
    const extendPath = config.extends
    delete config.extends
    return merge(resolveConfig(path.resolve(path.dirname(filePath), extendPath)), config)
  }

  return config
}
