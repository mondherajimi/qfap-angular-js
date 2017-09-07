////////////
// IMPORT //
////////////

// medium-editor insert plugin
import 'imports?this=>window!mediumEditorInsertPluginTemplates';
import 'imports!mediumEditorInsertPluginCore';

import insertPluginRun from './insertPlugin.run';
import InsertPluginService from './insertPlugin.service';


////////////
// EXPORT //
////////////

export default angular.module('qfap.editor.components.insert-plugin', [])
  .run(insertPluginRun)
  .service('InsertPluginService', InsertPluginService)
  .name;