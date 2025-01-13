// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

import {fetchFeed} from './feed.ts'
import {feedItemToPageEdit} from './mediawiki.ts'
import {getRecentChangesOptions, optionsToParams} from './options.ts'
import type {RecentChangesOptions, PageEdit} from '../types.ts'

export class MwRecent {
  private baseUrl: string
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }
  public async getRecentChanges(): Promise<PageEdit[]> {
    const url = this.getRecentChangesUrl()
    const items = await fetchFeed(url)
    return items.map(item => feedItemToPageEdit(item))
  }
  public getRecentChangesUrl(options: RecentChangesOptions = {}): URL {
    const url = new URL(`${this.baseUrl}/api.php`)
    url.search = optionsToParams(getRecentChangesOptions(options)).toString()
    return url
  }
}
