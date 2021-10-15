import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Compressor from 'compressorjs'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { TITLE_LIMIT, DESCRIPTION_LIMIT, ROYALTIES_SHARER_LIMIT, getLanguage } from '../../constants'
import { Page, Container, Padding } from '../../components/layout'
import { Input, CheckBox, Color, WideNumber, Textarea } from '../../components/input'
import { Button, Curate, Purchase } from '../../components/button'
import { Loading } from '../../components/loading'
import { Sharer } from '../../components/sharer'
import { Upload } from '../../components/upload'
import { Hint } from '../../components/hint'
import { Preview } from '../../components/preview'
import { prepareFile, prepareDirectory } from '../../data/ipfs'
import { GetUserMetadata } from '../../data/api'
import { prepareFilesFromZIP } from '../../utils/html'
import styles from './styles.module.scss'
import {
  ALLOWED_MIMETYPES,
  ALLOWED_FILETYPES_LABEL,
  ALLOWED_COVER_MIMETYPES,
  ALLOWED_COVER_FILETYPES_LABEL,
  MINT_FILESIZE,
  MIMETYPE,
  PATH,
} from '../../constants'
import { InputForm } from '../../components/input-form'

const coverOptions = {
  quality: 0.85,
  maxWidth: 1024,
  maxHeight: 1024,
}

const thumbnailOptions = {
  quality: 0.85,
  maxWidth: 350,
  maxHeight: 350,
}

// @crzypathwork change to "true" to activate displayUri and thumbnailUri
const GENERATE_DISPLAY_AND_THUMBNAIL = true

export const Mint = () => {
  const { mint, getAuth, syncTaquito, acc, setAccount } = useContext(AkaSwapContext)
  const language = getLanguage()
  const history = useHistory()
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  // const [alias, setAlias] = useState('')
  const [upload, setUpload] = useState(language.mint.label.upload)
  const [uploadcover, setUploadcover] = useState(language.mint.label.uploadcover)
  const [description, setDescription] = useState([])
  const [tagClicked, setTagClicked] = useState(false)
  const [tags, setTags] = useState('')
  const [amount, setAmount] = useState()
  const [royalties, setRoyalties] = useState()
  const [useRoyaltiesShare, setUseRoyaltiesShare] = useState()
  const [useFrame, setUseFrame] = useState()
  const [frameColor, setFrameColor] = useState()
  const [file, setFile] = useState() // the uploaded file
  const [cover, setCover] = useState() // the uploaded or generated cover image
  const [thumbnail, setThumbnail] = useState() // the uploaded or generated cover image
  const [message, setMessage] = useState('')
  const [needsCover, setNeedsCover] = useState(false)
  const [royaltiesSharers, setRoyaltiesSharer] = useState([{
    id: 0,
    address: 'Owner',
    share: 100
  }])

  useEffect(() => {
    if (acc === null) {
      syncTaquito().catch()
    }
  })


  const handleMint = async () => {
    if (acc === null) {
      syncTaquito().catch()
      return;
    }

    setAccount().catch()
    if (!acc) {
      alert('sync')
      return
    }

    // check mime type
    if (ALLOWED_MIMETYPES.indexOf(file.mimeType) === -1) {
      alert(
        `File format invalid. supported formats include: ${ALLOWED_FILETYPES_LABEL.toLocaleLowerCase()}`
      )
      return
    }

    // check file size
    const filesize = (file.file.size / 1024 / 1024).toFixed(4)
    if (filesize > MINT_FILESIZE) {
      alert(
        `File too big (${filesize}). Limit is currently set at ${MINT_FILESIZE}MB`
      )
      return
    }


    // file about to be minted, change to the mint screen

    setStep(2)

    var royaltiesMap = new Map()
    var rytRemains = Math.round(royalties * 10)
    var creatorList = [acc.address]
    // royaltiesSharers
    for (var i = 0; i < royaltiesSharers.length; i++) {
      if (royaltiesSharers[i].address === 'Owner')
        continue;
      var ryt = Math.floor(royalties * royaltiesSharers[i].share / 10)
      rytRemains -= ryt
      royaltiesMap.set(royaltiesSharers[i].address, ryt)
      creatorList.push(royaltiesSharers[i].address)
    }
    royaltiesMap.set(acc.address, rytRemains)



    // upload file(s)
    let nftCid
    if ([MIMETYPE.ZIP, MIMETYPE.ZIP1, MIMETYPE.ZIP2].includes(file.mimeType)) {
      const files = await prepareFilesFromZIP(file.buffer)

      nftCid = await prepareDirectory({
        name: title,
        description,
        tags,
        frameColor,
        addressList: creatorList,
        files,
        cover,
        thumbnail,
        generateDisplayUri: GENERATE_DISPLAY_AND_THUMBNAIL,
      })
    } else {
      // process all other files
      nftCid = await prepareFile({
        name: title,
        description,
        tags,
        frameColor,
        addressList: creatorList,
        buffer: file.buffer,
        mimeType: file.mimeType,
        cover,
        thumbnail,
        generateDisplayUri: GENERATE_DISPLAY_AND_THUMBNAIL,
      })
    }

    mint(getAuth(), amount, nftCid.path, royaltiesMap)
      .then((e) => {
        console.log('mint confirm', e)
        setMessage('Minted successfully')
        // redirect here
        history.push(PATH.FEED)
      })
      .catch((e) => {
        console.log('mint error', e)
        alert('an error occurred')
        setMessage('an error occurred')
      })

  }

  const handlePreview = () => {

    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    setStep(1)
  }

  const handleFileUpload = async (props) => {
    setFile(props)
    console.log("MIME" + props.mimeType)
    if (GENERATE_DISPLAY_AND_THUMBNAIL) {
      if (props.mimeType.indexOf('image') === 0) {
        setNeedsCover(false)
        const cover = await generateCompressedImage(props, coverOptions)
        setCover(cover)
        const thumb = await generateCompressedImage(props, thumbnailOptions)
        setThumbnail(thumb)
      } else {
        setNeedsCover(true)
      }
    }
    setUpload(props.file.name)
  }

  const generateCompressedImage = async (props, options) => {
    const blob = await compressImage(props.file, options)
    const mimeType = blob.type
    const buffer = await blob.arrayBuffer()
    const reader = await blobToDataURL(blob)
    return { mimeType, buffer, reader }
  }

  const compressImage = (file, options) => {
    return new Promise(async (resolve, reject) => {
      new Compressor(file, {
        ...options,
        success(blob) {
          resolve(blob)
        },
        error(err) {
          reject(err)
        },
      })
    })
  }

  const blobToDataURL = async (blob) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onerror = reject
      reader.onload = (e) => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  const handleCoverUpload = async (props) => {

    var cover;
    setCover(null)
    setThumbnail(null)
    if ([MIMETYPE.GIF].includes(props.mimeType)) {
      cover = props
    }
    else if ([MIMETYPE.JPEG, MIMETYPE.PNG].includes(props.mimeType)) {
      cover = await generateCompressedImage(props, coverOptions)
    }
    else {
      alert(`Cover file format invalid. supported formats include: gif, jpeg, png`)
      return
    }
    setCover(cover)

    const thumb = await generateCompressedImage(props, thumbnailOptions)
    setThumbnail(thumb)

    setUploadcover(props.file.name)
  }

  const handleValidation = () => {

    if (
      title === "" || description === "" || !file ||
      amount <= 0 || amount % 1 !== 0 || amount > 10000 || !royalties ||
      royalties < 10 || royalties > 25) {
      return true;
    }
    if (royalties && royalties.toString().length > 4) {
      return true;
    }
    if (useRoyaltiesShare) {
      var totalShare = 0;
      for (var i = 0; i < royaltiesSharers.length; i++) {
        if (royaltiesSharers[i].share && royaltiesSharers[i].share.length > 3) return true;
        var share = parseInt(royaltiesSharers[i].share)
        if (share <= 0) return true;
        if (!royaltiesSharers[i].address) return true;
        totalShare += share;
      }
      if (totalShare !== 100) return true;
    }
    if (GENERATE_DISPLAY_AND_THUMBNAIL) {
      if (!cover || !thumbnail) {
        return true;
      }
    }
    return false
  }




  return (
    <Page title="Mint">
      <Container small>
        <Padding>
          <div className={styles.square}>
            <div>
              {step === 0 && (
                <>
                  <Container full>
                    <Padding>
                      <Upload
                        label={upload}
                        allowedTypesLabel={ALLOWED_FILETYPES_LABEL}
                        onChange={
                          handleFileUpload
                        }
                      />
                    </Padding>
                  </Container>

                  {file && needsCover && (
                    <Container full>
                      <Padding>
                        <Upload
                          label={uploadcover}
                          allowedTypes={ALLOWED_COVER_MIMETYPES}
                          allowedTypesLabel={ALLOWED_COVER_FILETYPES_LABEL}
                          onChange={handleCoverUpload}
                        />
                      </Padding>
                    </Container>
                  )}
                  {/* <InputForm /> */}
                  <InputForm>
                    <Input
                      //title
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={(language.mint.placeholder.title).replace("%LIMIT%", TITLE_LIMIT)}
                      label={language.mint.label.title + "*"}
                      maxlength={TITLE_LIMIT}
                      value={title}
                    />
                    <Textarea
                      //description
                      type="textarea"
                      style={{ whiteSpace: 'pre' }}
                      onChange={(e) => {
                        setDescription(e.target.value)
                      }}
                      placeholder={(language.mint.placeholder.description).replace("%LIMIT%", DESCRIPTION_LIMIT)}
                      label={language.mint.label.description + "*"}
                      maxlength={DESCRIPTION_LIMIT}
                      value={description}
                    />

                    <Input
                      //tag
                      type="text"
                      onFocus={(e) => {
                        if (!tagClicked) {
                          GetUserMetadata(acc.address).then((data) => {
                            if (data.data.alias) {
                              console.log("Username : " + data.data.alias)
                              e.target.value = data.data.alias + ', '
                            }
                            else {
                              console.log("No Username")
                            }
                          })

                          // if(alias !== '')
                          //   e.target.value = alias + ', '
                          setTagClicked(true)
                        }
                      }}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder={language.mint.placeholder.tags}
                      label={language.mint.label.tags}
                      value={tags}
                    />

                    <WideNumber
                      //mint amount
                      type="number"
                      min={1}
                      max={10000}
                      step={1}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={language.mint.placeholder.amount}
                      label={language.mint.label.amount + "*"}
                      value={amount}
                    />

                    <WideNumber
                      // royalties
                      type="number"
                      min={10}
                      max={25}
                      step={1}
                      onChange={(e) => {
                        setRoyalties(e.target.value)
                      }}
                      placeholder={language.mint.placeholder.royalties}
                      label={language.mint.label.royalties + "(10-25%)*"}
                      value={royalties}
                    />

                    <CheckBox
                      // royalties share
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          let array = [{
                            id: 0,
                            address: 'Owner',
                            share: 100
                          }]
                          setRoyaltiesSharer(array)
                        }
                        setUseRoyaltiesShare(e.target.checked)
                      }}
                      label={(
                        <>
                          {language.mint.label.useRoyaltiesShare}
                          <Hint hoverMessage={language.mint.label.royaltyShareInfo} />
                        </>)
                      }
                      value={useRoyaltiesShare}
                      checked={useRoyaltiesShare}
                    />
                    <br />
                    {
                      useRoyaltiesShare &&
                      <Sharer
                        type="RoyaltiesShare"
                        sharers={royaltiesSharers}
                        maxSharer={ROYALTIES_SHARER_LIMIT}
                        handleSetSharer={setRoyaltiesSharer}
                      />
                    }
                    <CheckBox
                      type="checkbox"
                      onChange={(e) => {
                        setUseFrame(e.target.checked)
                        setFrameColor(e.target.checked ? "#202125" : null)
                      }}
                      label={language.mint.label.useFrame}
                      value={useFrame}
                      checked={useFrame}
                    />
                    {useFrame && (
                      <Color
                        type="color"
                        onChange={(e) => { setFrameColor(e.target.value) }}
                        placeholder="color of the frame"
                        label={language.mint.label.frameColor}
                        value={frameColor}
                      />
                    )}
                  </InputForm>


                  <Container full>
                    <Padding >
                      <Button onClick={handlePreview} fit disabled={handleValidation()}>
                        <Curate>{language.mint.label.preview}</Curate>
                      </Button>
                    </Padding>
                  </Container>
                </>
              )}
              {step === 1 && (
                <>
                  <Container full>
                    <Padding>
                      <div style={{ display: 'flex' }}>
                        <Button onClick={() => setStep(0)} fit>
                          <Purchase>
                            <strong>{language.mint.label.back}</strong>
                          </Purchase>
                        </Button>
                      </div>
                    </Padding>
                  </Container>

                  <Container full>
                    <Padding>
                      <Preview
                        mimeType={file.mimeType}
                        uri={file.reader}
                        title={title}
                        description={description}
                        tags={tags}
                        frameColor={frameColor}
                      />
                    </Padding>
                  </Container>

                  <Container full>
                    <Padding>
                      <Button onClick={handleMint} fit>
                        <Curate>{language.mint.label.mint}<br></br> {amount} akaOBJs</Curate>
                      </Button>
                    </Padding>
                  </Container>

                  <Container full>
                    <Padding>
                      <p>{language.mint.label.warning[0]}</p>
                      <p>{(language.mint.label.warning[1]).replace("%royalty%", royalties)}</p>
                    </Padding>
                  </Container>
                </>
              )}

              {step === 2 && (
                <>
                  <Container full>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        height: 'calc(100vh - 200px)',
                      }}
                    >
                      {language.mint.loading}
                      <Loading top='60%' />
                    </div>
                  </Container>

                  {message && (
                    <Container full>
                      <Padding>
                        <p>{message}</p>
                      </Padding>
                    </Container>
                  )}
                </>
              )}
            </div>
          </div>
        </Padding>
      </Container>
    </Page>
  )
}
