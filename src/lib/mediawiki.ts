// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

import type {Item} from 'feedparser'
import type {PageEdit} from '../types.ts'

const SPECIAL_PAGE = 'Special:RecentChanges'

/**
 * Returns the base url for a wiki.
 * 
 * @param feedItem feed item we're operating on
 * @returns the wiki's base url
 */
function getWikiBaseUrl(feedItem: Item) {
  const special = feedItem.meta.link
  if (!special.includes(SPECIAL_PAGE)) {
    throw new Error('Not a valid atom feed item')
  }
  return special.replace(SPECIAL_PAGE, '')
}

/**
 * Returns the url of a feed item's article.
 * 
 * @param feedItem feed item we're operating on
 * @param baseUrl the base url obtained by getWikiBaseUrl()
 * @returns link to the article represented by this feed item
 */
function getArticleUrl(feedItem: Item, baseUrl: string) {
  // Note: this will be an existing page, so the title will already be fully sanitized.
  // All we need to do is replace space swith underscores.
  return `${baseUrl}${feedItem.title.replaceAll(' ', '_')}`
}

/**
 * Returns a url to the edit author's userpage.
 * 
 * @param feedItem the feed item we're operating on
 * @param baseUrl the base url obtained by getWikiBaseUrl()
 * @returns link to the userpage of the edit's author
 */
function getEditAuthorUrl(feedItem: Item, baseUrl: string) {
  return `${baseUrl}User:${feedItem.author.replaceAll(' ', '_')}`
}

/**
 * Returns the diff and oldid of a given edit url.
 */
function getDiffInfo(diffLink: string) {
  const url = new URL(diffLink)
  const diff = Number(url.searchParams.get('diff') || undefined)
  const oldid = Number(url.searchParams.get('oldid') || undefined)
  if (isNaN(diff) || isNaN(oldid)) {
    throw new Error('Not a valid atom feed item')
  }
  return [diff, oldid]
}

/**
 * Returns a page edit information object from an item in the recent changes atom feed.
 * 
 * @param feedItem feed item we're operating on
 * @returns page edit information object
 */
export function feedItemToPageEdit(feedItem: Item): PageEdit {
  const wikiBaseUrl = getWikiBaseUrl(feedItem)
  const articleLink = getArticleUrl(feedItem, wikiBaseUrl)
  const authorLink = getEditAuthorUrl(feedItem, wikiBaseUrl)
  const [diff, oldid] = getDiffInfo(feedItem.link)
  return {
    articleName: feedItem.title,
    articleLink,
    timestamp: (feedItem.date!).toISOString(),
    author: feedItem.author,
    authorLink: authorLink,
    diffLink: feedItem.link,
    diffId: diff,
    diffOldId: oldid,
    wikiBaseUrl,
    feedUrl: feedItem.meta.xmlurl,
  }
}
