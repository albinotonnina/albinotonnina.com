/* global matchMedia, XMLHttpRequest, XDomainRequest */

(function (window, document) {
  'use strict'

  module.exports = function (skrollr) {
    var content
    var contents = []

        // Finds the declaration of an animation block.
    var rxAnimation = /@-skrollr-keyframes\s+([\w-]+)/g

        // Finds the block of keyframes inside an animation block.
        // http://regexpal.com/ saves your ass with stuff like this.
    var rxKeyframes = /\s*\{\s*((?:[^{]+\{[^}]*\}\s*)+?)\s*\}/g

        // Gets a single keyframe and the properties inside.
    var rxSingleKeyframe = /([\w-]+)\s*\{([^}]+)\}/g

        // Optional keyframe name prefix to work around SASS (>3.4) issues
    var keyframeNameOptionalPrefix = 'skrollr-'

        // Finds usages of the animation.
    var rxAnimationUsage = /-skrollr-animation-name\s*:\s*([\w-]+)/g

        // Finds usages of attribute setters.
    var rxAttributeSetter = /-skrollr-(anchor-target|smooth-scrolling|emit-events|menu-offset)\s*:\s*['"]([^'"]+)['"]/g

    var fetchRemote = function (url) {
      var xhr = new XMLHttpRequest()

            /*
             * Yes, these are SYNCHRONOUS requests.
             * Simply because skrollr stylesheets should run while the page is loaded.
             * Get over it.
             */
      try {
        xhr.open('GET', url, false)
        xhr.send(null)
      } catch (e) {
                // Fallback to XDomainRequest if available
        if (window.XDomainRequest) {
          xhr = new XDomainRequest()
          xhr.open('GET', url, false)
          xhr.send(null)
        }
      }

      return xhr.responseText
    }

        // "main"
    var kickstart = function (stylesheets) {
            // Iterate over all stylesheets, embedded and remote.
      for (var stylesheetIndex = 0; stylesheetIndex < stylesheets.length; stylesheetIndex++) {
        var sheet = stylesheets[stylesheetIndex]

        if (sheet.tagName === 'LINK') {
          if (sheet.getAttribute('data-skrollr-stylesheet') === null) {
            continue
          }

                    // Test media attribute if matchMedia available.
          if (window.matchMedia) {
            var media = sheet.getAttribute('media')

            if (media && !matchMedia(media).matches) {
              continue
            }
          }

                    // Remote stylesheet, fetch it (synchrnonous).
          content = fetchRemote(sheet.href)
        } else {
                    // Embedded stylesheet, grab the node content.
          content = sheet.textContent || sheet.innerText || sheet.innerHTML
        }

        if (content) {
          contents.push(content)
        }
      }

            // We take the stylesheets in reverse order.
            // This is needed to ensure correct order of stylesheets and inline styles.
      contents.reverse()

      var animations = {}
      var selectors = []
      var attributes = []

            // Now parse all stylesheets.
      for (var contentIndex = 0; contentIndex < contents.length; contentIndex++) {
        content = contents[contentIndex]

        parseAnimationDeclarations(content, animations)
        parseAnimationUsage(content, selectors)
        parseAttributeSetters(content, attributes)
      }

      applyKeyframeAttributes(animations, selectors)
      applyAttributeSetters(attributes)
    }

        // Finds animation declarations and puts them into the output map.
    var parseAnimationDeclarations = function (input, output) {
      rxAnimation.lastIndex = 0

      var animation
      var rawKeyframes
      var keyframe
      var curAnimation

      while ((animation = rxAnimation.exec(input)) !== null) {
                // Grab the keyframes inside this animation.
        rxKeyframes.lastIndex = rxAnimation.lastIndex
        rawKeyframes = rxKeyframes.exec(input)

                // Grab the single keyframes with their CSS properties.
        rxSingleKeyframe.lastIndex = 0

                // Save the animation in an object using it's name as key.
        curAnimation = output[animation[1]] = {}

        while ((keyframe = rxSingleKeyframe.exec(rawKeyframes[1])) !== null) {
                    // Put all keyframes inside the animation using the keyframe (like botttom-top, or 100) as key
                    // and the properties as value (just the raw string, newline stripped).
          curAnimation[keyframe[1]] = keyframe[2].replace(/[\n\r\t]/g, '')
        }
      }
    }

        // Extracts the selector of the given block by walking backwards to the start of the block.
    var extractSelector = function (input, startIndex) {
      var begin
      var end = startIndex

            // First find the curly bracket that opens this block.
      while (end-- && input.charAt(end) !== '{') {
      }

            // The end is now fixed to the right of the selector.
            // Now start there to find the begin of the selector.
      begin = end

            // Now walk farther backwards until we grabbed the whole selector.
            // This either ends at beginning of string or at end of next block.
      while (begin-- && input.charAt(begin - 1) !== '}') {
      }

            // Return the cleaned selector.
      return input.substring(begin, end).replace(/[\n\r\t]/g, '')
    }

        // Finds usage of animations and puts the selectors into the output array.
    var parseAnimationUsage = function (input, output) {
      var match
      var selector

      rxAnimationUsage.lastIndex = 0

      while ((match = rxAnimationUsage.exec(input)) !== null) {
                // Extract the selector of the block we found the animation in.
        selector = extractSelector(input, rxAnimationUsage.lastIndex)

                // Associate this selector with the animation name.
        output.push([selector, match[1]])
      }
    }

        // Finds usage of attribute setters and puts the selector and attribute data into the output array.
    var parseAttributeSetters = function (input, output) {
      var match
      var selector

      rxAttributeSetter.lastIndex = 0

      while ((match = rxAttributeSetter.exec(input)) !== null) {
                // Extract the selector of the block we found the animation in.
        selector = extractSelector(input, rxAttributeSetter.lastIndex)

                // Associate this selector with the attribute name and value.
        output.push([selector, match[1], match[2]])
      }
    }

        // Applies the keyframes (as data-attributes) to the elements.
    var applyKeyframeAttributes = function (animations, selectors) {
      var elements
      var keyframes
      var keyframeName
      var cleanKeyframeName
      var elementIndex
      var attributeName
      var attributeValue
      var curElement

      for (var selectorIndex = 0; selectorIndex < selectors.length; selectorIndex++) {
        elements = document.querySelectorAll(selectors[selectorIndex][0])

        if (!elements) {
          continue
        }

        keyframes = animations[selectors[selectorIndex][1]]

        for (keyframeName in keyframes) {
          if (keyframeName.indexOf(keyframeNameOptionalPrefix) === 0) {
            cleanKeyframeName = keyframeName.substring(keyframeNameOptionalPrefix.length)
          } else {
            cleanKeyframeName = keyframeName
          }

          for (elementIndex = 0; elementIndex < elements.length; elementIndex++) {
            curElement = elements[elementIndex]
            attributeName = 'data-' + cleanKeyframeName
            attributeValue = keyframes[keyframeName]

                        // If the element already has this keyframe inline, give the inline one precedence by putting it on the right side.
                        // The inline one may actually be the result of the keyframes from another stylesheet.
                        // Since we reversed the order of the stylesheets, everything comes together correctly here.
            if (curElement.hasAttribute(attributeName)) {
              attributeValue += curElement.getAttribute(attributeName)
            }

            curElement.setAttribute(attributeName, attributeValue)
          }
        }
      }
    }

        // Applies the keyframes (as data-attributes) to the elements.
    var applyAttributeSetters = function (selectors) {
      var curSelector
      var elements
      var attributeName
      var attributeValue
      var elementIndex

      for (var selectorIndex = 0; selectorIndex < selectors.length; selectorIndex++) {
        curSelector = selectors[selectorIndex]
        elements = document.querySelectorAll(curSelector[0])
        attributeName = 'data-' + curSelector[1]
        attributeValue = curSelector[2]

        if (!elements) {
          continue
        }

        for (elementIndex = 0; elementIndex < elements.length; elementIndex++) {
          elements[elementIndex].setAttribute(attributeName, attributeValue)
        }
      }
    }

    var init = function (skrollr) {
      skrollr.stylesheets = {}

      skrollr.stylesheets.init = function () {
        kickstart(document.querySelectorAll('link, style'))
      }
    }

    init(skrollr)
  }
}(window, document))
