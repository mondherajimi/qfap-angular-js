////////////////
// CONTROLLER //
////////////////

class MessagesbureauxController {

    /*@ngInject*/
  constructor(Api, NgTableParams, $templateCache, groups) {

    this.Api = Api;

    this.groups = groups;

    // TABLE

    // parameters
    let parameters = {
      page: 1,
      sorting: { id: "asc" },
    };

    // settings
    let settings = {
      counts: [],
      addData: (params) => {
        let addRow = params.parameters().addRow;
        let query = {
          date: Moment().format('YYYY-MM-DD'),
          title: addRow.title,
          text: addRow.text,
          group: addRow.group,
          status: addRow.status
        };

        return Api
          .post('/messagesbureaux', query)
          .then((success) => {
            // TODO - reload table or extend dataset ?
            this.reloadTable();
            this.tableParams.parameters({ addRow: undefined });

            return;
          });
      }
    };

    // columns
    let columns = [{
      field: "id",
      title: "ID",
      sortable: "id",
      dataType: "readonly"
    },{
      field: "date",
      title: "Date",
      sortable: "date",
      dataType: "readonly"
    },{
      field: "title",
      title: "Titre",
      sortable: "title",
      filter: { title: { id: "text", placeholder: "filtrer par titre" } },
      dataType: "text",
      required: true
    },{
      field: "text",
      title: "Texte",
      dataType: "text",
      required: true
    },{
      field: "group",
      title: "Groupe",
      sortable: "group",
      //filter: { group: { id: "select", placeholder: "filtrer par groupe" } },
      filterData: _.clone(this.groups),
      selectData: _.clone(this.groups),
      dataType: "select",
    },{
      field: "status",
      title: "Statut",
      sortable: "status",
      //filter: { status: { id: "text", placeholder: "filtrer par statut" } },
      sortable: "status",
      dataType: "checkbox"
    },{
      field: "action",
      title: "",
      filter: { action: { id: "label", placeholder: "⇚ Filtres" } },
      dataType: "command"
    }];

    // Init table
    this.tableParams = new NgTableParams(parameters, settings);
    this.tableColumns = columns;
    this.reloadTable();
  }


  ///////////
  // TABLE //
  ///////////

  reloadTable() {
    return this.Api
      .get('/messagesbureaux')
      .then((success) => {
        this.tableParams.total(success.data.length);
        this.tableParams.settings({ dataset: success.data });

        return;
      });
  }


  //////////
  // EDIT //
  //////////

  editRow(row) {
    row.eRow = angular.copy(row);
  }

  cancelEditRow(row) {
    delete row.eRow;
  }


  ////////////
  // DELETE //
  ////////////

  deleteRow(row) {
    if (window.confirm("Confirmez-vous la suppression de " + row.title + " ?")) {
      this.Api
        .delete('/messagesbureaux/' + row.id)
        .then(
          (success) => {
            this.reloadTable();
          });
    }
  }


  //////////
  // SAVE //
  //////////

  saveRow(row) {
    let eRow = row.eRow;

    let query = {
      date: eRow.date,
      title: eRow.title,
      text: eRow.text,
      group: eRow.group,
      status: eRow.status
    };
    query.populate = [];

    this.Api
      .put('/messagesbureaux/' + eRow.id, query)
      .then(
        (success) => {
          // extend orginal row data with saved one
          _.extend(row, success.data);
          delete row.eRow;
        });
  }


  /////////
  // ADD //
  /////////

  addRow() {
    this.tableParams.parameters({ addRow: {} });
  }

}

////////////
// EXPORT //
////////////

export default MessagesbureauxController;
