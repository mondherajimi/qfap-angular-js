////////////
// IMPORT //
////////////

// load template in templateCache
import '!ngtemplate?relativeTo=/src/components/editor/components-editor/components/place/&prefix=component/!html!./place.html';


////////////////
// CONTROLLER //
////////////////

class PlaceComponentController {

  /*@ngInject*/
  constructor($log, $uibModalInstance, Api, ModalService, params) {
    this.$log = $log;
    this.$uibModalInstance = $uibModalInstance;
    this.Api = Api;
    this.ModalService = ModalService;

    this.events = {};

    this.type = 'place';
    this.jsonTpl = {
      title: '',
      place: '',
      station: '',
      button: {
        href: '',
        text: 'Voir le lieu',
        target: '_blank'
      }
    };

    this.keyword = '';
    this.places = [];

    this.init(params);
  }

  // Initialize component
  init(params) {
    this.$cpnt = params.$element;
    this.data = params.structure ? _.clone(params.structure.data) : this.jsonTpl;
    this.showDelete = !!params.structure;
  }


  ///////////////////
  // MANAGE PLACES //
  ///////////////////

  // Check if place has a link or can generate one with idEquipements
  hasLink(place) {
    return place.link || place.idEquipements;
  }

  // Check if place has valid coordinates
  hasCoordinates(place) {
    return place.lat && place.lon;
  }

  // Fetch metro and update component
  setPlace(place) {
    this.data.title = place.name;
    this.data.place = [place.address, place.zipCode, place.city].join(' ');

    // button href
    this.data.button.href = place.link;
    if (!place.link && place.idEquipements) {
      this.data.button.href = 'http://equipement.paris.fr/' + S.slugify(place.name) + '-' + place.idEquipements;
    }

    // metro
    if (this.hasCoordinates(place)) {
      this.events.searching = true;

      this.Api
        .get('/lieux/findMetro', {
          lat: place.lat,
          lon: place.lon
        })
        .then((success) => {
          if (!success.data && !success.data.length) return;

          const metro = success.data[0];
          let station = "";
          station += metro.station;
          station += ", ligne ";
          station += metro.line.split(',').join(', ');

          this.data.station = station;
        })
        .finally(() => {
          this.events.searching = false;
          this.update();
        });
    }
    else {
      this.update();
    }
  }

  // Fetch places matching keyword
  fetchPlaces(keyword) {
    this.events.searching = true;

    const query = {};
    const where = {};
    where.or = [
      { name: { 'contains': keyword } },
      { address: { 'contains': keyword } },
      { zipCode: keyword }
    ];

    query.where = where;
    query.populate = [];

    this.Api
      .get('/lieux/findWithCount', query)
      .then((success) => {
        this.places = success.data.records;
      })
      .finally(() => {
        this.events.searching = false;
      });
  }

  // Get or set keyword input value
  getSetKeyword(keyword) {
    // set with a valid keyword
    if (arguments.length) {

      this.keyword = keyword;

      if (this.keyword.length >= 3) {
        this.fetchPlaces(keyword);
      }
    }
    // get or invalid url
    else {}

    return this.keyword;
  }


  //////////////////////
  // MANAGE COMPONENT //
  //////////////////////

  // Update or insert component
  update() {
    const updateData = {
      $element: this.$cpnt
    };

    // update
    if (this.showDelete) {
      updateData.method = 'update';
      updateData.structure = this.data;
    }
    // insert
    else {
      updateData.method = 'create';
      updateData.structure = {
        type: this.type,
        data: this.data
      };
    }

    this.$uibModalInstance.close(updateData);
  }

  // Delete component
  delete() {
    this.ModalService.confirm({
      text: 'Êtes-vous sûr de vouloir supprimer ce composant ?'
    })
    .result.then(
      (success) => {
        this.$uibModalInstance.close({
          method: 'destroy',
          $element: this.$cpnt
        });
      },
      (error) => { }
    );
  }

}


////////////
// EXPORT //
////////////

export default PlaceComponentController;
