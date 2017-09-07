////////////
// IMPORT //
////////////

import controlsTemplate from './controls.html';


///////////////
// DIRECTIVE //
///////////////

/*@ngInject*/
function controlsDirective($compile) {

  return {
    restrict: 'A',
    scope: {
      controlsConfig: '&controls'
    },
    link: function(scope, element, attrs, ctrls) {
      var defaultConfig = {
        show: true,
        position: 'top-right',
        triggerShow: 'mouseenter',
        triggerHide: 'mouseleave',
        buttons: [
          // {
          //   label: '',
          //   icon: '',
          //   class: '',
          //   action: function() {}
          // }
        ]
      };

      // build config
      var controlsConfig = (scope.controlsConfig) ? angular.copy(scope.controlsConfig()) : {};
      var config = angular.extend({}, defaultConfig, controlsConfig);
      scope.config = config;

      // add container class
      element.addClass('controls-container');

      // compile controls template
      var $controls = $compile(controlsTemplate)(scope);

      // functions to show/hide controls on event
      function show() {
        $controls = $compile(controlsTemplate)(scope);
        element.append($controls);
      }
      function hide() {
        $controls.remove();
      }
      function bindTriggers() {
        element.on(config.triggerShow, show);
        element.on(config.triggerHide, hide);
      }
      function unbindTriggers() {
        element.off(config.triggerShow);
        element.off(config.triggerHide);
      }

      // controls are always shown
      if (config.show) {
        element.append($controls);
      }
      // controls are shown/hidden on event
      else {
        bindTriggers();
      }

      // trigger the button action
      // set the element in parameter
      scope.triggerAction = function(action) {
        return action(element);
      };

      scope.$on('$destroy', function() {
        if (!config.show) {
          unbindTriggers();
        }
      });
    }
  };
}


////////////
// EXPORT //
////////////

export default controlsDirective;
