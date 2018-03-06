export default {
  props: {
    source: {
      type: Object,
      required: true
    },
    editorMode: {
      type: Boolean,
      default: false
    },
    property: String,
    isActive: Boolean,
    isHidden: Boolean
  }
}
