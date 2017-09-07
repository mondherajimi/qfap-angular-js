////////////
// IMPORT //
////////////

import uiBootstrap from 'uiBootstrap';
import ngFileUpload from 'ngFileUpload';
//import MediaLibraryConfig from './mediaLibrary.config'
import MediaLibraryController from './mediaLibrary.controller';
import MediaLibraryService from './mediaLibrary.service';
import 'ngTagsInput';



////////////
// EXPORT //
////////////

export default angular.module('qfap.mediaLibrary', [
	uiBootstrap,
	ngFileUpload,
	'ngTagsInput'
  ])
  //.config(MediaLibraryConfig)
  .controller('MediaLibraryController', MediaLibraryController)
  .service('MediaLibraryService', MediaLibraryService)
  .name;