// @dada78641/mwrecent <https://github.com/msikma/mwrecent>
// © MIT license

/**
 * Ensures that a trailing slash is present.
 * 
 * @param urlpath url or path, e.g. http://example.com/w
 * @returns url or path with trailing slash added if it wasn't there
 */
export function ensureTrailingSlash(urlpath: string) {
  if (!urlpath.endsWith('/')) {
    return `${urlpath}/`
  }
  return urlpath
}
