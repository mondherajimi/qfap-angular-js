////////////
// IMPORT //
////////////

import { dateFormat, boolChoice } from './common.filter';
import { getFullName } from './user.filter';
import { path, keywords, formatSize } from './media.filter';
import staticDataFilter from './staticData.filter';


////////////
// EXPORT //
////////////

export default angular.module('qfap.filters', [])
  .filter('dateFormat', dateFormat)
  .filter('boolChoice', boolChoice)
  .filter('getFullName', getFullName)
  .filter('path', path)
  .filter('keywords', keywords)
  .filter('formatSize', formatSize)
  .filter('staticData', staticDataFilter)
  .name;