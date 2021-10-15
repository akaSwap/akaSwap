import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import styles from './styles.module.scss'

export const Button = ({
  to = null,
  href = null,
  onClick = () => null,
  onMouseLeave = () => null,
  onMouseEnter = () => null,
  children,
  disabled,
  fit,
  value,
  target = "_blank",
  customClass
}) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.disabled]: disabled,
    [styles.fit]: fit,
    [customClass]: true,
  })

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={classes} value={value}>
      {children}
    </button>
  )
}

export const PlainText = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.plainText]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Primary = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.primary]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Tab = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.tab]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Collector = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.collector]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Secondary = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.secondary]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Purchase = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.purchase]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const SelectPrize = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.selectPrize]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Curate = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.curate]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const SwapBtn = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.swapBtn]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}
