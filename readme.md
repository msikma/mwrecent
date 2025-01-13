[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/@dada78641%2Fmwrecent.svg)](https://badge.fury.io/js/@dada78641%2Fmwrecent)

# @dada78641/mwrecent

Library that fetches and parses "recent edits" feeds from [MediaWiki](https://www.mediawiki.org/wiki/MediaWiki) sites.

## Usage

```bash
npm i @dada78641/mwrecent
```

```ts
import {MwRecent, type PageEdit} from '@dada78641/mwrecent'

const mw = new MwRecent('https://mywikisite.com/w')
const edits = await mw.getRecentChanges()
console.log(edits)
```

```ts
[
  {
    articleName: 'Namespace:Article name',
    articleLink: 'https://mywikisite.com/wiki/Namespace:Article_name',
    timestamp: '2025-01-13T22:49:21.000Z',
    author: 'Dada78641',
    authorLink: 'https://mywikisite.com/wiki/User:Dada78641',
    diffLink: 'https://mywikisite.com/w/index.php?title=Namespace:Article_name&diff=2152&oldid=1544',
    diffId: 2103,
    diffOldId: 2088,
    wikiBaseUrl: 'https://mywikisite.com/wiki/',
    feedUrl: 'https://mywikisite.com/w/api.php?feedformat=atom&days=90&limit=50&action=feedrecentchanges&urlversion=1'
  },
  // ...
]
```

Note: pass the directory where `api.php` can be found in the constructor.

The `diffLink` string functions as unique identifier for an edit.

## External links

* [MediaWiki API - Feedrecentchanges](https://www.mediawiki.org/wiki/API:Feedrecentchanges) – api documentation for the `feedrecentchanges` action

## License

MIT licensed.
