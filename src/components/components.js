////////////
// IMPORT //
////////////

import modalComponentModule from './modal/modal.module';
import mediaLibraryComponentModule from './media-library/mediaLibrary.module';
import editorComponentModule from './editor/editor.module';

import headerComponent from './header/header.component';


////////////
// EXPORT //
////////////

export default angular.module('qfap.components', [
    modalComponentModule,
    mediaLibraryComponentModule,
    editorComponentModule
  ])
  .component('qfapHeader', headerComponent)
  .name;