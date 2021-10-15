import React, { useContext, useState, useEffect} from 'react'
import { useHistory } from 'react-router'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { GetTagList } from '../../data/api'
import { CustomSelect } from '../custom-select'
import styles from './styles.module.scss'

export const TagSearch = () => {

  const history = useHistory()
  const context = useContext(AkaSwapContext)
  const [tagList, setTagList] = useState([])


  useEffect(() => {
    GetTagList().then((data) => {
      setTagList(data.tags)
    })
  }, []);

  const handleRoute = (path) => {
    context.setMenu(true)
    history.push(path)
  }

  const handleSubmit = (value) => {
    let inputTag = value
    if (inputTag !== "") handleRoute('/tags/' + encodeURIComponent(inputTag));
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.link}>
        <CustomSelect
          options={tagList}
          formClassName={styles.tagArea}
          focusedFormClassName={styles.focused}
          activeOptionClassName={styles.active}
          submitButton={<div className={styles.icon}></div>}
          submitCB={handleSubmit}
        >
        </CustomSelect>
      </div>
    </div >
  )
}
