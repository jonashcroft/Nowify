/**
 * Utils: Utilities.
 * - Global functions that can be used across multiple files.
 * -----------------------------------------------------------------------------
 */

/**
 * Config object.
 */
const config = {
  authNamespace: 'nowify_auth_state'
}

/**
 * Get stored authorisation object.
 * @return {Object}
 */
export function getStoredAuth() {
  return JSON.parse(window.localStorage.getItem(config.authNamespace)) || {}
}

/**
 * Set stored authorisation object.
 * @return {Object}
 */
export function setStoredAuth(authState = {}) {
  window.localStorage.setItem(config.authNamespace, JSON.stringify(authState))
}
