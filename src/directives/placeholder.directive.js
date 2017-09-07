///////////////
// DIRECTIVE //
///////////////

/*@ngInject*/
function placeholderDirective() {

  return {
    restrict: 'A',
    link: function(scope, element, attrs, ctrl) {
      var placeholder = attrs.ph;
      element[0].placeholder = placeholder;

      element.on('focus', function() {
        this.placeholder = '';
      });

      element.on('blur', function() {
        this.placeholder = placeholder;
      });

      element.on('$destroy', function() {
        element.off('blur focus');
      });
    }
  };
}


////////////
// EXPORT //
////////////

export default placeholderDirective;