import React from 'react'
import { getItem, setItem } from '../../utils/storage'
import styles from './styles.module.scss'


// DO NOT ENABLE THIS JUST YET (Andre)
const languages = [
  { key: 'en', title: 'English' },
  { key: 'zh-tw', title: '中文' },
  // { key: 'fr', title: 'french' },
  // { key: 'ja', title: 'japanese' },
  // { key: 'pt', title: 'português' },
]

export const ButtonLanguage = () => {
  const language = getItem('language') || setItem('language', languages[0].key)

  const handleChange = (e) => {
    setItem('language', e.target.value)
    window.location.reload()
  }

  return (
    <>
    <select
      className={styles.container}
      value={language}
      onChange={handleChange}
    >
      {languages.map((lang) => {
        return (
          <option key={lang.key} value={lang.key}>
            {lang.title}
          </option>
        )
      })}
    </select>
    </>
  )
}
