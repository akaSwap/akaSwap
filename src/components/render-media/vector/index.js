import React, { useContext } from 'react'
import classnames from 'classnames'
import { AkaSwapContext } from '../../../context/AkaSwapContext'
import styles from './styles.module.scss'

export const VectorComponent = ({ src, interactive, preview, tokenInfo, borderInfo={} }) => {
  const context = useContext(AkaSwapContext)
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })

  let _creator_ = false
  let _viewer_ = false

  if (tokenInfo && tokenInfo.creators[0]) {
    _creator_ = tokenInfo.creators[0]
  }

  if (context.address && context.address.address) {
    _viewer_ = context.address.address
  }

  let iframeSrc
  if (preview) {
    // can't pass creator/viewer query params to data URI
    iframeSrc = src
  } else {
    iframeSrc = `${src}?creator=${_creator_}&viewer=${_viewer_}`
  }
  
  return (
    <div className={classes}>
      <iframe
        title="akaSwap SVG renderer"
        src={iframeSrc}
        sandbox="allow-scripts"
        scrolling="no"
        style={borderInfo}
      />
    </div>
  )
}
