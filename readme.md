[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/@dada78641%2Fmwrecent.svg)](https://badge.fury.io/js/@dada78641%2Fmwrecent)

# @dada78641/mwrecent

Library that fetches and parses "recent edits" feeds from [MediaWiki](https://www.mediawiki.org/wiki/MediaWiki) sites.

## Usage

Install through npm:

```bash
npm i @dada78641/mwrecent
```

Use as follows:

```ts
import {MwRecent} from '@dada78641/mwrecent'

const mw = new MwRecent({
  wUrl: 'https://mywikisite.com/w/',
  baseUrl: 'https://mywikisite.com/wiki/'
})
const edits = await mw.getRecentChanges()
console.log(edits)
```

### Return value

The following data will be returned:

```ts
{
  apiUrl: 'https://mywikisite.com/w/api.php',
  baseUrl: 'https://mywikisite.com/wiki/',
  editRecords: [
    {
      editType: 'edit',
      page: {
        id: 98,
        title: 'My Namespace:Edit guide',
        name: 'Edit guide',
        url: 'https://mywikisite.com/wiki/My_Namespace:Edit_guide',
        namespace: 'My Namespace',
        namespaceId: 4
      },
      revision: {
        revisionUrl: 'https://mywikisite.com/w/index.php?title=My_Namespace:Edit_guide&oldid=2152',
        revisionDiffUrl: 'https://mywikisite.com/w/index.php?title=My_Namespace:Edit_guide&diff=2152',
        currentRevisionId: 2152,
        previousRevisionId: 1544,
        revisionChangeId: 2174
      },
      editor: {
        username: 'Dada78641',
        userId: 3,
        userUrl: 'https://mywikisite.com/wiki/User:Dada78641'
      },
      length: {
        old: 4011,
        new: 4037
      },
      timestamps: {
        editedAt: '2025-01-13T22:49:21.000Z' // as Date object
      },
      comments: {
        raw: "/* '''Structure of the DAT File''' */",
        parsed: '<span dir="auto"><span class="autocomment"><a href="/wiki/My_Namespace:Edit_guide#&#039;&#039;&#039;Structure_of_the_DAT_File&#039;&#039;&#039;" title="My Namespace:Edit Guide">→‎&#039;&#039;&#039;Structure of the DAT File&#039;&#039;&#039;</a></span></span>'
      },
      metadata: {
        tags: [],
        sha1: '9cfb3dfc2870291a9b368a9b4956fedddd83eedd'
      },
      log: {
        id: null,
        type: null,
        action: null,
        params: null
      }
    },
    // ...
  ]
}
```

The response is type `RcResult`, and the individual items in `editRecords` is type `RcEditRecord`.

When creating the `MwRecent()` instance, you need to pass on the base url (for user facing urls), and the location where `api.php` can be found.

### Record types

MediaWiki has many different types of recent changes it can display. The most common, a regular page edit, is represented in the example above.

For other types of edits, refer to the `editType` and `log` values. In the case of a regular page edit, the `log` value is all nulls, but it contains useful information for other edit types:

| Record type | editType | log.type | log.action | Notes |
|:------------|:---------|:---------|:-----------|:------|
| Page edit | `edit` | null | null | – |
| Page creation | `new` | null | null | – |
| Page move/rename | `log` | `move` | `move` | `page.title` is the old name; `log.params.target_title` is the new name |
| Page deletion | `log` | `delete` | `delete` | `comments` contains delete reason |
| File upload | `log` | `upload` | `upload` | `log.params` contains image hash |
| File deletion | `log` | `delete` | `delete` | – |
| User registration | `log` | `newusers` | `create` | `log.params` contains `userid` |
| User ban | `log` | `block` | `block` | `comments` contains ban reason |

These cover most basic use cases. Many other recent change types are available.

In all cases, `log.params` will contain information returned to us by the api verbatim.

## External links

* [MediaWiki API - RecentChanges](https://www.mediawiki.org/wiki/API:RecentChanges) – api documentation for the `recentchanges` action

## License

MIT licensed.
