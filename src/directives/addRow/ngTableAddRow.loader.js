////////////
// HELPER //
////////////

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}


////////////
// IMPORT //
////////////

import 'ngTable';
import './ngTableAddRow.directive';

// Add custom addRowHeader.html template to 'ng-table/addRowHeader.html' $templateCache key.
// To set it in ngTables, add template-header="ng-table/addRowHeader.html" attribute to <table> tag.
import '!ngtemplate?module=ngTable&relativeTo=/src/directives/addRow/&prefix=ng-table/!html!./addRowHeader.html';

// Set 'add' templates:
// Require all html templates in ./add folder.
// Add templates are stored in 'ng-table/add/<add>.html' $templateCache key.
requireAll(require.context("!ngtemplate?module=ngTable&relativeTo=/src/directives/addRow/&prefix=ng-table/!html!./add", true, /\.html$/));

// Override filters templates:
// Filters templates are stored in 'ng-table/filters/<filter>.html' $templateCache key,
// by setting another template to this key we override the default ng-table template.
// Another solution could have been to set a different filter template baseUrl during config,
// or even to specify the $templateCache key in the column filter definition
requireAll(require.context("!ngtemplate?module=ngTable&relativeTo=/src/directives/addRow/&prefix=ng-table/!html!./filters", true, /\.html$/));
