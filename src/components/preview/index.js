import React from 'react'
import { Tags } from '../tags'
import { MIMETYPE } from '../../constants'
import { RenderMedia } from '../render-media'
import { HTMLWarning } from '../render-media/html/warning'
import styles from './styles.module.scss'
import { getLanguage } from '../../constants'


function isHTML(mimeType) {
  return (
    mimeType === MIMETYPE.ZIP ||
    mimeType === MIMETYPE.ZIP1 ||
    mimeType === MIMETYPE.ZIP2
  )
}

export const Preview = ({ title, description, mimeType, uri, tags, frameColor }) => {
  const language = getLanguage()
  const t = tags !== '' ? tags.replace(/\s/g, '').split(',') : []

  return (
    <div className={styles.container}>
      
      {isHTML(mimeType) && <HTMLWarning />}
      <div className={styles.media}>
        {<RenderMedia
          mimeType={mimeType}
          uri={uri}
          interactive={true}
          preview={true}
          frameColor={frameColor}
        ></RenderMedia>}
      </div>
      <div className={styles.info}>
        <div>{language.mint.label.title}</div>
        <div className={styles.title}>{title}</div>
        <div>{language.mint.label.description}</div>
        <div className={styles.description}>{description}</div>
        <Tags tags={t} />
      </div>
    </div>
  )
}
