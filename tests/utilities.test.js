/* global describe, it, expect, jest, afterEach */

import makePropertyWritable from './utils/makePropertyWritable'
import * as utils from '../src/scripts/utilities'

jest.mock('webfontloader', () => {
  return {
    load: ({active}) => active()
  }
})

describe('Utilities', () => {
  describe('isMobile', () => {
    const _originalUserAgent = navigator.userAgent
    makePropertyWritable(window, 'navigator', 'userAgent')

    afterEach(() => {
      window.navigator.userAgent = _originalUserAgent
    })

    it('should return false if not mobile', () => {
      expect(utils.isMobile()).toEqual(false)
    })

    it('should return true if Android', () => {
      window.navigator.userAgent = 'Mozilla/5.0 (Linux; U; Android 1.5; de-de; HTC Magic Build/CRB17) AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1'
      expect(utils.isMobile()).toEqual(true)
    })

    it('should return true if iOs', () => {
      window.navigator.userAgent = 'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10'
      expect(utils.isMobile()).toEqual(true)
    })
  })

  describe('waitForWebfonts', () => {
    it('should invoke callback after load', (done) => {
      utils.waitForWebfonts(['Roboto:400,100,300,700,900'], () => {
        done()
      })
    })
  })

  describe('setAttribute', () => {
    it('should set an attribute to an element', () => {
      const dummyEl = document.createElement('div')
      utils.setAttributes(dummyEl, {ping: 'pong', foo: 'bar'})
      expect(dummyEl.attributes.length).toEqual(2)
    })

    it('should set an attribute with value to element', () => {
      const dummyEl = document.createElement('div')
      utils.setAttributes(dummyEl, {ping: 'pong'})
      expect(dummyEl.getAttribute('ping')).toEqual('pong')
    })
  })

  describe('createElementWithAttrs', () => {
    it('should create an element and set an attribute to it', () => {
      const dummyEl = utils.createElementWithAttrs('div', {ping: 'pong', foo: 'bar'})
      expect(dummyEl.attributes.length).toEqual(2)
    })

    it('should set an attribute with value to element', () => {
      const dummyEl = utils.createElementWithAttrs('div', {ping: 'pong'})
      expect(dummyEl.getAttribute('ping')).toEqual('pong')
    })
  })

  describe('shouldFallbackToBoringCV', () => {
    it('should fallback because the window is too narrow', () => {
      global.window.innerWidth = 500
      global.window.innerHeight = 600
      expect(utils.shouldFallbackToBoringCV()).toEqual(true)
    })

    it('should not fallback', () => {
      global.window.innerWidth = 600
      global.window.innerHeight = 400
      expect(utils.shouldFallbackToBoringCV()).toEqual(false)
    })
  })
})
