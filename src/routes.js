import Sync from './pages/sync'
import { Entry } from './pages/entry'
import { About } from './pages/about'
import Profile from './pages/profile'
import { Latest, Popular, Featured, Bundle, Auction, Curation, Home } from './pages/metaverse'
import { Mint } from './pages/mint'
import MakeGacha from './pages/makegacha'
import MakeBundle from './pages/makebundle'
import { Nako } from './pages/nako'
import { Management } from './pages/management'
import { CurationDisplay } from './pages/curation-display'
import { AkaObjDisplay } from './pages/akaobj-display'
import { AuctionDisplay } from './pages/auction-display'
import { GachaDisplay } from './pages/gacha-display'
import { BundleDisplay } from './pages/bundle-display'
import { Tags } from './pages/tags'
import { GachaList } from './pages/gacha-list'
import { AboutGachaStage } from './pages/about/gacha-stage'

// import { Collections } from './pages/collections'

export const routes = [
  {
    exact: true,
    path: '/',
    component: Home,
  },
  {
    exact: true,
    path: '/entry',
    component: Entry,
  },
  {
    exact: true,
    path: '/latest',
    component: Latest,
  },
  {
    exact: true,
    path: '/popular',
    component: Popular,
  },
  {
    exact: true,
    path: '/featured',
    component: Featured,
  },
  {
    exact: true,
    path: '/curation',
    component: Curation,
  },
  // {
  //   exact: false,
  //   path: '/random',
  //   component: Random,
  // },
  {
    exact: true,
    path: '/auction',
    component: Auction,
  },
  {
    exact: true,
    path: '/bundle',
    component: Bundle,
  },
  {
    exact: true,
    path: '/gachalist',
    component: GachaList,
  },
  {
    exact: false,
    path: '/tz/:id',
    component: Profile,
  },
  {
    exact: false,
    path: '/ga/:id',
    component: MakeGacha,
  },
  {
    exact: false,
    path: '/curation/:id',
    component: CurationDisplay,
  },
  {
    exact: false,
    path: '/makegacha',
    component: MakeGacha,
  },
  {
    exact: false,
    path: '/makebundle',
    component: MakeBundle,
  },
  {
    exact: false,
    path: '/bd/:id',
    component: MakeBundle,
  },
  {
    exact: true,
    path: '/about',
    component: About,
  },
  {
    exact: false,
    path: '/about/gacha-stage',
    component: AboutGachaStage,
  },
  {
    exact: false,
    path: '/sync',
    component: Sync,
  },
  {
    exact: false,
    path: '/mint',
    component: Mint,
  },
  {
    exact: false,
    path: '/nako',
    component: Nako,
  },
  {
    exact: false,
    path: '/management',
    component: Management,
  },
  {
    exact: false,
    path: '/akaobj/:id',
    component: AkaObjDisplay,
  },
  {
    exact: false,
    path: '/auction/:id',
    component: AuctionDisplay,
  },
  {
    exact: false,
    path: '/tags/:id',
    component: Tags,
  },
  {
    exact: false,
    path: '/gacha/:id',
    component: GachaDisplay,
  },
  {
    exact: false,
    path: '/bundle/:id',
    component: BundleDisplay,
  },
  // {
  //   exact: false,
  //   path: '/collections/:id',
  //   component: Collections,
  // },
]
