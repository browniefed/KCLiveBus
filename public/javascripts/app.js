var app = angular.module('KCLiveBus',["leaflet-directive",'firebase']);
app.controller('MapCtrl', function($scope, angularFire)
{
	//CREATE THE MAP
	angular.extend($scope, {
	    defaults: {
	        tileLayer: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
	        maxZoom: 19,
	        zoomControl: false
	    },
	    center: {
        lat: 39.099287,
        lng: -94.579041,
        zoom: 13
    	},
   		markers: {}
	}
	);

	//BIND FIREBASE EVENTS
	var vehicles = angularFire('https://livemet.firebaseio.com/kc', $scope, 'vehicles', {});

	//WATCH FOR VEHICLE CHANGES
	$scope.$watch('vehicles',function(vehicles){
		for (vehicle in vehicles)
		{
			var classDirection = 'inbound',
			displayText = vehicles[vehicle].route;
			
			vehicles[vehicle].lng = vehicles[vehicle].lon;
			vehicles[vehicle].icon = {};
			vehicles[vehicle].icon.markerType = 'div';
			vehicles[vehicle].icon.className = 'busmarker ' + classDirection;
			vehicles[vehicle].icon.html = '<span>' + displayText + '</span>';
		}
		angular.extend($scope,{
			markers: vehicles
		})
	})
});