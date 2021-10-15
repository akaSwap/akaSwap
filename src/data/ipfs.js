import {
  IPFS_DIRECTORY_MIMETYPE,
  IPFS_DISPLAY_URI_BLACKCIRCLE,
  webUrl,
} from '../constants'

const createClient = require('ipfs-http-client')
const Buffer = require('buffer').Buffer
const axios = require('axios')
const readJsonLines = require('read-json-lines-sync').default
const { getCoverImagePathFromBuffer } = require('../utils/html')

const infuraUrl = 'https://ipfs.infura.io:5001'
const serverUrl = `https://${webUrl}/api/internal/ipfs/upload`

export const prepareFile = async ({
  name,
  description,
  tags,
  frameColor,
  addressList,
  buffer,
  mimeType,
  cover,
  thumbnail,
  generateDisplayUri,
}) => {
  const ipfs = createClient(infuraUrl)
  // const ipfs = createClient(ipfsUrl)

  // upload main file
  const [info,] = await Promise.all([
    await ipfs.add(buffer),
    await uploadDataToServer(buffer),
  ])
  const hash = info.path
  const cid = `ipfs://${hash}`

  // upload cover image
  let displayUri = ''
  if (generateDisplayUri) {
    const [coverInfo,] = await Promise.all([
      await ipfs.add(cover.buffer),
      await uploadDataToServer(cover.buffer),
    ])
    const coverHash = coverInfo.path
    displayUri = `ipfs://${coverHash}`
  }

  // upload thumbnail image
  let thumbnailUri = IPFS_DISPLAY_URI_BLACKCIRCLE
  if (generateDisplayUri) {
    const [thumbnailInfo,] = await Promise.all([
      await ipfs.add(thumbnail.buffer),
      await uploadDataToServer(thumbnail.buffer),
    ])
    const thumbnailHash = thumbnailInfo.path
    thumbnailUri = `ipfs://${thumbnailHash}`
  }

  return await uploadMetadataFile({
    name,
    description,
    tags,
    frameColor,
    cid,
    addressList,
    mimeType,
    displayUri,
    thumbnailUri,
  })
}

export const prepareDirectory = async ({
  name,
  description,
  tags,
  frameColor,
  addressList,
  files,
  cover,
  thumbnail,
  generateDisplayUri,
}) => {
  // upload directory of files
  const hashes = await uploadFilesToDirectory(files)
  const cid = `ipfs://${hashes.directory}`

  // upload cover image
  const ipfs = createClient(infuraUrl)
  // const ipfs = createClient(ipfsUrl)

  let displayUri = ''
  if (generateDisplayUri) {
    const [coverInfo,] = await Promise.all([
      await ipfs.add(cover.buffer),
      await uploadDataToServer(cover.buffer),
    ])
    const coverHash = coverInfo.path
    displayUri = `ipfs://${coverHash}`
  } else if (hashes.cover) {
    // TODO: Remove this once generateDisplayUri option is gone
    displayUri = `ipfs://${hashes.cover}`
  }

  // upload thumbnail image
  let thumbnailUri = IPFS_DISPLAY_URI_BLACKCIRCLE
  if (generateDisplayUri) {
    const [thumbnailInfo,] = await Promise.all([
      await ipfs.add(thumbnail.buffer),
      await uploadDataToServer(thumbnail.buffer),
    ])
    const thumbnailHash = thumbnailInfo.path
    thumbnailUri = `ipfs://${thumbnailHash}`
  }

  return await uploadMetadataFile({
    name,
    description,
    tags,
    frameColor,
    cid,
    addressList,
    mimeType: IPFS_DIRECTORY_MIMETYPE,
    displayUri,
    thumbnailUri,
  })
}

export const prepareGachaBundle = async ({
  title,
  description,
  address
}) => {
  const ipfs = createClient(infuraUrl)
  // const ipfs = createClient(ipfsUrl)

  // // upload main file
  // const info = await ipfs.add(buffer)
  // const hash = info.path
  // const cid = `ipfs://${hash}`

  // // upload cover image
  // let displayUri = ''
  // if (generateDisplayUri) {
  //   const coverInfo = await ipfs.add(cover.buffer)
  //   const coverHash = coverInfo.path
  //   displayUri = `ipfs://${coverHash}`
  // }

  // // upload thumbnail image
  // let thumbnailUri = IPFS_DISPLAY_URI_BLACKCIRCLE
  // if (generateDisplayUri) {
  //   const thumbnailInfo = await ipfs.add(thumbnail.buffer)
  //   const thumbnailHash = thumbnailInfo.path
  //   thumbnailUri = `ipfs://${thumbnailHash}`
  // }

  const metadata = JSON.stringify({
    title,
    description,
    symbol: 'GachaBundle',
    creators: [address],
    decimals: 0,
    isBooleanAmount: false,
    shouldPreferSymbol: false,
  })
  const [res,] = await Promise.all([
    await ipfs.add(Buffer.from(metadata)),
    await uploadDataToServer(metadata),
  ])

  return res
}

export const prepareAuction = async ({
  title,
  description,
  address
}) => {
  const ipfs = createClient(infuraUrl)
  // const ipfs = createClient(ipfsUrl)

  const metadata = JSON.stringify({
    title,
    description,
    symbol: 'Auction',
    creators: [address],
    decimals: 0,
    isBooleanAmount: false,
    shouldPreferSymbol: false,
  })
  const [res,] = await Promise.all([
    await ipfs.add(Buffer.from(metadata)),
    await uploadDataToServer(metadata),
  ])

  return res
}

function not_directory(file) {
  return file.blob.type !== IPFS_DIRECTORY_MIMETYPE
}

async function uploadFilesToDirectory(files) {
  files = files.filter(not_directory)

  const form = new FormData()

  await Promise.all(files.map(async (file) => {
    form.append('file', file.blob, encodeURIComponent(file.path))
  }))
  const endpoint = `${infuraUrl}/api/v0/add?pin=true&recursive=true&wrap-with-directory=true`

  const [res,] = await Promise.all([
    axios.post(endpoint, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    axios.post(serverUrl, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  ])

  const data = readJsonLines(res.data)

  // TODO: Remove this once generateDisplayUri option is gone
  // get cover hash
  let cover = null
  const indexFile = files.find((f) => f.path === 'index.html')
  if (indexFile) {
    const indexBuffer = await indexFile.blob.arrayBuffer()
    const coverImagePath = getCoverImagePathFromBuffer(indexBuffer)

    if (coverImagePath) {
      const coverEntry = data.find((f) => f.Name === coverImagePath)
      if (coverEntry) {
        cover = coverEntry.Hash
      }
    }
  }

  const rootDir = data.find((e) => e.Name === '')

  const directory = rootDir.Hash

  return { directory, cover }
}

async function uploadMetadataFile({
  name,
  description,
  tags,
  frameColor,
  cid,
  addressList,
  mimeType,
  displayUri = '',
  thumbnailUri = IPFS_DISPLAY_URI_BLACKCIRCLE,
}) {
  const ipfs = createClient(infuraUrl)
  // const ipfs = createClient(ipfsUrl)

  const metadata = JSON.stringify({
    name,
    description,
    tags: tags.replace(/\s/g, '').split(','),
    frameColor,
    symbol: 'akaOBJ',
    artifactUri: cid,
    displayUri,
    thumbnailUri,
    creators: addressList,
    formats: [{ uri: cid, mimeType }],
    decimals: 0,
    isBooleanAmount: false,
    shouldPreferSymbol: false,
  })

  const [res,] = await Promise.all([
    await ipfs.add(Buffer.from(metadata)),
    await uploadDataToServer(metadata),
  ])

  return res
}

async function uploadDataToServer(data) {
  const form = new FormData()
  await form.append('file', new Blob([data]), '')
  await axios.post(serverUrl, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
