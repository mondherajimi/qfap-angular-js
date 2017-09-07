////////////////
// CONTROLLER //
////////////////

class UsersController {

  /*@ngInject*/
  constructor(Api, USER_ACCESS, UserService, ModalService, NgTableParams, roles, groups) {
    this.Api = Api;
    this.UserService = UserService;
    this.USER_ACCESS = USER_ACCESS;
    this.ModalService = ModalService;

    this.roles = _.clone(roles);
    this.groups = _.clone(groups);
    this.currentUser = UserService.user;

    // filter roles and groups according to user rights
    _.remove(this.roles, (role) => { return role.id > this.currentUser.role; });
    if (UserService.isModerator()) {
      _.remove(this.roles, (role) => { return role.id === USER_ACCESS.userRoles.user; });
      _.remove(this.groups, (group) => { return group.id !== this.currentUser.group; });
    }

    // DOCS : https://github.com/esvit/ng-table/wiki/Configuring-your-table-with-ngTableParams

    // parameters
    let parameters = {
      page: 1,
      count: 25,
      sorting: { updatedAt: "desc" },
    };

    // settings
    let settings = {
      getData: (params) => {
        let count = params.count();
        let page = params.page();
        let query = {};

        let where = {};
        _.each(params.filter(), function(val, key) {
          if (_.isInteger(val)) {
            where[key] = val;
            return;
          }
          if (_.isString(val) && (val !== "")) {
            where[key] = { contains: val };
            return;
          }

          return;
        });
        query.where = where;
        query.sort = params.sorting();
        query.limit = count;
        query.skip = count * (page - 1);
        query.populate = [];

        return Api
          .get('/utilisateurs/findWithCount', query)
          .then((success) => {
            params.total(success.data.count);

            return success.data.records;
          });
      },
      addData: (params) => {
        let addRow = params.parameters().addRow;

        let query = {
          email: addRow.email,
          role: addRow.role,
          group: addRow.group
        };
        if (_.has(addRow, 'lastName')) query.lastName = addRow.lastName;
        if (_.has(addRow, 'firstName')) query.firstName = addRow.firstName;

        return Api
          .post('/utilisateurs', query)
          .then((success) => {
            // TODO - reload table or extend dataset ?
            this.tableParams.reload();
            this.tableParams.parameters({ addRow: undefined });

            return;
          });
      }
    };

    // columns
    let columns = [{
      field: "email",
      title: "Email",
      sortable: "email",
      filter: { email: { id: "text", placeholder: "filtrer par email" } },
      dataType: "email",
      required: true
    },
    {
      field: "lastName",
      title: "Nom",
      sortable: "lastName",
      filter: { lastName: { id: "text", placeholder: "filtrer par nom" } },
      dataType: "text"
    },
    {
      field: "firstName",
      title: "Prénom",
      sortable: "firstName",
      filter: { firstName: { id: "text", placeholder: "filtrer par prénom" } },
      dataType: "text"
    },
    {
      field: "role",
      title: "Rôle",
      sortable: "role",
      filter: { role: { id: "select", placeholder: "filtrer par rôle" } },
      filterData: _.clone(this.roles),
      selectData: _.clone(this.roles),
      dataType: "select",
      required: true
    },
    {
      field: "group",
      title: "Groupe",
      sortable: "group",
      filter: { group: { id: "select", placeholder: "filtrer par groupe" } },
      filterData: _.clone(this.groups),
      selectData: _.clone(this.groups),
      dataType: "select",
      required: true
    },
    {
      field: "action",
      title: "",
      filter: { action: { id: "label", placeholder: "⇚ Filtres" } },
      dataType: "command"
    }];

    // Init table
    this.tableParams = new NgTableParams(parameters, settings);
    this.tableColumns = columns;
  }


  //////////
  // EDIT //
  //////////

  editRow(row) {
    row.eRow = angular.copy(row);
  }

  cancelRow(row) {
    delete row.eRow;
  }


  ////////////
  // DELETE //
  ////////////

  deleteRow(row) {
    this.ModalService.confirm({
      text: "Êtes-vous sûr de vouloir supprimer l'utilisateur : <em>" + row.email + "</em> ?"
    })
    .result.then((success) => {
      this.Api
        .delete('/utilisateurs/' + row.id)
        .then((success) => {
          this.tableParams.reload();
        });
    });
  }

  //////////
  // SAVE //
  //////////

  saveRow(row) {
    let eRow = row.eRow;

    let query = {
      firstName: eRow.firstName,
      lastName: eRow.lastName,
      role: eRow.role,
      group: eRow.group
    };
    query.populate = [];

    this.Api
      .put('/utilisateurs/' + eRow.id, query)
      .then((success) => {
        // extend orginal row data with saved one
        _.extend(row, success.data);
        delete row.eRow;
      });
  }


  /////////
  // ADD //
  /////////

  addRow() {
    let row = { role: 1, group: 1 };

    // set role and group explicitly for moderator as there is only one
    if (this.UserService.isModerator()) {
      row.role = this.USER_ACCESS.userRoles.contributor;
      row.group = this.currentUser.group;
    }

    this.tableParams.parameters({
      addRow: row
    });
  }
}


////////////
// EXPORT //
////////////

export default UsersController;