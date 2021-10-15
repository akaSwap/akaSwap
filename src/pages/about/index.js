import React, { Component } from 'react'
import { Accordion } from '../../components/accordion'
import { Page, Container, Padding } from '../../components/layout'
import { Button } from '../../components/button'
import { ClickableImage } from '../../components/clickable-image'
import { FixedFooter } from '../../components/fixed-footer'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { getAbout } from '../../constants'
import styles from './styles.module.scss'
import { ReactComponent as ToggleIcon } from './imgs/toggle.svg'
import { ReactComponent as FacebookIcon } from './imgs/ic_facebook.svg'
// import { ReactComponent as MailIcon } from './imgs/ic_email.svg'
import { ReactComponent as InstagramIcon } from './imgs/ic_instagram.svg'
import { ReactComponent as TwitterIcon } from './imgs/ic_twitter.svg'
import { ReactComponent as DiscordIcon } from './imgs/ic_discord.svg'
import { ReactComponent as GithubIcon } from './imgs/ic_github.svg'
import { Disclaimer } from './disclaimer.js'
import { ENV } from '../../constants'

export class About extends Component {

  static contextType = AkaSwapContext
  about = getAbout() // TODO: new about

  state = {
    hash: null,
    isSidebarOpened: false,
    title: this.about.pages[this.about.menu[0].page].title,
    content: (
      this.renderPage(this.about.menu[0].page)
    ),
    reveal: false,
  }


  renderMenuItem(menuItem, i) {

    if (menuItem.section !== undefined) {
      var section = this.about.sections[menuItem.section]
      return (
        <Accordion
          className={styles.accordion}
          headerText={section.title}
          key={i}
        >
          {section.content.map((item, j) => this.renderMenuItem(item, j))}
        </Accordion>
      )
    }

    else if (menuItem.page !== undefined) {
      var id = menuItem.page
      //var ENV = "test"
      var title = this.about.pages[id].title

      if (menuItem.env === undefined || menuItem.env.split('!')[0] === ENV || (menuItem.env.split('!')[1] !== undefined && menuItem.env.split('!')[1] !== ENV)) {
        return (
          <Button to={"#" + id} key={i} onClick={() => {
            this.setContent(id)
            this.toggleSidebar()
          }}>
            <div className={styles.indicator}>{this.state.title === title && <ToggleIcon />}</div>
            <div className={styles.title + ' ' + ((this.state.title === title) ? styles.currentTitle : '')}>{title}</div>
          </Button>
        )
      }
    }
  }

  toggleSidebar(event = null) {
    if (event === null || event.target === event.currentTarget) {
      this.setState({ isSidebarOpened: !this.state.isSidebarOpened })
    }
  }

  setContent = (id) => {
    this.setState({
      title: this.about.pages[id].title,//this.about[id].title,
      content: this.renderPage(id)//this.display.find(d => d.id === id).content
    })
  }

  renderLink(text) {
    return (
      <>
        {text.split('%%').map((s, i) =>
        (s !== undefined && this.about.links[s] !== undefined ?
          this.about.links[s].newTab ? <a key={i} className={styles.link} href={this.about.links[s].url} target="_blank" rel="noreferrer">{this.about.links[s].text}</a>
            : <a key={i} className={styles.link} href={this.about.links[s].url}>{this.about.links[s].text}</a>
          : s === 'contact' ?
            <div className={styles.inline} key={i}>

              <a className={styles.link} href="mailto:service@akaswap.com">service@akaswap.com</a>
              <br />
              <a className={styles.contact_icon} href="https://twitter.com/AkaswapCom" target="_blank" rel="noreferrer"><TwitterIcon /></a> &nbsp;
              <a className={styles.contact_icon} href="https://www.instagram.com/akaswap_com/" target="_blank" rel="noreferrer"><InstagramIcon /></a> &nbsp;
              <a className={styles.contact_icon} href="https://www.facebook.com/AkaSwap-101349298859930" target="_blank" rel="noreferrer"><FacebookIcon /></a>
              <a className={styles.contact_icon} href="https://discord.gg/BtEThNcRFn" target="_blank" rel="noreferrer"><DiscordIcon /></a>
              <a className={styles.contact_icon} href="https://github.com/akaSwap" target="_blank" rel="noreferrer"><GithubIcon /></a>
            </div>
            : s)

        )
        }
      </>)
  }


  renderPage(id) {
    var page = this.about.pages[id]
    return (
      <div>
        {id === 'disclaimer' ?
          <div className={styles.terms}><Disclaimer /></div>
          : page.title !== undefined &&
          <h2><a href={'#' + id}>{page.title}</a></h2>
        }

        {page.description !== undefined &&
          page.description.map((desc, i) => (
            <div key={i}>
              {desc.header !== undefined ?
                <h3>{desc.header}</h3>

                : desc.video !== undefined ?
                  <iframe width="560" height="315" src={desc.video} key={i}
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true">
                  </iframe>

                  : desc.image !== undefined ?
                    <div class={styles.descImg}>
                      <ClickableImage src={require(`${desc.image}`).default} width="100%"></ClickableImage>
                    </div>

                    : desc.class !== undefined ?
                      <div className={styles[desc.class]}>{this.renderLink(desc.content)}</div>

                      : <p>{this.renderLink(desc)}</p>
              }
            </div>
          ))
        }
        {page.steps !== undefined &&
          <ol className={styles.steps}>
            {page.steps.map((step, index) =>
              <li className={styles.stepContent} key={index}>
                {step.text !== undefined &&
                  <p>{this.renderLink(step.text)}</p>
                }
                {step.image !== undefined && step.image !== '' &&
                  <Container xlarge>
                    <ClickableImage src={require(`${step.image}`).default}></ClickableImage>
                  </Container>
                }
                {step.paragraphs !== undefined && step.paragraphs[0] !== undefined &&
                  step.paragraphs.map((p, i) => <p key={i}>{this.renderLink(p)}</p>)
                }
              </li>
            )}
          </ol>
        }
        {
          page.footnotes !== undefined &&
          page.footnotes.map((desc, i) => (
            <p key={i}>{desc}</p>
          ))
        }
      </div>
    )
  }

  componentDidMount() {
    let hash = this.props.location.hash
    if (hash !== null || hash !== '') {
      hash = hash.replace('#', '')
      if (this.about.pages[hash] !== undefined) {
        this.setContent(hash)
      }
    }
  }

  reveal = () => {
    this.setState({
      reveal: !this.state.reveal,
    })
  }

  render() {
    return (
      <>
        <div onClick={(e) => this.toggleSidebar(e)} className={styles.sidebarOverlay + ' ' + (this.state.isSidebarOpened ? '' : styles.hide)}>
          <button onClick={(e) => this.toggleSidebar(e)} className={styles.sidebarToggle}>{this.state.isSidebarOpened ? '<<' : '>>'}</button>
          <div className={styles.sidebar} id='sidebar'>
            {this.about.menu.map((menuItem, i) => this.renderMenuItem(menuItem, i))}
          </div>
        </div>

        <Page title="About">
          <Container>
            <Padding>
              <div className={styles.content}>
                {this.state.content}
              </div>
            </Padding>
          </Container>
          <Container>
            <Padding>
              <FixedFooter setContent={this.setContent} />
            </Padding>
          </Container>
        </Page>
      </>
    )

  }
}
