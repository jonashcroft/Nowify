/**
 * Util: Props
 * - Helper file to keep consistent props across all components.
 * -----------------------------------------------------------------------------
 */
export default {
  msg: {
    type: String,
    default: ''
  },
  auth: {
    type: Object,
    default: () => ({})
  },
  endpoints: {
    type: Object,
    default: () => ({})
  },
  props: {
    type: Object,
    default: () => ({})
  }
}
