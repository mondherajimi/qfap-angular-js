////////////
// IMPORT //
////////////

// import directivesConfig from './directives.config';

import placeholderDirective from './placeholder.directive';
import selectNumberDirective from './selectNumber.directive';
import previewDirective from './preview.directive';
import controlsDirective from './controls/controls.directive';


////////////
// EXPORT //
////////////

export default angular.module('qfap.directives', [
  ])
  // .config(directivesConfig)
  .directive('ph', placeholderDirective)
  .directive('selectNumber', selectNumberDirective)
  .directive('preview', previewDirective)
  .directive('controls', controlsDirective)
  .name;