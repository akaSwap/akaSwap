import React, { Component } from 'react'
import { Switch } from "react-router-dom"
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import styles from './styles.module.scss'
import { Loading } from '../../components/loading'
import { SanitiseAkaObj } from '../../utils/sanitise'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { Input, Textarea } from '../../components/input'
import { prepareGachaBundle } from '../../data/ipfs'
import { getLanguage, MIN_SWAP_PRICE, DESCRIPTION_LIMIT, TITLE_LIMIT, BUNDLE_ITEM_LIMIT } from '../../constants'
import { AkaobjAmount, AkaobjChosen, AkaobjGrid } from '../../components/akaobj-choose'
import { InputForm } from '../../components/input-form'
// import { Route } from 'react-router-dom'
// import Intro from "./intro"
// import Choose from "./choose"

const axios = require('axios')

export default class MakeBundle extends Component {

  // constructor(props) {
  //   super(props)
  // }

  static contextType = AkaSwapContext

  state = {
    wallet: "",
    render: false,
    loading: true,
    akaObjs: [],
    amounts: [],
    remains: [],
    inputVals: [],
    chosenItemAmounts: [],
    chosenItemAmount: 0,
    title: "",
    description: [],
    price: 0,
    edition: 1,
    currentState: 0, // 0: intro, 1: choose, 2: edit information, 3: confirm loading
    page: 0,
    itemsPerPage: 12, // 4x3 grid
  }

  toMake = async () => {
    // if (this.context.acc == null) {
    //   this.props.history.replace('/makebundle')
    //   return
    // }
    if (this.context.acc == null) {
      this.context.syncTaquito().catch()
      return;
    }

    const currentWallet = this.context.acc.address
    if (this.state.wallet !== currentWallet) {
      this.setState({
        wallet: currentWallet
      })

      // this.props.history.replace(`/bd/choose/${this.context.acc.address}`)
    }
    await axios
      .get(`${process.env.REACT_APP_ACCOUNTS}/${currentWallet}/akaobjs`, {
        params: {
          withCollections: true
        }
      })
      .then(async (res) => {
        const sanitised = SanitiseAkaObj(res.data.tokens)
        let amounts = sanitised.map((akaObj) => akaObj.amount)
        let inputVals = sanitised.map((akaObj) => 0)
        this.setState({
          akaObjs: sanitised,
          amounts: amounts,
          inputVals: inputVals,
          loading: false,
        })
      })
      .catch()

    // TODO: may need to check some conditions
    window.onpopstate = (event) => {
      this.setState(event.state)
      // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
    }
    this.setState({ currentState: 1 })
  }

  // handleRoute = async (path) => {
  //   if (this.context.acc === null) {
  //     await this.context.syncTaquito().catch()
  //     await this.context.setAccount().catch()
  //   }
  //   if (this.context.acc !== null) {
  //     this.props.history.push(path + this.context.acc.address)
  //   }
  //   // this.context.setIsGacha(true)
  //   // this.props.history.push(path)
  // }

  prevState = () => {
    window.history.back()
    // this.setState({ currentState: this.state.currentState - 1 })
  }

  checkImages = () => {
    let NonZeroCount = 0
    let WithNegative = false
    for (let i = 0; i < this.state.inputVals.length; i++) {
      if (this.state.inputVals[i] > 0)
        NonZeroCount += 1
      else if (this.state.inputVals[i] < 0)
        WithNegative = true
    }
    // return this.state.inputVals.reduce((prev, curr) => (prev + curr), 0) <= 0 || NonZeroCount < 2
    return WithNegative || NonZeroCount < 2
  }

  toConfirm = () => {

    if (this.context.acc == null) {
      this.context.syncTaquito().catch()
      return;
    }

    var isNoEnough = false
    const chosenAmounts = this.state.akaObjs.map((akaObj, i) => {
      // const value = parseInt(document.getElementById(`quantity_${akaObj.tokenId}`).value)
      const value = parseInt(this.state.inputVals[i]);
      if (value > akaObj.amount) {
        isNoEnough = true
        return 0;
      }
      return isNaN(value) ? 0 : value
    })
    if (isNoEnough) {
      alert(getLanguage().alert.noEnoughItems);
      return;
    }
    const remains = this.state.akaObjs.map(
      (akaObj, i) => this.state.amounts[i] - chosenAmounts[i]
    )
    
    if (chosenAmounts.filter(amount => amount>0).length > BUNDLE_ITEM_LIMIT) {
      alert(getLanguage().alert.exceedLimit + BUNDLE_ITEM_LIMIT)
      return;
    }

    // TODO: may need to optimize
    window.history.replaceState(this.state, 'choose', window.location.pathname)
    let state = this.state
    state.chosenItemAmounts = chosenAmounts
    state.remains = remains
    state.currentState = 2
    window.history.pushState(state, 'choose', window.location.pathname)
    this.setState({ chosenAmounts: chosenAmounts, remains: remains, currentState: 2 })
  }

  toSuccess = async () => {

    const language = getLanguage()

    if (this.state.title === "" || this.state.description === "") {
      alert(language.alert.emptyInput)
      return;
    }
    if (this.state.price < MIN_SWAP_PRICE / 1000000) {
      alert(language.alert.priceLowerThanLimit)
      return;
    }
    if (this.state.edition < 1 || this.state.edition % 1 !== 0
    ) {
      alert(language.alert.mustBe + language.alert.integer)
      return;
    }
    for (let i = 0; i < this.state.amounts.length; i++) {
      if (this.state.chosenAmounts[i] * this.state.edition > this.state.amounts[i]) {
        alert(language.alert.noEnoughItems)
        return;
      }
    }

    if (this.context.acc == null) {
      this.context.syncTaquito().catch()
      return;
    }




    window.history.replaceState(this.state, 'choose', window.location.pathname)
    let state = this.state

    state.currentState = 3
    window.history.pushState(state, 'choose', window.location.pathname)
    this.setState({ currentState: 3 })

    let ipfsHash = await prepareGachaBundle({
      title: state.title,
      description: state.description,
      address: this.context.acc.address
    })

    let imageMap = new Map()
    this.state.akaObjs.forEach((akaObj, i) => {
      if (this.state.chosenItemAmounts[i] > 0)
        imageMap.set(akaObj.tokenId, this.state.chosenItemAmounts[i])
    })

    this.context.makeBundle(parseInt(this.state.edition), imageMap, parseFloat(this.state.price) * 1000000, ipfsHash.path)
      .then((e) => {
        console.log('make bundle confirm', e)
        this.props.history.push('/bundle')
      })
      .catch((e) => {
        console.log('make bundle error', e)
        alert('an error occurred')
      })

    // state.currentState = 3
    // window.history.pushState(state, 'choose', window.location.pathname)
    // this.setState({ currentState: 3 })
  }

  render() {
    const language = getLanguage()
    return (
      <Page title="MakeBundle">
        <Container full>
          <Switch>
            {/* {this.state.loading && (
              <Container>
                <Padding>
                  <Loading />
                </Padding>
              </Container>
            )} */}
            {(this.state.currentState === 0) && // Step 0. Introduction
              <Container>
                <Padding>
                  <div className={styles.bundlePage}>
                    <Container large>
                      <Padding>
                        <div className={styles.title}>{language.makebundle.intro.introTitle}</div>
                        <div className={styles.subtitle}>
                          {language.makebundle.intro.introDescription}
                        </div>
                      </Padding>
                    </Container>
                    <Container large>
                      <Padding>
                        <div className={styles.step}>
                          {language.makebundle.intro.tutorialDescription[0].replace("%LIMIT%",BUNDLE_ITEM_LIMIT)}<br></br>
                          {language.makebundle.intro.tutorialDescription[1]}<br></br>
                          {language.makebundle.intro.tutorialDescription[2]}<br></br>
                        </div>
                      </Padding>
                    </Container>
                    <Container large>
                      <Padding>
                        {/* <Button onClick={async () => await this.handleRoute('/bd/choose/')}> */}
                        <Button onClick={async () => await this.toMake()}>
                          <div className={styles.btn}>{language.makebundle.intro.cta}</div>
                        </Button>
                      </Padding>
                    </Container>
                  </div>
                </Padding>
              </Container>
            }
            {(this.state.currentState === 1) && // Step 1. Choose akaOBJ
              <Container slarge>
                <Padding>
                  <div className={styles.bundlePage}>
                    <Container full>
                      <Padding>
                        <div className={styles.title}>{language.makebundle.step1.title}</div>
                      </Padding>
                    </Container>
                    <Container xlarge>
                      <Padding>
                        <label className={styles.subtitle}>{language.makebundle.step1.description.replace("%LIMIT%", BUNDLE_ITEM_LIMIT)}</label>
                      </Padding>
                    </Container>
                    <Container xlarge>
                      <AkaobjGrid>
                        {this.state.akaObjs.map((nft, i) => {
                          // pagination disabled
                          // const firstIndex =
                          //   this.state.creationPage * this.state.creationItemsPerPage
                          // if (
                          //   i >= firstIndex &&
                          //   i < (firstIndex + 1) * this.state.creationItemsPerPage
                          // ) {

                          return (
                            <AkaobjAmount
                              nft={nft}
                              onAmountChange={(e) => {
                                var inputVals = this.state.inputVals
                                inputVals[i] = e.target.value
                                this.setState({ inputVals: inputVals })
                              }}
                              key={i}
                            />
                          )
                        })}
                      </AkaobjGrid>
                      <Button onClick={() => this.toConfirm()} disabled={this.checkImages()}>
                        <Primary>
                          <div className={styles.btn}>{language.makebundle.step1.cta}</div>
                        </Primary>
                      </Button>
                    </Container>
                  </div>
                </Padding>
              </Container>
            }
            {(this.state.currentState === 2) && // Step 2. Confirm & Edit Information 
              <Container slarge>
                <Padding>
                  <div className={styles.bundlePage}>
                    <Container full>
                      <Padding>
                        <div className={styles.title}>{language.makebundle.step2.title}</div>
                      </Padding>
                    </Container>
                    <Container large>
                      <Padding>
                        <label className={styles.subtitle}>{language.makebundle.step2.description}</label>
                      </Padding>
                    </Container>
                    <Container large>
                      <AkaobjGrid>
                        {this.state.akaObjs
                          .map((nft, i) => {
                            return (
                              <AkaobjChosen
                                nft={nft}
                                amount={this.state.chosenItemAmounts[i]}
                                key={i}
                              />
                            )
                          })
                          .filter((akaObj, i) => this.state.chosenItemAmounts[i] > 0)}
                      </AkaobjGrid>
                    </Container>

                    <Container large>

                      <Container full>
                        <div className={styles.divider}></div>
                      </Container>
                      <InputForm>
                        <Input
                          type="text"
                          // onChange={(e) => this.state.title = e.target.value}
                          onChange={(e) => this.setState({ title: e.target.value })}
                          placeholder={(language.makebundle.step2.placeholder.title).replace("%LIMIT%", TITLE_LIMIT)}
                          label={language.makebundle.step2.label.title + "*"}
                          maxlength={TITLE_LIMIT}
                          value={this.state.title}
                        />
                        <Textarea
                          type="textarea"
                          style={{ whiteSpace: 'pre' }}
                          // onChange={(e) => { this.state.description = e.target.value }}
                          onChange={(e) => this.setState({ description: e.target.value })}
                          placeholder={(language.makebundle.step2.placeholder.description).replace("%LIMIT%", DESCRIPTION_LIMIT)}
                          label={language.makebundle.step2.label.description + "*"}
                          maxlength={DESCRIPTION_LIMIT}
                        />
                        <Input
                          type="number"
                          min={0}
                          // onChange={(e) => this.state.price = e.target.value}
                          onChange={(e) => this.setState({ price: e.target.value })}
                          placeholder={language.makebundle.step2.placeholder.price}
                          label={language.makebundle.step2.label.price + "*"}
                          value={this.state.price}
                        />
                        <Input
                          type="number"
                          min={1}
                          // onChange={(e) => this.state.edition = e.target.value}
                          onChange={(e) => this.setState({ edition: e.target.value })}
                          placeholder={language.makebundle.step2.placeholder.edition}
                          label={language.makebundle.step2.label.edition + "*"}
                          value={this.state.edition}
                        />
                      </InputForm>
                      <Button onClick={() => this.prevState()}>
                        <Primary>
                          <div className={styles.btn}>{language.makebundle.step2.prev}</div>
                        </Primary>
                      </Button>
                      <Button onClick={() => this.toSuccess()}>
                        <Primary>
                          <div className={styles.btn}>{language.makebundle.step2.next}</div>
                        </Primary>
                      </Button>
                    </Container>
                  </div>
                </Padding>
              </Container>
            }
            {(this.state.currentState === 3) && // Step 3. Sent & Loading
              <Container slarge>
                <Padding>
                  <div>
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
                        {language.makebundle.preparing}
                        <Loading />
                      </div>
                    </Container>
                  </div>
                </Padding>
              </Container>
            }
            {/* <Route exact path="/makebundle" component={Intro} />
            <Route path="/bd/choose/:id" component={Choose} /> */}
          </Switch>
        </Container>
      </Page>
    )
  }
}
