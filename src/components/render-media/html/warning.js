import { Button, Primary } from '../../button'
import { getLanguage } from '../../../constants'
import styles from './styles.module.scss'

export function HTMLWarning() {

  const language = getLanguage()

  return (
    <div className={styles.warning}>
      <p>{language.mint.interactive_warning}</p>
      <Button to="/about/#mintInteractiveNFT">
        <Primary>
          <strong>{language.mint.interactive_guide}</strong>
        </Primary>
      </Button>
    </div>
  )
}
