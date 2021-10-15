import React, { useState } from 'react'
import { getLanguage } from '../../constants'
import { getMimeType } from '../../utils/sanitise'
import styles from './styles.module.scss'


const Buffer = require('buffer').Buffer



export const Upload = ({
  label,
  allowedTypes,
  allowedTypesLabel,
  onChange = () => null,
}) => {
  const language = getLanguage()

  const [title, setTitle] = useState(label)



  function dragOverHandler(ev) {

    ev.preventDefault();
  }

  function dropHandler(ev) {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    let file;
    if (ev.dataTransfer.items) {
      if (ev.dataTransfer.items[0].kind === 'file') {
        file = ev.dataTransfer.items[0].getAsFile();
      }
    } else {
      file = ev.dataTransfer.files[0];
    }
    if (file) {
      upload(file)
    }
  }

  const onFileChange = async (e) => {
    const { files } = e.target
    const file = files[0]
    upload(file)
  }

  const upload = async (file) => {
    setTitle(file.name)
    const mimeType = file.type !== '' ? file.type : await getMimeType(file)
    const buffer = Buffer.from(await file.arrayBuffer())

    // set reader for preview
    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
      onChange({ title, mimeType, file, buffer, reader: e.target.result })
    })
    reader.readAsDataURL(file)
  }

  const props = {
    type: 'file',
    name: 'file',
  }

  if (allowedTypes) {
    props['accept'] = allowedTypes.join(',')
  }

  return (
    <div className={styles.container} onDrop={dropHandler} onDragOver={dragOverHandler}>
      <label>
        <div>{title}</div>
        <input {...props}
          onChange={onFileChange}
        />
      </label>
      <div className={styles.caution}>
        {language.mint.label.caution}
      </div>
      <div className={styles.allowed}>
        {language.mint.label.supports}:&nbsp;{allowedTypesLabel}
      </div>
      <hr size="1" className={styles.divider}></hr>
    </div>
  )
}
