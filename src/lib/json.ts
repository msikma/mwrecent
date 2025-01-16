// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

import type {RcResponse} from '../types.ts'

/**
 * Checks whether a given object is a recent changes json object or not.
 * 
 * @param json any given object
 * @returns whether the object is a recent changes json object
 */
function isRcJson(json: any): json is RcResponse {
  if (!('query' in json)) {
    return false
  }
  if (!('recentchanges' in json.query)) {
    return false
  }
  return true
}

/**
 * Requests the recent changes json from the server and asserts it has the correct data.
 * 
 * @param url api url to fetch data from
 * @returns recent changes json data with types
 */
export async function fetchRcJson(url: URL | string): Promise<RcResponse> {
  const res = await fetch(url)
  const json = await res.json()
  if (!isRcJson(json)) {
    throw new Error('server response invalid')
  }
  return json
}
