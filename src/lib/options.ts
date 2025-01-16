// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

import {difference, intersection} from 'lodash-es'
import type {RcOptions, RcOptionKey, RcParams, EditProps} from '../types.ts'

// All recent changes props we can request.
export const ALL_RC_PROPS: EditProps[] = [
  'user',
  'userid',
  'comment',
  'parsedcomment',
  'flags',
  'timestamp',
  'title',
  'ids',
  'sizes',
  'redirect',
  'patrolled',
  'loginfo',
  'tags',
  'sha1'
]

// All props that cannot normally be requested without having a special permission.
export const ALL_RESTRICTED_RC_PROPS: EditProps[] = [
  'patrolled',
]

// All props that can be publicly requested.
export const ALL_PUBLIC_RC_PROPS: EditProps[] = difference(ALL_RC_PROPS, ALL_RESTRICTED_RC_PROPS)

// Option types; this determines how they're converted to URL parameters.
const optionTypes = {
  string: [
    'rcstart',
    'rcend',
    'rcdir',
    'rcuser',
    'rcexcludeuser',
    'rclimit',
    'rctitle',
    'rccontinue',
    'rcslot',
    // Required parameters.
    'action',
    'list',
    'format',
  ],
  boolean: [
    'rctoponly',
    'rcgeneraterevisions',
  ],
  array: [
    'rctag',
    'rcprop',
    'rcshow',
    'rctype',
  ],
  arrayOrWildcard: [
    'rcnamespace'
  ],
}

/**
 * Returns whether all the public edit props are present in a given list of edit props.
 * 
 * @param props given list of edit props
 * @returns whether the given list includes all the public edit props
 */
export function hasAllPublicEditProps(props: EditProps[]): boolean {
  const intr = intersection(props, ALL_PUBLIC_RC_PROPS)
  return intr.length === ALL_PUBLIC_RC_PROPS.length
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
 * Very basic checking only for now.
 * 
 * @param options options object to check
 */
export function assertValidOptions(options: RcOptions) {
  const {rcstart, rcend, rcdir} = options
  if (rcdir === 'newer' && rcstart && rcend && rcstart > rcend) {
    throw new Error(`when enumerating oldest first, 'rcstart' has to be before 'rcend'`)
  }
  if (rcdir === 'older' && rcstart && rcend && rcstart < rcend) {
    throw new Error(`when enumerating newest first, 'rcstart' has to be after 'rcend'`)
  }
  return options
}

/**
 * Converts an object of options to search parameters for the api url.
 * 
 * @param options options for our api call
 * @returns url search parameters for making an api call with
 */
export function optionsToParams(options: RcParams): URLSearchParams {
  const params = new URLSearchParams()

  for (const [type, keys] of Object.entries(optionTypes)) {
    for (const key of keys) {
      // All items are optional (but at this point we will have merged in required parameters).
      if (!(key in options)) {
        continue
      }

      // Assert that this is a valid option key.
      const tag = key as RcOptionKey

      // Convert the item to a URL parameter.
      if (type === 'string') {
        params.set(tag, String(options[tag]))
      }
      if (type === 'boolean') {
        params.set(tag, options[tag] ? '1' : '0')
      }
      if (type === 'array' || type === 'arrayOrWildcard') {
        if (type === 'arrayOrWildcard' && options[tag] === '*') {
          params.set(tag, options[tag])
        }
        else {
          if (!Array.isArray(options[tag])) {
            throw new Error(`'${tag}' should be an array`)
          }
          params.set(tag, options[tag].join('|'))
        }
      }
    }
  }

  return params
}

/**
 * Merges in defaults and returns an options object.
 * 
 * @param options options object to check
 */
export function getRcOptions(options: RcOptions) {
  const defaultOptions: RcOptions = {
    rcnamespace: '*',
    rcprop: ALL_PUBLIC_RC_PROPS,
    rclimit: 10,
  }
  return assertValidOptions({
    ...defaultOptions,
    ...options,
  })
}
