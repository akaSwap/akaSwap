import React, { useContext, useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import { AkaSwapContext } from '../../../context/AkaSwapContext'
import { Button } from '../../button'
import {
  dataRUIToBuffer,
  prepareFilesFromZIP,
  validateFiles,
} from '../../../utils/html'
import { VisuallyHidden } from '../../visually-hidden'
import styles from './styles.module.scss'
import { webUrl } from '../../../constants'

const uid = Math.round(Math.random() * 100000000).toString()

export const HTMLComponent = ({
  src,
  interactive,
  preview,
  tokenInfo,
  displayUri,
}) => {
  const context = useContext(AkaSwapContext)
  const [viewing, setViewing] = useState(interactive)

  let _creator_ = false
  let _viewer_ = false

  if (tokenInfo && tokenInfo.creators[0]) {
    _creator_ = tokenInfo.creators[0]
  }

  if (context.acc && context.acc.address) {
    _viewer_ = context.acc.address
  }

  // preview
  const iframeRef = useRef(null)
  const unpackedFiles = useRef(null)
  const unpacking = useRef(false)
  const [validHTML, setValidHTML] = useState(null)
  const [validationError, setValidationError] = useState(null)

  const [containerStyle, setContainerStyle] = useState({})

  const loaded = () => {
    // console.log("loaded")
    setContainerStyle({ background: "var(--background-color)" })

  }

  const unpackZipFiles = async () => {
    unpacking.current = true

    const buffer = dataRUIToBuffer(src)
    const filesArr = await prepareFilesFromZIP(buffer)
    const files = {}
    filesArr.forEach((f) => {
      files[f.path] = f.blob
    })

    unpackedFiles.current = files

    const result = await validateFiles(unpackedFiles.current)
    if (result.error) {
      console.error(result.error)
      setValidationError(result.error)
    } else {
      setValidationError(null)
    }
    setValidHTML(result.valid)

    unpacking.current = false
  }

  if (preview && !unpackedFiles.current && !unpacking.current) {
    unpackZipFiles()
  }

  const [resizeCounter, setResizeCounter] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      var counter = resizeCounter + 1
      setResizeCounter(counter)
      // console.log(counter)
    }
    global.addEventListener('resize', handleResize)
    const handler = async (event) => {
      if (event.data !== uid) {
        return
      }

      iframeRef.current.contentWindow.postMessage(
        {
          target: 'akaswap-html-preview',
          data: unpackedFiles.current,
        },
        '*'
      )
    }

    window.addEventListener('message', handler)

    return () => window.removeEventListener('message', handler)
  }, [src, resizeCounter])

  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })

  if (preview) {
    // creator is viewer in preview
    _creator_ = _viewer_

    if (validHTML) {
      return (
        <div className={classes}>
          <iframe
            ref={iframeRef}
            title="html-zip-embed"
            // src={`https://beta.akaswap.com/gh-pages/html-preview/?uid=${uid}&creator=${_creator_}&viewer=${_viewer_}`}
            // src={`https://beta.akaswap.com/api/preview/html-preview/?uid=${uid}&creator=${_creator_}&viewer=${_viewer_}`}
            src={`https://${webUrl}/api/preview/html-preview/?uid=${uid}&creator=${_creator_}&viewer=${_viewer_}`}
            sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
          // allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
          />
        </div>
      )
    } else if (validHTML === false) {
      return (
        <div className={styles.error}>Preview Error: {validationError}</div>
      )
    }
    else {
      return (
        <div>Preivew of interactive akaOBJ is not supported in Beta version</div>
      )
    }
  }

  if (!viewing) {
    return (
      <div className={classes}>
        <div className={styles.preview}>
          <img src={displayUri} alt="thumbnail" />
          <div className={styles.button}>
            <Button onClick={() => setViewing(true)}>
              <VisuallyHidden>View</VisuallyHidden>
              <div className={styles.dark} />
              {/* <svg
                version="1.1"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <path d="M405.2,232.9L126.8,67.2c-3.4-2-6.9-3.2-10.9-3.2c-10.9,0-19.8,9-19.8,20H96v344h0.1c0,11,8.9,20,19.8,20  c4.1,0,7.5-1.4,11.2-3.4l278.1-165.5c6.6-5.5,10.8-13.8,10.8-23.1C416,246.7,411.8,238.5,405.2,232.9z" />
              </svg> */}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={classes} style={containerStyle}>
      <iframe
        title="html-embed"
        src={`${src}?creator=${_creator_}&viewer=${_viewer_}`}
        sandbox="allow-scripts allow-same-origin allow-popups"
        scrolling="no"
        onLoad={() => loaded()}
      />
    </div>
  )
}
