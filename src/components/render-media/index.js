import React, { useContext, useEffect, useState } from 'react'
import { AkaSwapContext } from '../../context/AkaSwapContext'
// import ipfsClient from 'ipfs-http-client'
import { GLBComponent } from './glb'
import { ImageComponent } from './image'
import { VideoComponent } from './video'
import { AudioComponent } from './audio'
import { VectorComponent } from './vector'
import { HTMLComponent } from './html'
import { UnknownComponent } from './unknown'
import { PdfComponent } from './pdf'
import { MIMETYPE, IPFS_DIRECTORY_MIMETYPE, DEFAULT_IPFS_GATEWAY } from '../../constants'
import { Container } from './container'
import { GetIpfsLink } from '../../data/api'

// function getInfuraUrl(hash) {
//   const cidv1 = new ipfsClient.CID(hash).toV1().toString('base32')
//   const subomain = cidv1.toString()
//   return `https://${subomain}.ipfs.infura-ipfs.io/`
// }

export const RenderMedia = ({
  mimeType,
  uri,
  interactive = false,
  preview = false,
  isDetailed = false,
  metadata,
  frameColor = null
}) => {
  const path = uri
  let displayUriHash = ''
  if (metadata !== undefined && metadata.tokenInfo !== undefined && metadata.tokenInfo.displayUri !== undefined) {
    displayUriHash = metadata.tokenInfo.displayUri.split('//')[1]
  }

  const [url, setUrl] = useState(preview ? uri : `${DEFAULT_IPFS_GATEWAY}${path}`)
  const [hasUrl, setHasUrl] = useState(false)
  const [displayUri, setDisplayUri] = useState(`${DEFAULT_IPFS_GATEWAY}${displayUriHash}`)
  const [hasDisplayUri, setHasDisplayUri] = useState(false)

  // let url = preview ? uri : `${DEFAULT_IPFS_GATEWAY}${path}`
  // let displayUri = ''

  let srcUrl = url

  //var fullscreen = false
  const { fullscreen } = useContext(AkaSwapContext)

  let borderInfo = {}
  if (frameColor != null && frameColor !== "") {
    borderInfo = {
      borderColor: frameColor,
      // borderRadius:'8px',
      borderStyle: 'inset',
      borderWidth: '10px'
    }
  }

  const [isMounted, setIsMounted] = useState(true)
  useEffect(() => {
    if (!hasDisplayUri) {
      GetIpfsLink(displayUriHash)
        .then(res => {
          if (isMounted) {
            setDisplayUri(res)
            setHasDisplayUri(true)
          }
        })
        .catch()
    }
    if (!hasUrl) {
      GetIpfsLink(path)
        .then(res => {
          if (isMounted) {
            setUrl(res)
            setHasUrl(true)
          }
        })
        .catch()
    }
    return () => { setIsMounted(false) }
  })

  switch (mimeType) {
    /* IMAGES */
    // case MIMETYPE.TIFF:
    case MIMETYPE.BMP:
    case MIMETYPE.GIF:
    case MIMETYPE.JPEG:
    case MIMETYPE.PNG:
    case MIMETYPE.WEBP:
      return (
        <Container interactive={interactive} halfscreen>
          <ImageComponent src={srcUrl} borderInfo={borderInfo} />
        </Container>
      )
    /* VECTOR */
    case MIMETYPE.SVG:
      return (
        <Container interactive={interactive}>
          <VectorComponent {...metadata} src={srcUrl} preview={preview} borderInfo={borderInfo} />
        </Container>
      )
    /* HTML ZIP */
    case IPFS_DIRECTORY_MIMETYPE:
    case MIMETYPE.ZIP:
    case MIMETYPE.ZIP1:
    case MIMETYPE.ZIP2:
      // if (!preview) {
      //   srcUrl = getInfuraUrl(path)
      // }
      // let displayUri = ''
      // if (metadata && metadata.tokenInfo && metadata.tokenInfo.displayUri) {
      //   displayUri = metadata.tokenInfo.displayUri.replace(
      //     'ipfs://', DEFAULT_IPFS_GATEWAY
      //   )
      // }
      // else if (metadata && metadata.displayUri) {
      //   displayUri = metadata.displayUri.replace(
      //     'ipfs://', DEFAULT_IPFS_GATEWAY
      //   )
      // }
      return (
        <div key={fullscreen ? "1" : "2"}>
          < Container interactive={interactive} borderInfo={borderInfo}>

            <HTMLComponent
              {...metadata}
              src={srcUrl}
              preview={preview}
              displayUri={displayUri}

            />
          </Container></div>


      )
    /* VIDEOS */
    case MIMETYPE.MP4:
    case MIMETYPE.OGV:
    case MIMETYPE.QUICKTIME:
    case MIMETYPE.WEBM:
      if (!preview) {
        // srcUrl = getInfuraUrl(path)
        if (!isDetailed) {
          // if (metadata.tokenInfo) {
          //   url = `${DEFAULT_IPFS_GATEWAY}${metadata.tokenInfo.displayUri.split('//')[1]}`
          // }
          // else if (metadata.displayUri) {
          //   url = `${DEFAULT_IPFS_GATEWAY}${metadata.displayUri.split('//')[1]}`
          // }
          if (metadata.tokenInfo) {
            srcUrl = displayUri
          }
          return (
            <Container interactive={interactive} halfscreen>
              <ImageComponent src={srcUrl} borderInfo={borderInfo} />
            </Container>
          )
        }
      }
      return (
        <Container interactive={interactive} nofullscreen>
          <VideoComponent src={srcUrl} borderInfo={borderInfo} />
        </Container>
      )
    /* 3D */
    case MIMETYPE.GLB:
    case MIMETYPE.GLTF:
      return (
        <Container interactive={interactive} borderInfo={borderInfo}>
          <GLBComponent src={srcUrl} />
        </Container>
      )
    /* AUDIO */
    case MIMETYPE.MP3:
    case MIMETYPE.OGA:
      if (!preview && !isDetailed) {
        // if (metadata.tokenInfo) {
        //   url = `${DEFAULT_IPFS_GATEWAY}${metadata.tokenInfo.displayUri.split('//')[1]}`
        // }
        // else if (metadata.displayUri) {
        //   url = `${DEFAULT_IPFS_GATEWAY}${metadata.displayUri.split('//')[1]}`
        // }
        if (metadata.tokenInfo) {
          srcUrl = displayUri
        }
        return (
          <Container interactive={interactive} halfscreen>
            <ImageComponent src={srcUrl} borderInfo={borderInfo} />
          </Container>
        )
      }
      return (
        <Container interactive={interactive}>
          <AudioComponent {...metadata} src={srcUrl} borderInfo={borderInfo} />
        </Container>
      )
    /* PDF */
    case MIMETYPE.PDF:
      if (!preview && !isDetailed) {
        // if (metadata.tokenInfo) {
        //   url = `${DEFAULT_IPFS_GATEWAY}${metadata.tokenInfo.displayUri.split('//')[1]}`
        // }
        // else if (metadata.displayUri) {
        //   url = `${DEFAULT_IPFS_GATEWAY}${metadata.displayUri.split('//')[1]}`
        // }
        if (metadata.tokenInfo) {
          srcUrl = displayUri
        }
        return (
          <Container interactive={interactive}>
            <ImageComponent src={srcUrl} borderInfo={borderInfo} />
          </Container>
        )
      }
      return (
        <Container interactive={interactive} borderInfo={borderInfo}>
          <PdfComponent src={srcUrl} fullscreen={fullscreen} />
        </Container>
      )
    default:
      return <UnknownComponent mimeType={mimeType} />
  }
}
