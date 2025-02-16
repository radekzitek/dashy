import log from '../services/logger'
import { useUiStore } from 'src/stores/ui'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function navigate(to: any, from: any) {
  log.debug(`Navigating from ${from.fullPath} to ${to.fullPath}`)
  // Add any other custom actions you want to perform here
  useUiStore().setFooterText('Navigating from <' + from.fullPath + '> to <' + to.fullPath + '>.')
}
