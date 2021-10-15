import React from 'react'
import { Page, Container, Padding } from '../../../components/layout'
import { Button} from '../../../components/button'
import styles from './styles.module.scss'
import { getLanguage, CURRENT_GACHA_STAGE } from '../../../constants'
import { Process } from '../../../components/process'
import { useHistory} from "react-router-dom";

export const AboutGachaStage = () => {
  let history = useHistory();
  let stage = 'gachastage'+CURRENT_GACHA_STAGE
  const language = getLanguage()
  var descriptions = language[stage].intro.tutorialDescription.map((desc)=><li>{desc}</li>)


  return (
    <Page title="Gacha Stage">
      <div className={styles.gachaStage}>
        <Container slarge>
          <Padding>
          <div className={styles.main}>
            <Container large>
            <h1>{language[stage].intro.introTitle}</h1>
            <div className={styles.processContainer}>
              <Process
                stepNames={['1','2','3']}
                currentName={CURRENT_GACHA_STAGE}
                selectable = {false}
                selectPrev = {false}
              />
            </div>
            
            <ul className={styles.descList}>
              {descriptions}
            </ul>
            {CURRENT_GACHA_STAGE===1 && 
              <div className={styles.footNotes}>
                {language.note.whitelistNote}
              </div>
            }
            {CURRENT_GACHA_STAGE!==1 && 
              <div className={styles.footNotes}>
                {language.note.note}
              </div>
            }
            <div className={styles.ctaContainer}>

            <Button onClick={history.goBack}>Back</Button>
            </div>
            </Container>
          </div>
          </Padding>
        </Container>
      </div>
    </Page>
  )
}
