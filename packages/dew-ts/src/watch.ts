import * as chokidar from 'chokidar'
import * as path from 'path'
import { resolveConfig } from './parseConfig'
import * as ts from 'typescript'
import * as fs from 'fs'

export interface DewWatchOptions {
  include: string
  tsConfig: string
  baseUrl?: string
}

export class DewWatch {
  private _watcher: chokidar.FSWatcher | undefined = undefined
  constructor(private readonly options: DewWatchOptions) {}

  public startWatch() {
    const tsConfigFilePath = path.resolve(this.options.tsConfig ? this.options.tsConfig : './tsconfig.json')
    const tsConfig = resolveConfig(tsConfigFilePath)
    this._watcher = chokidar.watch(this.options.include)
    const compilerOptions = tsConfig.compilerOptions

    this._watcher.on('all', async (event: string, filePath: string) => {
      if (!filePath.endsWith('.ts')) {
        return
      }
      console.log(filePath)
      const result = ts.transpileModule(fs.readFileSync(filePath).toString(), {
        ...tsConfig,
      })
      const outFilePath = path
        .resolve(
          compilerOptions.outDir || './out',
          path.relative(path.resolve(this.options.baseUrl || compilerOptions.baseUrl || '.'), filePath)
        )
        .replace(/.ts$/, '.js')
      if (!fs.existsSync(path.dirname(outFilePath))) {
        fs.mkdirSync(path.dirname(outFilePath), { recursive: true })
      }
      fs.writeFileSync(outFilePath, result.outputText)
    })
  }

  public closeWatch() {
    this._watcher?.close()
  }
}
