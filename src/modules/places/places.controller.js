////////////////
// CONTROLLER //
////////////////

class PlacesController {

  /*@ngInject*/
  constructor(Api, NgTableParams, ModalService) {
    this.Api = Api;
    this.ModalService = ModalService;

    // TABLE

    // parameters
    let parameters = {
      page: 1,
      count: 25,
      sorting: { id: "asc" }
    };

    // settings
    let settings = {
      getData: (params) => {
        let count = params.count();
        let page = params.page();
        let query = {};

        let where = {};
        _.each(params.filter(), function(val, key) {
          if (_.isNil(val) || val === '')
            return;

          if (key === 'id') {
            where.or = [
              { id: { contains: val } },
              { idEquipements: { contains: val } }
            ];
          }
          else {
            where[key] = { contains: val };
          }
        });
        query.where = where;
        query.sort = params.sorting();
        query.limit = count;
        query.skip = count * (page - 1);
        query.populate = [];

        return Api
          .get('/lieux/findWithCount', query)
          .then((success) => {
            params.total(success.data.count);

            return success.data.records;
          });
      },
      addData: (params) => {
        let addRow = params.parameters().addRow;
        let query = {
          name: addRow.name,
          address: addRow.address,
          zipCode: addRow.zipCode,
          city: addRow.city,
          lat: addRow.lat,
          lon: addRow.lon,
        };

        if (_.has(addRow, 'link')) query.link = addRow.link;

        return Api
          .post('/lieux', query)
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
      field: "id",
      title: "ID (équipement)",
      sortable: "id",
      filter: { id: { id: "number", placeholder: "filtrer par ID" } },
      dataType: "readonly"
    }, {
      field: "name",
      title: "Nom",
      sortable: "name",
      filter: { name: { id: "text", placeholder: "filtrer par nom" } },
      dataType: "text",
      required: true
    }, {
      field: "address",
      title: "Adresse",
      filter: { address: { id: "text", placeholder: "filtrer par adresse" } },
      dataType: "text",
      required: true
    }, {
      field: "zipCode",
      title: "Code postal",
      filter: { zipCode: { id: "number", placeholder: "filtrer par code postal" } },
      dataType: "text",
      required: true
    }, {
      field: "city",
      title: "Ville",
      filter: { city: { id: "text", placeholder: "filtrer par ville" } },
      dataType: "text",
      required: true
    }, {
      field: "lat",
      title: "Latitude",
      filter: { lat: { id: "number", placeholder: "filtrer par latitude" } },
      dataType: "text",
      required: true
    }, {
      field: "lon",
      title: "Longitude",
      filter: { lon: { id: "number", placeholder: "filtrer par longitude" } },
      dataType: "text",
      required: true
    }, {
      field: "link",
      title: "Lien",
      filter: { link: { id: "text", placeholder: "filtrer par lien" } },
      dataType: "url"
    }, {
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
    // Forbid equipment places edition
    if (!_.isNull(row.idEquipements))
      return;

    row.eRow = angular.copy(row);
  }

  cancelEditRow(row) {
    delete row.eRow;
  }


  ////////////
  // DELETE //
  ////////////

  deleteRow(row) {
    // Forbid equipment places deletion
    if (!_.isNull(row.idEquipements))
      return;

    this.ModalService.confirm({
      text: 'Êtes-vous sûr de vouloir supprimer le lieu : <em>' + row.name + '</em> ?'
    })
    .result.then((success) => {
      this.Api
        .delete('/lieux/' + row.id)
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
      name: eRow.name,
      address: eRow.address,
      zipCode: eRow.zipCode,
      city: eRow.city,
      lat: eRow.lat,
      lon: eRow.lon,
      link: eRow.link,
      idEquipements: eRow.idEquipements
    };
    query.populate = [];

    this.Api
      .put('/lieux/' + eRow.id, query)
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
    this.tableParams.parameters({ addRow: {} });
  }
}


////////////
// EXPORT //
////////////

export default PlacesController;
