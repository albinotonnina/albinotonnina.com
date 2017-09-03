/**
 * Creates a read/writable property which returns a function set for write/set (assignment)
 * and read/get access on a variable
 *
 * @param {Any} value initial value of the property
 */
function createProperty (value) {
  var _value = value

    /**
     * Overwrite getter.
     *
     * @returns {Any} The Value.
     * @private
     */
  function _get () {
    return _value
  }

    /**
     * Overwrite setter.
     *
     * @param {Any} v   Sets the value.
     * @private
     */
  function _set (v) {
    _value = v
  }

  return {
    'get': _get,
    'set': _set
  }
}

/**
 * Creates or replaces a read-write-property in a given scope object, especially for non-writable properties.
 * This also works for built-in host objects (non-DOM objects), e.g. navigator.
 * Optional an initial value can be passed, otherwise the current value of the object-property will be set.
 *
 * @param {Object} objBase  e.g. window
 * @param {String} objScopeName    e.g. "navigator"
 * @param {String} propName    e.g. "userAgent"
 * @param {Any} initValue (optional)   e.g. window.navigator.userAgent
 */
function makePropertyWritable (objBase, objScopeName, propName, initValue) {
  var newProp,
    initObj

  if (objBase && objScopeName in objBase && propName in objBase[objScopeName]) {
    if (typeof initValue === 'undefined') {
      initValue = objBase[objScopeName][propName]
    }

    newProp = createProperty(initValue)

    try {
      Object.defineProperty(objBase[objScopeName], propName, newProp)
    } catch (e) {
      initObj = {}
      initObj[propName] = newProp
      try {
        objBase[objScopeName] = Object.create(objBase[objScopeName], initObj)
      } catch (e) {
                // Workaround, but necessary to overwrite native host objects
      }
    }
  }
}

export default makePropertyWritable
