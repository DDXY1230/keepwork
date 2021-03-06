import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './board.styles'
import templates from './board.templates'

const name = 'ModBoard'

const components = {
  board: 'AdiBoard'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
