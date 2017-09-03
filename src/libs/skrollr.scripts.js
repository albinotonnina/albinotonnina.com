import skrollr from 'skrollr'
import skrollrmenu from '../libs/skrollr.menu'
import skrollrstylesheets from '../libs/skrollr.stylesheets'

export default function () {
  skrollrstylesheets(skrollr)

  skrollrmenu(skrollr)

  return skrollr
}
