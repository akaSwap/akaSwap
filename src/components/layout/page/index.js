import React from 'react'
import { Helmet } from 'react-helmet'
import { VisuallyHidden } from '../../visually-hidden'
import classnames from 'classnames'
import styles from './styles.module.scss'

export const Page = ({ title = 'akaSwap', children = null, noPadding = false, noBottomPadding = false}) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.noPadding]: noPadding,
    [styles.noBottomPadding]: noBottomPadding,
  })
  return (
    <main className={classes} id='infiniteScrollParent'>
      <div>
        <Helmet>
          {title !== '' ? (
            <title>akaSwap - {title}</title>
          ) : (
            <title>akaSwap</title>
          )}
          {/* {(coverUri !== null) &&
            <meta property="og:image" content={coverUri} />
          } */}
        </Helmet>
        <VisuallyHidden as="h1">{title}</VisuallyHidden>
        {children}
      </div>
    </main>
  )
}
