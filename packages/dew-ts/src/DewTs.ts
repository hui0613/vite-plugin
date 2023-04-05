import { Plugin } from 'vite'
import { DewWatchOptions, DewWatch } from './watch'

export type DewViteOption = {
  tsConfig?: string
} & DewWatchOptions

export function DewTs(options: DewViteOption): Plugin {
  let isWatch = false
  let _watcher: DewWatch | null = null
  return {
    name: 'dew-ts',
    apply: 'serve',
    configureServer(config: any) {
      _watcher ? (_watcher.closeWatch(), _watcher.startWatch()) : ((_watcher = new DewWatch(options)), _watcher.startWatch())
    },
    closeBundle() {
      _watcher?.closeWatch()
    },
  }
}
