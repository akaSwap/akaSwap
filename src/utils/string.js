
// import { GetUserName } from '../data/api'

export const walletPreview = (wallet) => {
  try {

    return `${wallet.slice(0, 5)}...${wallet.slice(
      wallet.length - 5,
      wallet.length
    )}`
  } catch (e) {
    return ''
  }
}

export const showWallet = ({wallet, alias = "", full = false}) => {
  try {
    if(alias !== "")
      return alias;
    else if (!full) {
      return `${wallet.slice(0, 5)}...${wallet.slice(
        wallet.length - 5,
        wallet.length
      )}`
    }
    else
      return wallet
  } catch (e) {
    return ''
  }
}

export const limitLength = (string, length = 10) => {
  if (string.length > length) {
    try {
      return `${string.slice(0, length)}...`
    } catch (e) {
      return string
    }
  } else {
    return string;
  }
}