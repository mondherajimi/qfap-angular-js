////////////
// FILTER //
////////////

/*@ngInject*/
export function path() {
  return function(media,width) {
    
    if (media && media.filename) {
		var url = window.qfapBO.env.api.url + '/images/' + media.filename;
		if (width) {
			url += '?w=' + width;
		}
		return url;
	} else {
		return '';
    }
  };
}

export function keywords() {
	return function(stringKeywords) {
		console.log(stringKeywords);
	    var arrayKeywords=[];        
        stringKeywords.split(',').forEach(function(element) {
        	arrayKeywords.push({text:element}); 	
        });
        console.log(arrayKeywords);
        return arrayKeywords;
	}
}
	
export function formatSize() {
	return function(bytes) {
	
	if (!bytes)
		return '0 octet';
	var k = 1024;
	var sizes = ['Octets','Ko','Mo','Go'];
	var i = Math.floor(Math.log(bytes) / Math.log(k));
	return (bytes / Math.pow(k,i)).toPrecision(3) + ' ' + sizes[i];
	
	}
}

////////////
// EXPORT //
////////////

//export default path;
