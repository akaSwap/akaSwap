import React, { Component } from 'react'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { Switch } from "react-router-dom"
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { CURRENT_GACHA_STAGE, GACHA_ITEM_LIMIT, MIN_SWAP_PRICE, GACHA_FEE_AKADAO, TITLE_LIMIT, DESCRIPTION_LIMIT, GACHA_ISSUE_DAY_LIMIT, GACHA_DURATION_LIMIT } from '../../constants'
import { getLanguage, getGachaWhiteList } from '../../constants'
import { Loading } from '../../components/loading'
import { DatetimePicker, Input, Textarea, CheckBox } from '../../components/input'
import { SanitiseAkaObj } from '../../utils/sanitise'
import { prepareGachaBundle } from '../../data/ipfs'
import styles from './styles.module.scss'
import { AkaobjAmount, AkaobjSelect, AkaobjChosen, AkaobjGrid } from '../../components/akaobj-choose'
import { InputForm } from '../../components/input-form'

const axios = require('axios')

export default class MakeGacha extends Component {


  gachaWhiteList = getGachaWhiteList()
  static contextType = AkaSwapContext

  state = {
    wallet: "",
    akaDao: 0,
    render: false,
    loading: true,
    akaObjs: [],
    amounts: [],
    remains: [],
    inputVals: [],
    chosenLastPrize: -1, // -1: still not be chosen
    lastPrizeAmounts: [],
    prizeAmounts: [],
    chosenItemAmount: 0,
    totalAmount: 0,
    title: "",
    description: [],
    price: 0,
    useIssueTime: false,
    duration: 1,
    currentState: 0, // 0: Intro, 1: choose prize, 2: choose last prize, 3: confirm, 4: success
    page: 0,
    itemsPerPage: 12, // 4x3 grid
    defaultDatetime: null,
    selectedDatetime: null
  }

  handleRoute = async (path) => {
    if (this.context.acc === null) {
      await this.context.syncTaquito().catch()
      await this.context.setAccount().catch()
    }
    if (this.context.acc != null) {
      this.props.history.push(path + this.context.acc.address)
    }
  }

  handleValidation = () => {

    if (this.context.address === undefined) {
      return true
    }
    if (CURRENT_GACHA_STAGE === 1 && !this.checkInWhiteList()) {
      return true
    }
    return false
  }

  checkInWhiteList = () => {
    if (this.context.address === undefined) return false
    if (this.gachaWhiteList.indexOf(this.context.address.address) === -1) {
      return false
    }
    else return true
  }

  prevState = () => {
    window.history.back()
    //this.setState({ currentState: this.state.currentState - 1 })
  }

  checkPrizes = () => {
    for (let i = 0; i < this.state.inputVals.length; i++)
      if (this.state.inputVals[i] < 0)
        return true
    return false
  }

  checkLastPrize = () => {
    return this.state.chosenLastPrize < 0
  }

  checkDetail = () => {
    // if(this.state.title == "" || this.state.description == "") return true;
    // if(this.state.duration < 1 || this.state.duration > 30) return true; 
    return false;
  }

  toMake = async () => {
    if (this.context.acc == null) {
      this.context.syncTaquito().catch()
      return;
    }
    const currentWallet = this.context.acc.address
    if (this.state.wallet !== currentWallet) {
      this.setState({
        wallet: currentWallet
      })
      // this.props.history.replace(`/ga/choose/${this.context.acc.address}`)
    }
    // this.setState({defaultDatetime: new Date()})

    await Promise.all([
      axios
        .get(`${process.env.REACT_APP_ACCOUNTS}/${currentWallet}/akaobjs`, {
          params: {
            withCollections: CURRENT_GACHA_STAGE === 3
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
        .catch(),
      axios
        .get(`${process.env.REACT_APP_ACCOUNTS}/${currentWallet}/akaDao`)
        .then(async (res) => {
          this.setState({
            akaDao: res.data.result,
          })
        })
        .catch()
    ])

    // TODO: may need to check some conditions
    window.onpopstate = (event) => {
      try {
        const state = JSON.parse(event.state)
        this.setState(state)
      } catch (e) {

      }
      // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
    }
    this.setState({ currentState: 1 })
  }

  toChooseLast = () => {
    if (this.context.acc == null) {
      this.context.syncTaquito().catch()
      return;
    }

    var isNoEnough = false
    // TODO: may need to optimize
    const prizeAmounts = this.state.akaObjs.map((akaObj, i) => {
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

    // this.state.chosenItemAmount = 0;
    // this.state.totalAmount = 0;
    // prizeAmounts.map((value) => {
    //   if (value > 0) {
    //     this.state.chosenItemAmount += 1
    //     this.state.totalAmount += value
    //   }
    // })
    let chosenItemAmount = 0, totalAmount = 0;
    for (let i = 0; i < prizeAmounts.length; i++)
      if (prizeAmounts[i] > 0) {
        chosenItemAmount += 1
        totalAmount += prizeAmounts[i]
      }
    this.setState({ chosenItemAmount: chosenItemAmount, totalAmount: totalAmount })



    if (chosenItemAmount > GACHA_ITEM_LIMIT) {
      alert(getLanguage().alert.exceedLimit + GACHA_ITEM_LIMIT)
      return;
    }

    const remains = this.state.akaObjs.map(
      (akaObj, i) => this.state.amounts[i] - prizeAmounts[i]
    )

    window.history.replaceState(JSON.stringify(this.state), 'choose', window.location.pathname)
    let state = this.state
    state.prizeAmounts = prizeAmounts
    state.remains = remains
    state.currentState = 2
    window.history.pushState(JSON.stringify(state), 'choose', window.location.pathname)
    this.setState({ prizeAmounts: prizeAmounts, remains: remains, currentState: 2 })
  }

  toConfirm = () => {
    if (this.context.acc === null) {
      this.context.syncTaquito().catch()
      return;
    }
    // TODO: may need to optimize
    const lastPrizeAmounts = this.state.akaObjs.map((akaObj, i) => {
      return i === this.state.chosenLastPrize ? 1 : 0
    })
    window.history.replaceState(JSON.stringify(this.state), 'choose', window.location.pathname)
    let state = this.state
    state.lastPrizeAmounts = lastPrizeAmounts
    state.currentState = 3
    window.history.pushState(JSON.stringify(state), 'choose', window.location.pathname)
    this.setState({ lastPrizeAmounts: lastPrizeAmounts, currentState: 3 })
  }

  toSuccess = async () => {

    const language = getLanguage()

    if (this.context.acc == null) {
      this.context.syncTaquito().catch()
      return;
    }

    if (this.state.price * 1000000 < MIN_SWAP_PRICE) {
      alert(language.alert.priceLowerThanLimit)
      return;
    }
    if (this.state.duration < 1 || this.state.duration > GACHA_DURATION_LIMIT || this.state.duration % 1 !== 0) {
      alert(language.alert.duration + language.alert.mustBe + language.alert.rangeOf + "[1-" + GACHA_DURATION_LIMIT + "]")
      return;
    }
    if (this.state.useIssueTime === true) {
      if (this.state.selectedDatetime === null) {
        alert(language.alert.notDate.replace('%RANGE%', GACHA_ISSUE_DAY_LIMIT))
        return
      } else {
        var today = new Date()
        if (this.state.selectedDatetime.getTime() < today.getTime() || Math.floor((this.state.selectedDatetime - today) / (1000 * 60 * 60 * 24)) >= GACHA_ISSUE_DAY_LIMIT) {
          alert(language.alert.invalidDate.replace('%RANGE%', GACHA_ISSUE_DAY_LIMIT))
          return
        }
      }
    }

    // var n = 0
    // this.state.prizeAmounts.map((amount)=>{
    //   if(amount!=0) n += amount
    // })
    // this.setState({totalNum: n})
    if (CURRENT_GACHA_STAGE > 1 && (this.state.totalAmount * GACHA_FEE_AKADAO) > this.state.akaDao) {
      alert(language.alert.noEnoughItems + "(akaDAO)")
      return;
    }

    window.history.replaceState(JSON.stringify(this.state), 'choose', window.location.pathname)
    let state = this.state

    state.currentState = 4
    window.history.pushState(JSON.stringify(state), 'choose', window.location.pathname)
    this.setState({ currentState: 4 })
    let ipfsHash = await prepareGachaBundle({
      title: state.title,
      description: state.description,
      address: this.context.acc.address
    })

    let prizeMap = new Map()
    this.state.akaObjs.forEach((akaObj, i) => {
      if (this.state.prizeAmounts[i] > 0)
        prizeMap.set(akaObj.tokenId, this.state.prizeAmounts[i])
    })
    let lastPrize = 0
    this.state.lastPrizeAmounts.forEach((prize, i) => {
      if (prize > 0)
        lastPrize = this.state.akaObjs[i].tokenId
    })
    let issueTime = new Date()
    if (this.state.useIssueTime)
      issueTime = this.state.selectedDatetime
    // console.log("Print PrizeMap:")
    // console.log(prizeMap)

    this.context.makeGacha(parseInt(this.state.duration), prizeMap, issueTime, parseInt(lastPrize), parseFloat(this.state.price) * 1000000, ipfsHash.path)
      .then((e) => {
        console.log('make gacha confirm', e)
        this.props.history.push('/gachalist')
      })
      .catch((e) => {
        console.log('make gacha error', e)
        alert('an error occurred')
      })

  }

  render() {
    const language = getLanguage()
    return (
      <Page title="MakeGacha">
        <Container full>
          <Switch>
            {/* {this.state.loading && (
              <Container>
                <Padding>
                  <Loading />
                </Padding>
              </Container>
            )} */}
            {(this.state.currentState === 0) &&
              <Container>
                <Padding>
                  <div className={styles.gachaPage}>
                    <Container large>
                      <Padding>
                        <div className={styles.title}>{language.makegacha.intro.introTitle}</div>
                        <div className={styles.subtitle}>
                          {language.makegacha.intro.introDescription[0]}<br /><br />
                          {language.makegacha.intro.introDescription[1]}
                        </div>
                      </Padding>
                    </Container>
                    <Container large>
                      <Padding>
                        <div className={styles.title}>{language.makegacha.intro.tutorialTitle}</div>
                        <div className={styles.subtitle}>
                          {language.makegacha.intro.tutorialDescription[0].replace("%LIMIT%",GACHA_ITEM_LIMIT)}<br />
                          {language.makegacha.intro.tutorialDescription[1]}<br />
                          {language.makegacha.intro.tutorialDescription[2]}<br />
                          {language.makegacha.intro.tutorialDescription[3]}<br />
                          {language.makegacha.intro.tutorialDescription[4]}<br /><br />
                          {language.makegacha.intro.tutorialGachaStage[0]}
                          <Button to="/about/gacha-stage">
                            <strong className={styles.link}>{language.makegacha.intro.tutorialGachaStage[1]}</strong>
                          </Button>
                        </div>
                      </Padding>
                    </Container>
                    <Container large>
                      <Padding>
                        <Button
                          onClick={async () => await this.toMake()}
                          disabled={this.handleValidation()}>
                          <div className={styles.btn}>{language.makegacha.intro.cta}</div>
                        </Button>
                        {
                          CURRENT_GACHA_STAGE === 1 && !this.checkInWhiteList() &&
                          <div className={styles.postscript}>( {language.makegacha.intro.whiteListConfirm} )</div>
                        }
                      </Padding>
                    </Container>
                  </div>
                </Padding>
              </Container>
            }

            {(this.state.currentState === 1) &&
              <div title={this.state.wallet}>
                <Container slarge>
                  <div className={styles.gachaPage}>
                    <Container full>
                      <Padding>
                        <div className={styles.title}>{language.makegacha.step1.title}</div>
                      </Padding>
                    </Container>
                    <Container xlarge>
                      <Padding>
                        <label className={styles.subtitle}>{language.makegacha.step1.description.replace("%GACHA_ITEM_LIMIT%", GACHA_ITEM_LIMIT)}</label>
                      </Padding>
                    </Container>
                    <Container xlarge>
                      {/* PAGINATION NOT READY YET */}
                      {/* {false && (
                        <Padding>
                          <div className={styles.pagination}>
                            {Array.from(
                              Array(
                                Math.ceil(
                                  this.state.akaObjs.length / this.state.itemsPerPage
                                )
                              )
                            ).map((a, i) => {
                              const itemClasses = classnames({
                                [styles.item]: true,
                                [styles.selected]: i === this.state.page,
                              })
                              return (
                                <div
                                  key={`creation-${i}`}
                                  className={itemClasses}
                                  onClick={() => this.setState({ page: i })}
                                />
                              )
                            })}
                          </div>
                        </Padding>
                      )} */}
                      <Padding>
                        <AkaobjGrid>
                          {this.state.akaObjs.map((nft, i) => {
                            // pagination disabled
                            // const firstIndex =
                            //   this.state.creationPage * this.state.creationItemsPerPage
                            // if (
                            //   i >= firstIndex &&
                            //   i < (firstIndex + 1) * this.state.creationItemsPerPage
                            // ) {
                            // const { mimeType, uri } = nft.tokenInfo.formats[0]

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
                      </Padding>
                      <Button onClick={() => this.toChooseLast()} disabled={this.checkPrizes()}>
                        <Primary>
                          <div className={styles.btn}>{language.makegacha.next}</div>
                        </Primary>
                      </Button>
                    </Container>
                  </div>
                </Container>
              </div>
            }

            {(this.state.currentState === 2) &&
              <div title={this.state.wallet}>
                <Container slarge>
                  <div className={styles.gachaPage}>
                    <Container full>
                      <Padding>
                        <div className={styles.title}>{language.makegacha.step2.title}</div>
                      </Padding>
                    </Container>
                    <Container xlarge>
                      <Padding>
                        <label className={styles.subtitle}>{language.makegacha.step2.description}</label>
                      </Padding>
                    </Container>
                    <Container xlarge>
                      <Padding>
                        <AkaobjGrid>
                          {this.state.akaObjs
                            .map((nft, i) => {
                              // pagination disabled
                              // const firstIndex =
                              //   this.state.creationPage * this.state.creationItemsPerPage
                              // if (
                              //   i >= firstIndex &&
                              //   i < (firstIndex + 1) * this.state.creationItemsPerPage
                              // ) {
                              // const { mimeType, uri } = nft.tokenInfo.formats[0]

                              return (
                                <AkaobjSelect
                                  key={i}
                                  nft={nft}
                                  remain={this.state.remains[i]}
                                  selected={this.state.chosenLastPrize === i}
                                  onSelect={(e) => { this.setState({ chosenLastPrize: i }) }}
                                />


                              )
                            })
                            .filter((akaObj, i) => this.state.remains[i] > 0)}
                        </AkaobjGrid>
                      </Padding>
                      <Button onClick={() => this.prevState()}>
                        <Primary>
                          <div className={styles.btn}>{language.makegacha.prev}</div>
                        </Primary>
                      </Button>
                      <Button onClick={() => this.toConfirm()} disabled={this.checkLastPrize()}>
                        <Primary>
                          <div className={styles.btn}>{language.makegacha.next}</div>
                        </Primary>
                      </Button>
                    </Container>
                  </div>
                </Container>
              </div>
            }

            {(this.state.currentState === 3) &&
              <div title={this.state.wallet}>
                <Container slarge>
                  <div className={styles.gachaPage}>
                    <Container full>
                      <Padding>
                        <div className={styles.title}>{language.makegacha.step3.title}</div>
                      </Padding>
                    </Container>
                    <Container large>
                      <Padding>
                        <AkaobjGrid>
                          {this.state.akaObjs
                            .map((nft, i) => {
                              // pagination disabled
                              // const firstIndex =
                              //   this.state.creationPage * this.state.creationItemsPerPage
                              // if (
                              //   i >= firstIndex &&
                              //   i < (firstIndex + 1) * this.state.creationItemsPerPage
                              // ) {
                              // const { mimeType, uri } = nft.tokenInfo.formats[0]

                              return (
                                <AkaobjChosen
                                  nft={nft}
                                  amount={this.state.prizeAmounts[i]}
                                  key={i}
                                />
                              )
                            })
                            .filter((akaObj, i) => this.state.prizeAmounts[i] > 0)}
                        </AkaobjGrid>
                      </Padding>
                    </Container>
                    <Container large>
                      <Padding>
                        <label className={styles.subtitle}>{language.makegacha.step3.lastPrize}</label>
                      </Padding>
                    </Container>
                    <Container large>
                      <Padding>
                        <AkaobjGrid>
                          {this.state.akaObjs
                            .map((nft, i) => {
                              // pagination disabled
                              // const firstIndex =
                              //   this.state.creationPage * this.state.creationItemsPerPage
                              // if (
                              //   i >= firstIndex &&
                              //   i < (firstIndex + 1) * this.state.creationItemsPerPage
                              // ) {
                              // const { mimeType, uri } = nft.tokenInfo.formats[0]

                              return (
                                <AkaobjChosen
                                  nft={nft}
                                  amount={this.state.lastPrizeAmounts[i]}
                                />

                              )
                            })
                            .filter((akaObj, i) => i === this.state.chosenLastPrize)}
                        </AkaobjGrid>
                      </Padding>
                      <Container full>
                        <div className={styles.divider}></div>
                      </Container>
                      <InputForm>
                        <Input
                          type="text"
                          onChange={(e) => this.setState({ title: e.target.value })}
                          placeholder={(language.makegacha.step3.placeholder.title).replace("%LIMIT%", TITLE_LIMIT)}
                          maxlength={TITLE_LIMIT}
                          label={language.makegacha.step3.label.title + "*"}
                          value={this.state.title}
                        />
                        <Textarea
                          type="textarea"
                          style={{ whiteSpace: 'pre' }}
                          onChange={(e) => {
                            this.setState({ description: e.target.value })
                          }}
                          placeholder={(language.makegacha.step3.placeholder.description).replace("%LIMIT%", DESCRIPTION_LIMIT)}
                          label={language.mint.label.description + "*"}
                          maxlength={DESCRIPTION_LIMIT}
                        />

                        <Input
                          type="number"
                          min={1}
                          max={GACHA_DURATION_LIMIT}
                          onChange={(e) => this.setState({ duration: e.target.value })}
                          placeholder={language.makegacha.step3.placeholder.duration}
                          label={language.makegacha.step3.label.duration + "*"}
                          value={this.state.duration}
                        />
                        <Input
                          type="number"
                          min={0}
                          value={0}
                          onChange={(e) => this.setState({ price: e.target.value })}
                          placeholder={language.makegacha.step3.placeholder.price}
                          label={language.makegacha.step3.label.price + "*"}
                        />
                        <div className={styles.row}>
                          <CheckBox
                            type="checkbox"
                            onChange={(e) => {
                              this.setState({ useIssueTime: e.target.checked })
                            }}
                            label={(
                              <span style={{ fontSize: "0.7rem" }}>
                                {language.makegacha.step3.label.schedule}
                              </span>)
                            }
                            // value={this.state.useIssueTime}
                            checked={this.state.useIssueTime}
                          />
                        </div>
                        {this.state.useIssueTime &&
                          <div>
                            <DatetimePicker
                              customClass={styles.datetimePicker}
                              onChanged={(value) => this.setState({ selectedDatetime: value })}
                              maxRange={GACHA_ISSUE_DAY_LIMIT}
                            />
                          </div>
                        }
                      </InputForm>
                      <Container full>
                        {CURRENT_GACHA_STAGE > 1 &&
                          (
                            <div>
                              {(language.gacha.description_akadao).replace("%AkaDAO%", GACHA_FEE_AKADAO / 1000000)}
                              {this.state.totalAmount !== 0 && this.state.totalAmount * Math.round(GACHA_FEE_AKADAO) / 1000000}
                              ⩘</div>
                          )
                        }
                      </Container>
                      <Button onClick={() => this.prevState()}>
                        <Primary>
                          <div className={styles.btn}>{language.makegacha.prev}</div>
                        </Primary>
                      </Button>
                      <Button onClick={() => this.toSuccess()} disabled={this.checkDetail()}>
                        <Primary>
                          <div className={styles.btn}>{language.makegacha.step3.cta}</div>
                        </Primary>
                      </Button>
                    </Container>
                  </div>
                </Container>
              </div>
            }

            {(this.state.currentState === 4) &&
              <div title={this.state.wallet}>
                <Container slarge>
                  <div className={styles.gachaPage}>
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
                        {language.makegacha.preparing}
                        <Loading top='60%' />
                      </div>
                    </Container>

                    {/* {message && (
                      <Container full>
                        <Padding>
                          <p>{message}</p>
                        </Padding>
                      </Container>
                    )} */}
                  </div>
                </Container>
              </div>
            }
            {/* <Route exact path="/makegacha" component={Intro} />
            <Route path="/ga/choose/:id" component={Choose} /> */}
          </Switch>
        </Container>
      </Page>
    )
  }

}
