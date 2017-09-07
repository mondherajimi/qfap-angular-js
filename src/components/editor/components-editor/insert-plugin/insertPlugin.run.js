/////////
// RUN //
/////////

/*@ngInject*/
function insertPluginRun(InsertPluginService) {
  InsertPluginService.insertAll();
}


////////////
// EXPORT //
////////////

export default insertPluginRun;