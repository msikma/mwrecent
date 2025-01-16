// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

import {fetchRcJson} from './json.ts'
import {convertRcResponse, NS_FILE, NS_USER} from './mediawiki.ts'
import {getRcOptions, optionsToParams} from './options.ts'
import {ensureTrailingSlash} from './util.ts'
import type {RcOptions, RcParams, RcResult, RcEditRecord} from '../types.ts'

export interface MwRecentOptions {
  // Url to the wiki's /w path containing the api.php file.
  wUrl: string
  // Base url used to construct links to the wiki's user facing paces.
  baseUrl?: string
}

/**
 * Consumer interface for the library.
 */
export class MwRecent {
  // Base url, used to create user facing urls.
  private baseUrl: string
  // Wiki url, directory used for api access. E.g. http://example.com/w/
  private wUrl: string
  
  constructor({wUrl, baseUrl}: MwRecentOptions) {
    this.wUrl = ensureTrailingSlash(wUrl)
    this.baseUrl = ensureTrailingSlash(baseUrl || '/')
  }

  /**
   * Returns recent edits to the wiki.
   * 
   * @param userOptions RecentChanges api call options. See <https://www.mediawiki.org/wiki/API:RecentChanges>.
   * @returns response object containing recent changes and metadata.
   */
  public async getRecentChanges(userOptions?: RcOptions): Promise<RcResult> {
    const options = this.getResolvedOptions(userOptions)
    const url = this.getRecentChangesUrl(options)
    const res = await fetchRcJson(url)
    return convertRcResponse(res, this.wUrl, this.baseUrl, options)
  }

  /**
   * Returns resolved options (defaults merged in).
   * 
   * Also does basic error checking on the options.
   * @param options RecentChanges api call options.
   * @returns api call options.
   */
  private getResolvedOptions(options: RcOptions = {}): RcOptions {
    return {...getRcOptions(options)}
  }

  /**
   * Returns parameters for making a RecentChanges api call.
   * 
   * @param options RecentChanges api call options.
   * @returns api call options.
   */
  private getRecentChangesParams(options: RcOptions): RcParams {
    const params = {
      ...options,
      action: 'query',
      list: 'recentchanges',
      format: 'json',
    } satisfies RcParams
    return params
  }

  /**
   * Returns url for making a RecentChanges api call with a given set of options.
   * 
   * @param options RecentChanges api call options.
   * @returns url for making an api call.
   */
  public getRecentChangesUrl(options: RcOptions): URL {
    const url = new URL(`${this.wUrl}api.php`)
    const params = this.getRecentChangesParams(options)
    url.search = optionsToParams(params).toString()
    return url
  }

  /**
   * Returns true if this is a regular page edit.
   */
  public static isPageEdit(rcData: RcEditRecord) {
    return rcData.editType === 'edit'
      && rcData.log.type === null
      && rcData.log.action === null
  }

  /**
   * Returns true if this is a file upload.
   */
  public static isFileUpload(rcData: RcEditRecord) {
    return rcData.editType === 'log'
      && rcData.log.type === 'upload'
      && rcData.log.action === 'upload'
      && rcData.page.namespaceId === NS_FILE
  }

  /**
   * Returns true if this is a file deletion.
   */
  public static isFileDeletion(rcData: RcEditRecord) {
    return rcData.editType === 'log'
      && rcData.log.type === 'delete'
      && rcData.log.action === 'delete'
      && rcData.page.namespaceId === NS_FILE
  }

  /**
   * Returns true if this is a new page creation.
   */
  public static isPageCreation(rcData: RcEditRecord) {
    return rcData.editType === 'new'
      && rcData.log.id === null
  }

  /**
   * Returns true if this is a user ban.
   */
  public static isUserBan(rcData: RcEditRecord) {
    return rcData.editType === 'log'
      && rcData.log.id != null && rcData.log.id > 0
      && rcData.log.type === 'block'
      && rcData.log.action === 'block'
      && rcData.page.namespaceId === NS_USER
  }

  /**
   * Returns true if this is a new user registration.
   */
  public static isUserRegistration(rcData: RcEditRecord) {
    return rcData.editType === 'log'
      && rcData.log.type === 'newusers'
      && rcData.log.action === 'create'
      && rcData.page.namespaceId === NS_USER
  }

  /**
   * Returns true if this is a page deletion.
   */
  public static isPageDeletion(rcData: RcEditRecord) {
    return rcData.editType === 'log'
      && rcData.log.type === 'delete'
      && rcData.log.action === 'delete'
      && rcData.page.namespaceId !== NS_FILE
  }

  /**
   * Returns true if this is a page move or rename.
   */
  public static isPageMove(rcData: RcEditRecord) {
    return rcData.editType === 'log'
      && rcData.log.type === 'move'
      && rcData.log.action === 'move'
      && rcData.log.params != null && ('target_title' in rcData.log.params)
  }
}
