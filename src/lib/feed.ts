// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

import {PassThrough} from 'node:stream'
import FeedParser from 'feedparser'
import type {Item} from 'feedparser'

/**
 * Parses an Atom/rss feed and returns its items.
 */
export function parseFeed(xml: string, options = {}): Promise<Item[]> {
  return new Promise((resolve, reject) => {
    const contentStream = new PassThrough()
    contentStream.write(xml)
    contentStream.end()

    const feed = new FeedParser(options)
    contentStream.pipe(feed)

    const items: Item[] = []

    // Reject on any parsing error.
    feed.on('error', (err: Error) => {
      reject(err)
    })

    // Wait for all items to be collected, then resolve.
    feed.on('readable', function readItems(this: FeedParser) {
      let item
      while (item = this.read()) {
        items.push(item)
      }
      resolve(items)
    })
  })
}

/**
 * Fetches a feed by url and parses it.
 */
export async function fetchFeed(url: string | URL, options = {}) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Could not fetch feed xml', {cause: res})
  }
  const xml = await res.text()
  const items = await parseFeed(xml, options)
  return items
}
