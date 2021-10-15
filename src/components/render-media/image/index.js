import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import styles from './styles.module.scss'

export const ImageComponent = ({ src, borderInfo = {} }) => {
  return (
    <div className={styles.container}>
      <LazyLoadImage className={styles.image} title="" src={src} alt="❔" style={borderInfo} />
    </div>
  )
}
