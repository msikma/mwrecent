// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

/// The following are option types that can be passed to the library.
/// These map directly to the api documentation: <https://www.mediawiki.org/wiki/API:RecentChanges>.

// Criteria we can filter by.
export type EditCriteria = '!anon' | '!autopatrolled' | '!bot' | '!minor' | '!patrolled' | '!redirect'
  | 'anon' | 'autopatrolled' | 'bot' | 'minor' | 'patrolled' | 'redirect' | 'unpatrolled'

// Props returned per recent change item.
export type EditProps = 'comment' | 'flags' | 'ids' | 'loginfo' | 'parsedcomment' | 'patrolled'
  | 'redirect' | 'sha1' | 'sizes' | 'tags' | 'timestamp' | 'title' | 'user' | 'userid'

// Types of edits we can filter by.
export type EditTypes = 'categorize' | 'edit' | 'external' | 'log' | 'new'

// Individual keys.
export type RcOptionKey = keyof RcOptionsFull

// Full options interface that the api accepts.
export interface RcOptionsFull {
  rcstart: Date | string
  rcend: Date | string
  rcdir: 'newer' | 'older'
  rcnamespace: number[] | '*'
  rcuser: string
  rcexcludeuser: string
  rctag: string[]
  rcprop: EditProps[]
  rcshow: EditCriteria[]
  rclimit: number
  rctype: EditTypes[]
  rctoponly: boolean
  rctitle: string
  rccontinue: string
  rcgeneraterevisions: boolean
  rcslot: string
}

// Partial interface used by library consumers.
export type RcOptions = Partial<RcOptionsFull>

// Full query; this gets converted into a URLSearchParams object directly.
export type RcParams = RcOptions
  & {
    action: 'query'
    list: 'recentchanges'
    format: 'json'
  }

/// The following are response types that we receive from the api.

// A single recent change item.
export interface RcItem {
  type: EditTypes
  ns: number
  title: string
  pageid: number
  revid: number
  old_revid: number
  rcid: number
  user: string
  userid: number
  oldlen: number
  newlen: number
  timestamp: string
  comment: string
  parsedcomment: string
  tags: string[]
  sha1: string
}

// The full response.
export interface RcResponse {
  batchcomplete: string
  continue: {
    rccontinue: string
    continue: string
  }
  query: {
    recentchanges: RcItem[]
  }
}

/// The following are what we return to the library consumer.

export interface RcResult {
  apiUrl: string
  baseUrl: string
  editRecords: RcEditRecord[]
}

// A single recent change record.
export interface RcEditRecord {
  editType: string
  page: {
    id: number
    title: string
    name: string
    url: string
    namespace: string
    namespaceId: number
  }
  revision: {
    revisionUrl: string
    revisionDiffUrl: string
    currentRevisionId: number
    previousRevisionId: number
    revisionChangeId: number
  }
  editor: {
    username: string
    userId: number
  }
  length: {
    old: number
    new: number
  }
  timestamps: {
    editedAt: Date
  }
  comments: {
    raw: string | null
    parsed: string | null
  }
  metadata: {
    tags: string[]
    sha1: string
  }
}

export type PartialRcEditRecord = {
  editType: string
  page: Partial<RcEditRecord['page']>
  revision: Partial<RcEditRecord['revision']>
  editor: Partial<RcEditRecord['editor']>
  length: Partial<RcEditRecord['length']>
  timestamps: Partial<RcEditRecord['timestamps']>
  comments: Partial<RcEditRecord['comments']>
  metadata: Partial<RcEditRecord['metadata']>
}
