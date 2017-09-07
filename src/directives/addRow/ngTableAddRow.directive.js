(function(){
    'use strict';

    // set addRow html template to 'ng-table/addRow.html' $templateCache key
    var addRowTemplate = require('!ngtemplate?module=ngTable&relativeTo=/src/directives/addRow/&prefix=ng-table/!html!./addRow.html');

    angular.module('ngTable')
        .directive('ngTableAddRow', ngTableAddRow);

    ngTableAddRow.$inject = [];

    function ngTableAddRow(){
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: addRowTemplate,
            scope: true,
            // controller: 'ngTableAddRowController'
        };
        return directive;
    }
})();
