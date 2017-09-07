////////////
// IMPORT //
////////////

// load template in templateCache
import '!ngtemplate?relativeTo=/src/components/editor/components-editor/components/place-parisien/&prefix=component/!html!./place-parisien.html';


////////////////
// CONTROLLER //
////////////////

class PlaceParisienComponentController {

  /*@ngInject*/
  constructor($log, $uibModalInstance, Api, ModalService, params) {
    this.$log = $log;
    this.$uibModalInstance = $uibModalInstance;
    this.Api = Api;
    this.ModalService = ModalService;

    this.events = {};

    this.type = 'place-parisien';
    this.jsonTpl = {
      number: 1,
      title: '',
      text: '',
      category: '',
      place: {
        title: '',
        address: '',
        current: {
          id: '',
          name: '',
          address: '',
          zipCode: null,
          city: ''
        },
        isInPlaces: false,
        isVisibleOnMap: true,
        items: []
      }
    };

    this.defaultItem = {
      href: '',
      target: '_blank',
      icon: 'map',
      text: "Voir sur la carte"
    };

    // Form values init
    this.maxLength = 190;

    this.setParisienCategories();

    this.init(params);
  }

  /**
   * Initialize component
   * @param Object params
   * @return void
   */
  init(params) {
    this.$cpnt = params.$element;
    this.data = params.structure ? params.structure.data : this.jsonTpl;
    this.showDelete = !!params.structure;
  }

  ////////////////////////////////
  // TYPEAHEAD HELPER FUNCTIONS //
  ////////////////////////////////

  /**
   * Set default values for all listened fields of current model
   * @param  Object|string name
   * @return void
   */
  _setDefaultLieu(current) {
    this.data.place.current = {
      name: _.isObject(current) ? current.name : current,
      address: '',
      zipCode: null,
      city: ''
    };
  }

  /**
   * Format typeahead result row
   * @param  Object item
   * @return string
   */
  _formatLocation(item) {
    if (_.isUndefined(item)) { return; }

    let ret = [];
    if (item.name) { ret.push(item.name); }
    if (item.address) { ret.push(item.address); }
    if (item.zipCode) { ret.push(item.zipCode); }
    if (item.city) { ret.push(item.city); }
    return ret.join(' - ');
  }

  /**
   * Get typeahead remote data set
   * @param  q
   * @return Array
   */
  getLocation(q) {
    let query = {
      q: q,
      fields: ['name', 'address', 'zipCode', 'city'],
      sort: 'zipCode ASC'
    };

    return this.Api
      .get('/lieux/searchLieu/', query)
      .then((response) => {
        let current = this.data.place.current;
        let noResult = response.data.length === 0;

        if (noResult || !_.isObject(current)) {
          this.data.place.isInPlaces = false;
          this._setDefaultLieu(current);
        }

        if (noResult) { return; }

        return _.map(response.data, (item) => {
          item.formatted = this._formatLocation(item);
          return item;
        });
      });
  }

  /**
   * Get formatted label in name field
   * @param  Object $model
   * @return string
   */
  formatLabel($model) {
    return this._formatLocation($model);
  }

  /**
   * Typeahead onSelect
   * @param  Object $item
   * @param  Object $model
   * @param  string $label
   * @return void
   */
  onSelect($item, $model, $label) {
    this.data.place.isInPlaces = true;
  }

  /**
   * Typeahead onChange
   * @return void
   */
  onChange() {
    this.data.place.isInPlaces = false;
  }

  ////////////////////////////////
  // COMPONENT HELPER FUNCTIONS //
  ////////////////////////////////

  setParisienCategories() {
    return this.Api
      .get('/parisienCategories')
      .then((response) => {
        this.categories = response.data;
      });
  }

  /**
   * Format data.place.adress filed for styleguide
   * @param  Object item
   * @return void
   */
  formatPlaceAddress(item) {
    return [
      item.address,
      '<br />',
      item.city,
      item.zipCode,
    ].join(' ');
  }

  /**
   * TODO
   * @return string
   */
  generateLink() {
    return '#';
  }

  ///////////////////////////
  // MANAGE PARISIEN PLACE //
  ///////////////////////////

  // Update parisien place and update component
  /**
   * Prepare/submit form data and update component
   * @return void
   */
  updateParisianPlace() {
    if (this.data.place.isInPlaces) {
      let item = {
        href: this.generateLink(),
      };
      item = _.extend({}, this.defaultItem, item);
      this.data.place.items.push(item);
    }

    // Set this.data values (view component)
    let current = this.data.place.current;

    this.data.place.title = current.name,
    this.data.place.address = this.formatPlaceAddress(current);

    this.update();
  }

  // Check if place has a link or can generate one with idEquipements
  hasLink(place) {
    return place.link || place.idEquipements;
  }

  // Check if place has valid coordinates
  hasCoordinates(place) {
    return place.lat && place.lon;
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

export default PlaceParisienComponentController;
