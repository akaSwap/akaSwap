import React from 'react'
import classnames from 'classnames'
import styles from './styles.module.scss'

export const Container = ({ children = null, small, slarge, large, xlarge, full }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.small]: small,
    [styles.slarge]: slarge,
    [styles.large]: large,
    [styles.xlarge]: xlarge,
    [styles.full]: full,
  })
  return <div className={classes}>{children}</div>
}
