////////////
// FILTER //
////////////

/*@ngInject*/
function staticDataFilter($log) {
  return function(input, data) {
    if (!_.isArray(data) || _.isEmpty(data)) {
      $log.error(new Error('staticDataFilter: invalid or empty data'));
      return "";
    }

    if (!_.isInteger(input)) {
      $log.error(new Error('staticDataFilter: expect integer as input'));
      return "";
    }

    return _.result(_.find(data, { id: input }), 'title');
  };
}


////////////
// EXPORT //
////////////

export default staticDataFilter;