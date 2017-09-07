////////////////
// CONTROLLER //
////////////////

class MessagesmodalController {

  /*@ngInject*/
  constructor(Api, group) {

  	this.Api = Api;

  	var query = {
          group: group
        };

  	Api
  	 .get('/messagesbureaux/get_group_messages', { params: query })
     .then((data) => {
     	this.messages = data.data;
      });

  }

}

////////////
// EXPORT //
////////////

export default MessagesmodalController;
