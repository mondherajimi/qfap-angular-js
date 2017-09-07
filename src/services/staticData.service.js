
//////////////
// SERVICES //
//////////////

class StaticDataService {

  /*@ngInject*/
  constructor(Api) {
    this.Api = Api;
  }

  // GROUPS
  getGroups() {
    if (_.isArray(this.groups) && !_.isEmpty(this.groups))
      return this.groups;

    return this.Api.get('/groupes', { sort: 'id' })
      .then((success) => {
        let groups = _.isArray(success.data) ? success.data : [];
        this.groups = groups;

        return groups;
      });
  }

  // ROLES
  getRoles() {
    if (_.isArray(this.roles) && !_.isEmpty(this.roles))
      return this.roles;

    return this.Api.get('/roles', { sort: 'id' })
      .then((success) => {
        let roles = _.isArray(success.data) ? success.data : [];
        this.roles = roles;

        return roles;
      });
  }

  // PAGES STATUS
  getPagesStatus() {
    if (_.isArray(this.pagesStatus) && !_.isEmpty(this.pagesStatus))
      return this.pagesStatus;

    return this.Api.get('/pagesStatuts', { sort: 'id' })
      .then((success) => {
        let pagesStatus = _.isArray(success.data) ? success.data : [];
        this.pagesStatus = pagesStatus;

        return pagesStatus;
      });
  }

  // PAGES TYPES
  getPagesTypes() {
    if (_.isArray(this.pagesTypes) && !_.isEmpty(this.pagesTypes))
      return this.pagesTypes;

    return this.Api.get('/pagesTypes', { sort: 'id' })
      .then((success) => {
        let pagesTypes = _.isArray(success.data) ? success.data : [];
        this.pagesTypes = pagesTypes;

        return pagesTypes;
      });
  }

  // CATEGORIES
  getCategories() {
    if (_.isArray(this.categories) && !_.isEmpty(this.categories))
      return this.categories;

    return this.Api.get('/categories', { sort: 'id' })
      .then((success) => {
        let categories = _.isArray(success.data) ? success.data : [];
        this.categories = categories;

        return categories;
      });
  }

  // TAGS
  // TODO - WARNING NOT STATIC
  getTags() {
     if (_.isArray(this.tags) && !_.isEmpty(this.tags))
      return this.tags;

    return this.Api.get('/tags', { sort: 'id', limit: 200 })
      .then((success) => {
        let tags = _.isArray(success.data) ? success.data : [];
        this.tags = tags;

        return tags;
      });
  }

  // INFOBULLES
  getInfobulles(){
    if (_.isArray(this.infobulles) && !_.isEmpty(this.infobulles))
      return this.infobulles;

    return this.Api.get('/infobulles', { sort: 'id', limit: 200 })
      .then((success) => {
        let infobulles = _.isArray(success.data) ? success.data : [];
        this.infobulles = infobulles;

        return infobulles;
      });
  }

  // MESSAGES MODERATION
  getMessages(){
    if (_.isArray(this.messages) && !_.isEmpty(this.messages))
      return this.messages;

    return this.Api.get('/messagesmoderation', { sort: 'id', limit: 200 })
      .then((success) => {
        let messages = _.isArray(success.data) ? success.data : [];
        this.messages = messages;

        return messages;
      });
  }
}


////////////
// EXPORT //
////////////

export default StaticDataService;
