// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

export interface RecentChangesOptions {
  feedformat?: 'atom' | 'rss'
  namespace?: number
  invert?: boolean
  associated?: boolean
  days?: number
  limit?: number
  from?: Date | string
  hideminor?: boolean
  hidebots?: boolean
  hideliu?: boolean
  hidepatrolled?: boolean
  hidemyself?: boolean
  hidecategorization?: boolean
  tagfilter?: string[]
  inverttags?: boolean
  target?: string
  showlinkedto?: boolean
  [key: string]: string | number | Date | boolean | string[] | undefined
}

export interface PageEdit {
  articleName: string
  articleLink: string
  timestamp: string
  author: string
  authorLink: string
  diffLink: string
  diffId: number
  diffOldId: number
  wikiBaseUrl: string
  feedUrl: string
}
