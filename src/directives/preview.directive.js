///////////////
// DIRECTIVE //
///////////////

/*@ngInject*/
function previewDirective(StyleguideService) {

  return {
    restrict: 'E',
    scope: {
      type: '<',
      data: '<'
    },
    link: function(scope, element, attrs, ctrl) {

      scope.$watch('data', function() {
        const componentTypeFn = StyleguideService.component(scope.type);
        let previewHtml = '';

        if (_.isFunction(componentTypeFn)) {
          previewHtml = componentTypeFn(scope.data);
        }

        element.html(previewHtml);
      }, true);
    }
  };
}


////////////
// EXPORT //
////////////

export default previewDirective;