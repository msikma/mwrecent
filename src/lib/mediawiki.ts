// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

import type {RcResponse, RcItem, RcOptions, RcEditRecord, RcResult} from '../types.ts'

// Namespace id for File.
export const NS_FILE = 6
// Namespace id for User.
export const NS_USER = 2

/**
 * Splits a page title up into title and namespace.
 * 
 * @param title MediaWiki page title
 */
function splitPageTitle(title: string) {
  const bits = title.split(':')
  if (bits.length === 1) {
    return [title, 'Main']
  }
  return [bits.slice(1).join(':'), bits[0]]
}

/**
 * Sanitizes a page title for use in urls.
 * 
 * @param title MediaWiki article name
 * @returns sanitized MediaWiki article name for use in urls
 */
function sanitizePageTitle(title: string) {
  return title.replaceAll(' ', '_')
}

/**
 * Returns an article's user facing url.
 * 
 * @param pageTitle title of the page we're linking to
 * @param baseUrl the wiki's base url
 * @returns link to the article represented by this feed item
 */
function getArticleUrl(pageTitle: string, baseUrl: string) {
  // Note: this will be an existing page, so the title will already be fully sanitized.
  // All we need to do is replace space swith underscores.
  return `${baseUrl}${sanitizePageTitle(pageTitle)}`
}

/**
 * Returns a url to the edit author's userpage.
 * 
 * @param username the username string
 * @param baseUrl the wiki's base url
 * @returns link to the userpage of the edit's author
 */
function getEditAuthorUrl(username: string, baseUrl: string) {
  return `${baseUrl}User:${sanitizePageTitle(username)}`
}

/**
 * Returns url to a revision, either as a permalink or as a diff with the previous edit.
 * 
 * @param pageTitle title of the page we're linking to
 * @param wUrl the wiki's api base url
 * @param type type to return; permalink or diff with previous version
 */
function getRevisionUrl(pageTitle: string, wUrl: string, type: 'permalink' | 'diff') {
  const sanitizedTitle = sanitizePageTitle(pageTitle)
  const param = type === 'permalink' ? 'oldid' : 'diff'
  return `${wUrl}index.php?title=${sanitizedTitle}&${param}=2152`
}

/**
 * Converts a single recent change item to user facing data.
 * 
 * @param rcItem raw recent change edit from the api
 * @param wUrl url to the wiki's api path
 * @param baseUrl url to the wiki's user facing base path
 * @returns restructured recent change item
 */
export function convertRcItem(rcItem: RcItem, wUrl: string, baseUrl: string): RcEditRecord {
  const [title, namespace] = splitPageTitle(rcItem.title)
  const data = {
    editType: rcItem.type,
    page: {
      id: rcItem.pageid,
      title: rcItem.title,
      name: title,
      url: getArticleUrl(rcItem.title, baseUrl),
      namespace,
      namespaceId: rcItem.ns,
    },
    revision: {
      revisionUrl: getRevisionUrl(rcItem.title, wUrl, 'permalink'),
      revisionDiffUrl: getRevisionUrl(rcItem.title, wUrl, 'diff'),
      currentRevisionId: rcItem.revid,
      previousRevisionId: rcItem.old_revid,
      revisionChangeId: rcItem.rcid,
    },
    editor: {
      username: rcItem.user,
      userId: rcItem.userid,
      userUrl: getEditAuthorUrl(rcItem.user, baseUrl),
    },
    length: {
      old: rcItem.oldlen,
      new: rcItem.newlen,
    },
    timestamps: {
      editedAt: new Date(rcItem.timestamp),
    },
    comments: {
      raw: rcItem.comment || null,
      parsed: rcItem.parsedcomment || null,
    },
    metadata: {
      tags: rcItem.tags,
      sha1: rcItem.sha1 ?? null,
      minor: rcItem.minor === '',
      redirect: rcItem.redirect === '',
      new: rcItem.new === '',
    },
    log: {
      id: rcItem.logid ?? null,
      type: rcItem.logtype ?? null,
      action: rcItem.logaction ?? null,
      params: rcItem.logparams ?? null,
    },
  }
  return data
}

/**
 * Converts a recent changes api response object to user facing data.
 * 
 * @param rcResponseJson raw response object from the api
 * @param wUrl url to the wiki's api path
 * @param baseUrl url to the wiki's user facing base path
 * @returns restructured recent changes data
 */
export function convertRcResponse(rcResponseJson: RcResponse, wUrl: string, baseUrl: string, options: RcOptions): RcResult {
  const changeItems = rcResponseJson.query.recentchanges
  const items = changeItems.map(rcItem => convertRcItem(rcItem, wUrl, baseUrl))
  return {
    apiUrl: `${wUrl}api.php`,
    baseUrl,
    editRecords: items
  }
}
