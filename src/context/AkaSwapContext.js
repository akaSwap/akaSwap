import React, { createContext, Component } from 'react'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit, OpKind, MichelsonMap } from '@taquito/taquito'
import { setItem } from '../utils/storage'
import {nodeUrl, networkType, dasabeeAddr} from '../constants'
import {auctionAddr, bundleAddr, gachaAddr, marketAddr, voteAddr, auctionFundAddr, minterAddr, DAOTokenAddr, nftContractAddr} from '../constants'
import { parseInt } from 'lodash'

// const { NetworkType } = require('@airgap/beacon-sdk')
var ls = require('local-storage')
const axios = require('axios')

export const AkaSwapContext = createContext()

// This should be moved to a service so it is only done once on page load
// const Tezos = new TezosToolkit('https://mainnet.smartpy.io')
// const wallet = new BeaconWallet({
//   name: 'akaswap.com',
//   preferredNetwork: 'mainnet',
// })



const Tezos = new TezosToolkit(nodeUrl)
const wallet = new BeaconWallet({
  name: 'akaSwap',
})
Tezos.setProvider({config: {confirmationPollingIntervalSecond: 5}})
Tezos.setWalletProvider(wallet)

export default class AkaSwapContextProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // fullscreen. DO NOT CHANGE!
      fullscreen: false,
      setFullscreen: (fullscreen) => this.setState({ fullscreen }),

      // theme, DO NO CHANGE!
      theme: 'light',
      setTheme: (theme) => {
        let root = document.documentElement

        const light = theme === 'light'

        setItem('theme', light ? 'light' : 'dark')

        root.style.setProperty(
          '--background-color',
          light ? '#ffffff' : '#202124'
        )
        root.style.setProperty(
          '--dropdown-color',
          light ? '#bcbcbd' : '#636466'
        )
        root.style.setProperty('--text-color', light ? '#202124' : '#dedede')
        root.style.setProperty(
          '--border-color',
          light ? 'rgba(32,33,36,0.3)' : 'rgba(255,255,255,0.3)'
        )
        root.className=light?'light':'dark';
        this.setState({ theme })
      },

      getTheme: () => {
        return this.state.theme
      },

      pathname: '',

      address: '',

      op: undefined,

      contract: '',

      setAddress: (address) => this.setState({ address: address }),

      setAuth: (address) => {
        ls.set('auth', address)
      },

      updateLs: (key, value) => {
        ls.set(key, value)
      },

      getLs: (key) => {
        return ls.get(key)
      },

      getAuth: () => {
        return ls.get('auth')
      },

      client: null,

      setClient: (client) => {
        this.setState({
          client: client,
        })
      },

      dAppClient: async () => {
        this.state.client = wallet.client

        // It doesn't look like this code is called, otherwise the active account should be checked, see below.
        this.state.client
          .requestPermissions({
            network: {
              // type: NetworkType.MAINNET,
              // rpcUrl: 'https://mainnet.smartpy.io',
              type: networkType,
              rpcUrl: nodeUrl,
            },
          })
          .then((permissions) => {
            this.setState({
              address: permissions.address,
            })

            this.state.setAuth(permissions.address)
          })
          .catch((error) => console.log(error))
      },
      
      mint: async (tz, amount, cid, royalties) => {
        const royaltiesMap = new MichelsonMap();
        royalties.forEach((value, key)=>{
          royaltiesMap.set(key,value)
        })
        return new Promise((resolve, reject) => {
          Tezos.wallet
            .at(minterAddr)
            .then((c) =>
              c.methods
                .mint_akaOBJ(
                  tz,
                  parseFloat(amount),
                  ('ipfs://' + cid)
                    .split('')
                    .reduce(
                      (hex, c) =>
                        (hex += c.charCodeAt(0).toString(16).padStart(2, '0')),
                      ''
                    ),
                  royaltiesMap
                )
                .send({ amount: 0 })
            )
            .then((op) =>
              op.confirmation(1).then(() => {
                resolve(op)
                this.setState({ op: op.hash })
              })
            )
            .catch((err) => {
              reject(err)
            })
        })
      },
      
      collect: async (akaObj_amount, swap_id, amount, akaOBJ_id) => {

        let c_market = await Tezos.wallet.at(marketAddr)
        let c1 = c_market.methods.acquire_royalties(parseInt(akaOBJ_id)).toTransferParams()
        c1.amount = 0
        c1.mutez = true
        let c2 = c_market.methods.collect(parseInt(akaObj_amount),parseInt(swap_id)).toTransferParams()
        c2.amount = parseFloat(amount)
        c2.mutez = true
        return await Tezos.wallet.batch([
            {
              kind: OpKind.TRANSACTION, 
              ...c1,
            },
            {
              kind: OpKind.TRANSACTION, 
              ...c2,
            },
          ])
          .send()
      },
      
      swap: async (akaObj_amount, akaObj_id, xtz_per_akaObj, revenueShareMap=null) => {
        
        var tz = await wallet.client.getActiveAccount()
        const revenueShareMMap = new MichelsonMap();
        if(revenueShareMap){
          revenueShareMap.forEach((value, key)=>{
            revenueShareMMap.set(key,value)
          })
        }
        else
          revenueShareMMap.set(tz.address, 1000)

        return await Tezos.wallet
          .at(marketAddr)
          .then((c) =>
            c.methods
            .swap(
              parseInt(akaObj_amount),
              parseInt(akaObj_id),
              revenueShareMMap,
              parseFloat(xtz_per_akaObj)
            )
            .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      cancelSwap: async (swap_id) => {
        return await Tezos.wallet
          .at(marketAddr)
          .then((c) =>
            c.methods.cancel_swap(parseFloat(swap_id)).send({ amount: 0 })
          )
          .catch((e) => e)
      },

      reSwap: async (swap_id, akaObj_amount, akaObj_id, xtz_per_akaObj, revenueShareMap=null) => {
        
        var tz = await wallet.client.getActiveAccount()
        const revenueShareMMap = new MichelsonMap();
        if(revenueShareMap){
          revenueShareMap.forEach((value, key)=>{
            revenueShareMMap.set(key,value)
          })
        }
        else
          revenueShareMMap.set(tz.address, 1000)

        let c_market = await Tezos.wallet.at(marketAddr)

        return await Tezos.wallet.batch()
          .withContractCall(c_market.methods.cancel_swap(parseFloat(swap_id)))
          .withContractCall(c_market.methods.swap(
            parseInt(akaObj_amount),
            parseInt(akaObj_id),
            revenueShareMMap,
            parseFloat(xtz_per_akaObj)
          ))
      },

      makeGacha: async(duration, prizeMap, issue_time=new Date(), lastPrizeID, xtz_per_gacha, metadata) =>{

        const prizeMMap = new MichelsonMap();
        prizeMap.forEach(function(value, key) {
          prizeMMap.set(parseInt(key), {"remains":parseInt(value), "total":parseInt(value)})
        })

        return await Tezos.wallet
          .at(gachaAddr)
          .then((c) =>
            c.methods
            .make_gacha(
              parseInt(duration),
              prizeMMap,
              issue_time.toISOString(),
              parseInt(lastPrizeID),
              metadata,
              parseFloat(xtz_per_gacha)
            )
            .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      collectGacha: async (gacha_amount, gacha_id, amount) => {
        return await Tezos.wallet
          .at(gachaAddr)
          .then((c) =>
            c.methods
              .play_gacha(parseFloat(gacha_amount), parseFloat(gacha_id))
              .send({ amount: parseFloat(amount), mutez: true })
          )
          .catch((e) => e)
      },

      cancelGacha: async (gacha_id) =>{
        return await Tezos.wallet
          .at(gachaAddr)
          .then((c) =>
            c.methods
              .cancel_gacha(parseFloat(gacha_id))
              .send({ amount: 0 })
          )
          .catch((e) => e)
      },
      
      makeBundle: async(bundleAmount, imageMap, xtz_per_bundle, metadata) =>{
        
        const imageMMap = new MichelsonMap();
        imageMap.forEach(function(value, key) {
          imageMMap.set(parseInt(key), parseInt(value))
        })
        
        return await Tezos.wallet
          .at(bundleAddr)
          .then((c) =>
            c.methods
            .make_bundle(
              parseInt(bundleAmount),
              imageMMap,
              metadata,
              parseFloat(xtz_per_bundle)
            )
            .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      collectBundle: async (bundle_amount, bundle_id, amount) => {
        return await Tezos.wallet
          .at(bundleAddr)
          .then((c) =>
            c.methods
              .collect_bundle(parseFloat(bundle_amount), parseFloat(bundle_id))
              .send({ amount: parseFloat(amount), mutez: true })
          )
          .catch((e) => e)
      },

      cancelBundle: async (bundle_id) =>{
        return await Tezos.wallet
          .at(bundleAddr)
          .then((c) =>
            c.methods
              .cancel_bundle(parseFloat(bundle_id))
              .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      makeAuction: async(akaObjId, duration, directPrice, metadata, raisePercentage, startPrice) =>{

        return await Tezos.wallet
          .at(auctionAddr)
          .then((c) =>
            c.methods
            .make_auction(
              parseInt(akaObjId),
              parseInt(duration),
              parseFloat(directPrice),
              metadata,
              parseFloat(raisePercentage),
              parseFloat(startPrice)
            )
            .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      directPurchase: async(auctionId, amount, akaOBJ_id) =>{

        let c_auctionFund = await Tezos.wallet.at(auctionFundAddr)
        let c_auction = await Tezos.wallet.at(auctionAddr)
        let c1 = c_auctionFund.methods.acquire_royalties(parseInt(akaOBJ_id)).toTransferParams()
        c1.amount = 0
        c1.mutez = true
        let c2 = c_auction.methods.direct_purchase(parseInt(auctionId)).toTransferParams()
        c2.amount = parseFloat(amount)
        c2.mutez = true
        return await Tezos.wallet.batch([
            {
              kind: OpKind.TRANSACTION, 
              ...c1,
            },
            {
              kind: OpKind.TRANSACTION, 
              ...c2,
            },
          ])
          .send()
      },

      bidAll: async(auctionId, bidAmount, akaOBJ_id) =>{
        // return await Tezos.wallet
        //   .at(auctionAddr)
        //   .then((c) =>
        //     c.methods
        //       .bid_all(
        //         parseInt(auctionId)
        //       )
        //       .send({ amount: parseFloat(bidAmount), mutez: true })
        //   )
        //   .catch((e) => e)
        let c_auctionFund = await Tezos.wallet.at(auctionFundAddr)
        let c_auction = await Tezos.wallet.at(auctionAddr)
        let c1 = c_auctionFund.methods.acquire_royalties(parseInt(akaOBJ_id)).toTransferParams()
        c1.amount = 0
        c1.mutez = true
        let c2 = c_auction.methods.bid_all(parseInt(auctionId)).toTransferParams()
        c2.amount = parseFloat(bidAmount)
        c2.mutez = true
        return await Tezos.wallet.batch([
            {
              kind: OpKind.TRANSACTION, 
              ...c1,
            },
            {
              kind: OpKind.TRANSACTION, 
              ...c2,
            },
          ])
          .send()
      },

      bidTenPercent: async(auctionId, bidPrice, bidAmount, akaOBJ_id) =>{

        let c_auctionFund = await Tezos.wallet.at(auctionFundAddr)
        let c_auction = await Tezos.wallet.at(auctionAddr)
        let c1 = c_auctionFund.methods.acquire_royalties(parseInt(akaOBJ_id)).toTransferParams()
        c1.amount = 0
        c1.mutez = true
        let c2 = c_auction.methods.bid_ten_percent(parseInt(auctionId),parseFloat(bidPrice)).toTransferParams()
        c2.amount = parseFloat(bidAmount)
        c2.mutez = true
        return await Tezos.wallet.batch([
            {
              kind: OpKind.TRANSACTION, 
              ...c1,
            },
            {
              kind: OpKind.TRANSACTION, 
              ...c2,
            },
          ])
          .send()
      },

      fillBid: async(auctionId, fillBidAmount) =>{
        return await Tezos.wallet
          .at(auctionAddr)
          .then((c) =>
            c.methods
              .fill_bid(
                parseInt(auctionId)
              )
              .send({ amount: parseFloat(fillBidAmount), mutez: true })
          )
          .catch((e) => e)
      },

      closeAuction: async(auctionId) =>{
        return await Tezos.wallet
          .at(auctionAddr)
          .then((c) =>
            c.methods
              .close_auction(
                parseInt(auctionId)
              )
              .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      failCloseAuction: async(auctionId) =>{
        return await Tezos.wallet
          .at(auctionAddr)
          .then((c) =>
            c.methods
              .fail_close_auction(
                parseInt(auctionId)
              )
              .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      cancelAuction: async(auctionId) =>{
        return await Tezos.wallet
          .at(auctionAddr)
          .then((c) =>
            c.methods
              .cancel_auction(
                parseInt(auctionId)
              )
              .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      oracleGacha: async (numberList) => {
        const numberMap = new MichelsonMap();
        numberList.forEach((value, key)=>{
          numberMap.set(key,value)
        })
        return await Tezos.wallet
          .at(gachaAddr)
          .then((c) =>
            c.methods
              .oracle_gacha(
                numberMap
              )
              .send({ amount: 0 })
          )
          .catch((e) => e)
      },
      
      DaSaBee: async (addressMap, amount) => {
        var allitems = []
        var count = 0
        addressMap.forEach(function(value, key) {
          allitems.push(value)
          count += 1
        })
        return await Tezos.wallet
          .at(dasabeeAddr)
          .then((c) =>
            c.methods
              .default(
                allitems,
                amount
              )
              .send({ amount: parseFloat(amount*count), mutez: true })
          )
          .catch((e) => e)
      },
      DaSaDao: async (addressMap, amount) => {
        
        var tz = await wallet.client.getActiveAccount()

        var alltxs = []
        addressMap.forEach(function(value, key) {
          alltxs.push({
            to_: value,
            token_id: parseInt(0),
            amount: parseInt(amount)
          })
        })
        return await Tezos.wallet
          .at(DAOTokenAddr)
          .then((c) =>
            c.methods
              .transfer([
                {
                  from_: tz.address,
                  txs: alltxs,
                },
              ])
              .send({ amount: 0 })
          )
          .catch((e) => e)

      },
      DaSaObj: async (addressMap, amount, tokenId) => {
        
        var tz = await wallet.client.getActiveAccount()

        var alltxs = []
        addressMap.forEach(function(value, key) {
          alltxs.push({
            to_: value,
            token_id: parseInt(tokenId),
            amount: parseInt(amount)
          })
        })
        return await Tezos.wallet
          .at(nftContractAddr)
          .then((c) =>
            c.methods
              .transfer([
                {
                  from_: tz.address,
                  txs: alltxs,
                },
              ])
              .send({ amount: 0 })
              .then((op) =>{
                console.log("Hash : " + op.opHash)
                op.confirmation()
                  .then((result) => {
                    if (result.completed) {
                      console.log('Transaction correctly processed!');
                    } else {
                      console.log('An error has occurred');
                    }
                  })
              })
          )
          .catch((e) => e)

      },

      vote: async (akaObj_id, issuer) => {
        
        return await Tezos.wallet
          .at(voteAddr)
          .then((c) =>
            c.methods
              .vote(
                parseInt(akaObj_id),
                issuer
              )
              .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      claim_akaDAO: async (akaDAO_amount, akaObj_id) => {
        await Tezos.wallet
          .at(voteAddr)
          .then((c) => {
            c.methods
              .claim_akaDAO(parseInt(akaDAO_amount), parseInt(akaObj_id))
              .send()
          })
      },

      burn: async (akaObj_id, amount) => {
        var tz = await wallet.client.getActiveAccount()

        await Tezos.wallet
          .at(nftContractAddr)
          .then(async (c) =>
            c.methods
              .transfer([
                {
                  from_: tz.address,
                  txs: [
                    {
                      to_: 'tz1burnburnburnburnburnburnburjAYjjX',
                      token_id: parseInt(akaObj_id),
                      amount: parseInt(amount),
                    },
                  ],
                },
              ])
              .send()
          )
      },

      setMarketPause: async (pause) => {
        let c_minter = await Tezos.wallet.at(minterAddr)
        let c_gacha = await Tezos.wallet.at(gachaAddr)
        let c_auction = await Tezos.wallet.at(auctionAddr)
        await Tezos.wallet.batch()
          .withContractCall(c_minter.methods.set_pause(pause))
          .withContractCall(c_gacha.methods.set_gacha_pause(pause))
          .withContractCall(c_auction.methods.set_auction_pause(pause))
          .send()
      },

      setLowestPrice: async (price) => {
        let tezPrice = parseInt(price)
        let c_market = await Tezos.wallet.at(marketAddr)
        let c_gacha = await Tezos.wallet.at(gachaAddr)
        let c_bundle = await Tezos.wallet.at(bundleAddr)
        let c_auction = await Tezos.wallet.at(auctionAddr)
        await Tezos.wallet.batch()
          .withContractCall(c_market.methods.set_lowest_price(tezPrice))
          .withContractCall(c_gacha.methods.set_lowest_price(tezPrice))
          .withContractCall(c_bundle.methods.set_lowest_price(tezPrice))
          .withContractCall(c_auction.methods.set_lowest_price(tezPrice))
          .send()
      },
      
      updateManagementFee: async (fee) => {
        let manageFee = parseInt(fee)
        let c_market = await Tezos.wallet.at(marketAddr)
        let c_gacha = await Tezos.wallet.at(gachaAddr)
        let c_bundle = await Tezos.wallet.at(bundleAddr)
        let c_auction = await Tezos.wallet.at(auctionAddr)
        let c_auctionFund = await Tezos.wallet.at(auctionFundAddr)
        await Tezos.wallet.batch()
          .withContractCall(c_market.methods.update_management_fee(manageFee))
          .withContractCall(c_gacha.methods.update_management_fee(manageFee))
          .withContractCall(c_bundle.methods.update_management_fee(manageFee))
          .withContractCall(c_auction.methods.update_management_fee(manageFee))
          .withContractCall(c_auctionFund.methods.update_management_fee(manageFee))
          .send()
      },

      load: false,
      loading: () => this.setState({ load: !this.state.load }),
      /* taquito */
      Tezos: null,
      wallet: null,
      acc: null,

      updateMessage: (message) => this.setState({ message: message }),

      setAccount: async () => {
        this.setState({
          acc:
            Tezos !== undefined
              ? await wallet.client.getActiveAccount()
              : undefined,
          address: await wallet.client.getActiveAccount(),
        })
      },

      syncTaquito: async () => {
        const network = {
          // type: 'mainnet',
          // rpcUrl: 'https://mainnet-tezos.giganode.io',
          // rpcUrl: 'https://mainnet.smartpy.io',
          type: networkType,
          rpcUrl: nodeUrl,
        }

        // We check the storage and only do a permission request if we don't have an active account yet
        // This piece of code should be called on startup to "load" the current address from the user
        // If the activeAccount is present, no "permission request" is required again, unless the user "disconnects" first.
        let activeAccount = await wallet.client.getActiveAccount()
        console.log(activeAccount)
        if (activeAccount === undefined) {
          console.log('permissions')
          await wallet.clearActiveAccount()
          console.log('after clear')
          await wallet.requestPermissions({ network })
          .then((response) => {
            console.log(response)
          })
          .catch((e) => console.error(e))
        }
        this.setState({
          Tezos: Tezos,
          address: await wallet.getPKH(),
          acc: await wallet.client.getActiveAccount(),
          wallet,
        })
        this.state.setAuth(await wallet.getPKH())
        console.log(this.state)
      },

      disconnect: async () => {
        console.log('disconnect wallet')
        // This will clear the active account and the next "syncTaquito" will trigger a new sync
        await wallet.client.clearActiveAccount()
        this.setState({
          address: undefined,
          acc: undefined,
        })
      },

      /* 
                airgap/thanos interop methods
            */
      operationRequest: async (obj) => {
        var op = obj.result
        delete op.mutez
        op.destination = op.to
        op.kind = 'transaction'
        delete op.to
        console.log(obj.result)

        this.state.client.requestOperation({
          operationDetails: [obj.result],
        })
      },

      timeout: (delay) => {
        return new Promise((res) => setTimeout(res, delay))
      },

      signPayload: async (obj) => {
        await wallet.client
          .requestSignPayload({
            payload: obj.payload,
          })
          .then(async (response) => {
            return response.signature
          })
          .catch((signPayloadError) => console.error(signPayloadError))
      },

      balance: 0,

      getBalance: (address) => {
        axios
          // .get(`https://api.tzkt.io/v1/accounts/${address}/balance_history`, {
          .get(`http://143.198.78.181:8000/sandboxnet/${address}/metadata`, {
            params: {
              address: address,
            },
          })
          .then((res) => {
            console.log(
              'balance',
              parseFloat(res.data[res.data.length - 1].balance / 1000000)
            )
          })
          .catch((e) => console.log('balance error', e))
      },

      collapsed: true,

      toogleNavbar: () => {
        this.setState({ collapsed: !this.state.collapsed })
      },

      setMenu: (collapsed) => {
        this.setState({ collapsed })
      },

      setIsGacha: (isGacha) => {
        this.setState({ isGacha })
      },

      getStyle: (style) =>
        style ? { background: 'white' } : { display: 'none' },

      lastPath: '',

      setPath: (path) => {
        this.setState({
          lastPath: path,
        })
      },
      title: '',
      setTitle: (title) => {
        this.setState({
          title: title,
        })
      }
      // ,
      // alias: '',
      // setAlias: (name) => {
      //   this.setState({
      //     alias: name,
      //   })
      // }
      // fetchAlias: () => {
      //   var tz = await wallet.client.getActiveAccount()
      //   await GetUserMetadata(tz.address).then((data) => {
      //     if (data.data.alias) {
      //       this.setState({
      //         alias: data.data.alias,
      //       })
      //     }
      //     else{
      //       this.setState({
      //         alias: '',
      //       })
      //     }
      //   })
        
      // }
    }
  }

  render() {
    return (
      <AkaSwapContext.Provider
        value={{
          ...this.state,
        }}
      >
        {this.props.children}
      </AkaSwapContext.Provider>
    )
  }
}
