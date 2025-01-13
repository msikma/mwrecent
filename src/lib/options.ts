// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

import type {RecentChangesOptions} from '../types.ts'

// Types of options we're converting to search params.
const optionTypes = {
  verbatim: [
    'feedformat',
    'namespace',
    'days',
    'limit',
    'from',
    'target',
    // Global api arguments
    'action',
    'urlversion',
  ],
  bool: [
    'invert',
    'associated',
    'hideminor',
    'hidebots',
    'hideliu',
    'hidepatrolled',
    'hidemyself',
    'hidecategorization',
    'inverttags',
  ],
  array: [
    'tagfilter',
  ],
}

/**
 * Returns whether a string is a valid date.
 * 
 * @param date input date
 * @returns whether the date is valid for use in mwrecent options
 */
export function isValidDate(date: Date | string) {
  if (date === 'now') {
    return true
  }
  const parsedDate = new Date(date)
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime())
}

/**
 * Throws an error if a given object does not represent a valid options object.
 * 
 * @param options options object to check
 */
export function assertValidOptions(options: RecentChangesOptions) {
  const {days, limit, from} = options
  if (days != null && days < 1) {
    throw new Error(`'days' must be no less than 1: ${days}`)
  }
  if (limit != null && (limit < 1 || limit > 50)) {
    throw new Error(`'limit' must be between 1 and 50: ${limit}`)
  }
  if (from != null && !isValidDate(from)) {
    throw new Error(`'from' must be a parseable date or the string "now": ${from}`)
  }
  return options
}

/**
 * Converts an object of options to search parameters for the api url.
 * 
 * @param options options for our api call
 * @returns url search parameters for making an api call with
 */
export function optionsToParams(options: RecentChangesOptions): URLSearchParams {
  const params = new URLSearchParams()
  for (const tag of optionTypes.verbatim) {
    if (!(tag in options)) {
      continue
    }
    params.set(tag, String(options[tag]))
  }
  for (const tag of optionTypes.bool) {
    if (!(tag in options)) {
      continue
    }
    params.set(tag, options[tag] ? '1' : '0')
  }
  for (const tag of optionTypes.array) {
    if ((!(tag in options)) || !Array.isArray(options[tag])) {
      continue
    }
    params.set(tag, options[tag].join('|'))
  }
  return params
}

/**
 * Merges in defaults and returns an options object.
 * 
 * @param options options object to check
 */
export function getRecentChangesOptions(options: RecentChangesOptions) {
  const defaultParams = {
    days: 90,
    limit: 50,
  }
  return assertValidOptions({
    ...defaultParams,
    ...options,
    action: 'feedrecentchanges',
    feedformat: 'atom',
    urlversion: '1',
  })
}
