import React, { useState } from 'react'
import styles from './styles.module.scss'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import './index.css';




export const PdfComponent = ({ src, fullscreen, onfullscreen }) => {

  const [pdfSize, setPdfSize] = useState(fullscreen)
  const [key, setKey] = useState(0)
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const { CurrentPageInput, GoToFirstPageButton, GoToLastPageButton, GoToNextPageButton, GoToPreviousPage } =
    pageNavigationPluginInstance;

  if (pdfSize !== (fullscreen)) {
    setPdfSize(fullscreen)
    setKey(key + 1)
  }

  return (

    <div className={styles.container + ' ' + (fullscreen ? styles.fullscreen : styles.halfscreen)} >
      {src && <>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
        </Worker>
        <div className={
          styles.viewer
        }>
          <Viewer fileUrl={src}
            key={key}
            plugins={[pageNavigationPluginInstance]}
            defaultScale={fullscreen ? 2.0 : 0.6} />
        </div>
        <div className={styles.navibar}>
          <div className={styles.button}><GoToFirstPageButton /></div>
          <div className={styles.button}><GoToPreviousPage /></div>
          <div className={styles.textbox}><CurrentPageInput /></div>
          <div className={styles.button}><GoToNextPageButton /></div>
          <div className={styles.button}><GoToLastPageButton /></div>
        </div>
      </>}
    </div>
  )
}
