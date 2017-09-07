////////////
// IMPORT //
////////////

import '!ngtemplate?relativeTo=/src/components/modal/templates/&prefix=modal/!html!./templates/confirm.modal.html';
import '!ngtemplate?relativeTo=/src/components/modal/templates/&prefix=modal/!html!./templates/messages.modal.html';
import '!ngtemplate?relativeTo=/src/components/modal/templates/&prefix=modal/!html!./templates/mappicker.modal.html';

//////////////
// SERVICES //
//////////////

class ModalService {

  /*@ngInject*/
  constructor($uibModal, $timeout, MODAL_CONFIG) {
    this.$uibModal = $uibModal;
    this.$timeout = $timeout;
    this.MODAL_CONFIG = MODAL_CONFIG;
  }

  _modal(params, customConfig) {

    let config = angular.extend({}, this.MODAL_CONFIG, customConfig);

    config.resolve = {
      params: params
    };

    let modalInstance = this.$uibModal.open(config);

    return modalInstance;
  }

  confirm(params, config) {
    const confirmParams = {
      title: 'Demande de confirmation',
      text: '<em class="text-danger">aucun texte n\'a été précisé...</em>'
    };
    const confirmConfig = {
      templateUrl: 'modal/confirm.modal.html',
      size: 'sm',
      windowClass: 'confirm-modal'
    };

    params = angular.extend({}, confirmParams, params);
    config = angular.extend({}, confirmConfig, config);

    return this._modal(params, config);
  }

  messages(params, config){
     const confirmParams = {
      title: 'Alerte',
      text: '<em class="text-danger">aucun texte n\'a été précisé...</em>',
      messages: '',
      messagepersonnalise:''
    };
    const confirmConfig = {
      templateUrl: 'modal/messages.modal.html',
      size: 'lg',
      windowClass: 'confirm-modal'
    };

    params = angular.extend({}, confirmParams, params);
    config = angular.extend({}, confirmConfig, config);

    return this._modal(params, config);   
  }

  mappicker(params, config){
     const confirmParams = {
      title: 'Alerte',
      text: '<em class="text-danger">aucun texte n\'a été précisé...</em>',
      place: ''
    };
    const confirmConfig = {
      templateUrl: 'modal/mappicker.modal.html',
      size: 'lg',
      windowClass: 'confirm-modal'
    };

    let geocoder;
    let map;
    let infoWindow;
    let position;
    function initMap(){  
      geocoder = new google.maps.Geocoder();
      params.place.lat = _.isUndefined(params.place.lat) ? '' : params.place.lat;
      params.place.lon = _.isUndefined(params.place.lon) ? '' : params.place.lon;
      params.place.lat_ori = params.place.lat;
      params.place.lon_ori = params.place.lon;
      let position_init = {lat:params.place.lat, lng: params.place.lon};

      map = new google.maps.Map(document.getElementById('gmap'), {
        center: position_init,
        zoom: 15
      });
      let contentstring = '<div>'+params.place.address+' '+params.place.zipCode+' '+params.place.city+'</div>';
      infoWindow = new google.maps.InfoWindow({ 
        content:contentstring 
      });
      let marker = new google.maps.Marker({
        position: position_init,
        map: map,
        draggable:true
      });
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
      });
      google.maps.event.addListener(marker, 'dragend', function(){
        position = marker.getPosition();
        params.place.lat = position.lat();
        params.place.lon = position.lng();
      });
      if(params.place.lat==''){
        codeAddress();
      }
    }

    function codeAddress() {
      var address = params.place.address+' '+params.place.zipCode;
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          let marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              draggable:true
          });
          params.place.lat = marker.getPosition().lat();
          params.place.lon = marker.getPosition().lng();
          google.maps.event.addListener(marker, 'dragend', function(){
            position = marker.getPosition();
            params.place.lat = position.lat();
            params.place.lon = position.lng();
          });
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }

    if (typeof google === 'object' && typeof google.maps === 'object'){
      this.$timeout(function() {
        initMap();
      },1000);
    }
    else {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://maps.googleapis.com/maps/api/js?key="+qfapBO.env.gmap.api_key+"";
      document.body.appendChild(script);
      this.$timeout(function() {
        initMap();
      },1000);
    }
    params = angular.extend({}, confirmParams, params);
    config = angular.extend({}, confirmConfig, config);

    return this._modal(params, config);   
  }

  component(params, config) {
    const componentParams = {};
    const componentConfig = {
      size: 'lg',
    };

    params = angular.extend({}, componentParams, params);
    config = angular.extend({}, componentConfig, config);

    return this._modal(params, config);
  }
}


////////////
// EXPORT //
////////////

export default ModalService;