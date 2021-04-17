/**
 * Util: Utilities
 * Global functions that can be used across multiple files.
 */

/**
 * Example Function.
 */
//  export function superCool() {
// return 'x';
//  }

const config = {
  authNamespace: 'nowify_auth_state'
}

/**
 * @return {Object}
 */
export function getStoredAuth() {
  return JSON.parse(window.localStorage.getItem(config.authNamespace)) || {}
}

/**
 * @return {Object}
 */
export function setStoredAuth(authState = {}) {
  window.localStorage.setItem(config.authNamespace, JSON.stringify(authState))
}
