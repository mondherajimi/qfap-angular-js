
//////////////
// SERVICES //
//////////////

class LodashService {

  /*@ngInject*/
  constructor($windowProvider) {
    this._ = $windowProvider.$get()._;

    if (this._) {
      this._.getInteger = this.getInteger;
    }
  }

  // getInteger
  getInteger(stringOrNumber) {
    var integer;
    var parsed = parseInt(stringOrNumber);

    if (!isNaN(parsed) && (parsed.toString() === stringOrNumber.toString())) {
      integer = parsed;
    }

    return integer;
  }

  /*@ngInject*/
  $get() {
    return this._;
  }
}


////////////
// EXPORT //
////////////

export default LodashService;
