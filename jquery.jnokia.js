/*
 * Copyright (c) 2012 Saad Mohammad Al-Hokail, http://saad.alhokail.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function( $ ) {
  var map = {};
  var components = [];
  var methods ={
	
	  /*
	 *Nokia Map plugin for JQuery
	 *@param object nokia map settings
	 */
	  init:function(options){
	  
      var $this = $(this);
      var settings = $.extend( {},$.fn.JNokia.defaults, options);
	  
      $this.opt = settings;
      //Setup components based on settings
      if(settings.behavior){
        // We add the behavior component to allow panning / zooming of the map
        components.push(new nokia.maps.map.component.Behavior());
      }
      if(settings.zoomBar){
        // ZoomBar provides an UI to zoom the map in & out
		components.push(new nokia.maps.map.component.ZoomBar());
      }
      if(settings.scaleBar){
        /* Shows a scale bar in the bottom right corner of the map depicting
		 * ratio of a distance on the map to the corresponding distance in the real world
		 * in either kilometers or miles
		*/ 
		components.push(new nokia.maps.map.component.ScaleBar());
      }
      if(settings.overview){
        // Shows a min-map in the bottom right corner of the map
		components.push(new nokia.maps.map.component.Overview());
      }
      if(settings.traffic){
        // Creates a toggle button to show/hide traffic information on the map
		
		components.push(new nokia.maps.map.component.Traffic());
      }
      if(settings.ContextMenu){
        // Add ContextMenu component so we get context menu on right mouse click / long press tap
		
		components.push(new nokia.maps.map.component.ContextMenu());
      }
      if(settings.typeSelector){
        // Creates UI to easily switch between street map satellite and terrain mapview modes
		
		components.push(new nokia.maps.map.component.TypeSelector());
      }
      if(settings.publicTransport){
        // Creates a toggle button to show/hide traffic information on the map
		
		components.push(new nokia.maps.map.component.PublicTransport());
      }
      if(settings.positioning){
        /* Positioning will show a set "map to my GPS position" UI button
		 * Note: this component will only be visible if W3C geolocation API
		 * is supported by the browser and if you agree to share your location.
		 * If you location can not be found the positioning button will reset
		 * itself to its initial state
		 */
		
		components.push(new nokia.maps.positioning.component.Positioning());
      }
	  //get map continer element id
	  mapID = $this.attr('id');
	  if(!mapID){
		mapID = $this.attr('id','jnokia');
	  }
	  //set continer size to fix show problem
      
      $('#'+mapID).css('width',settings.mapWidth);
      $('#'+mapID).css('height',settings.mapHeight);
      
	  //register app
      nokia.Settings.set( "appId", $this.opt.appId); 
      nokia.Settings.set( "authenticationToken", $this.opt.authenticationToken);
	  //init nokia map
      map = new nokia.maps.map.Display($this[0], {
      //zoom level for the map
          zoomLevel: settings.zoom,
          //center coordinates
          center: settings.center,
          components: components
        });
      
     return this;
    },
	/*return map object
	 *@return object nokia map object
	 *
	 */
	getMap:function(){return map;},
	
	/*move map to specify a Coordinate
	 *@param object/array coord new Coordinate it can be an array [lat,lng] or object {lat: 53, lng: 13} or nokia Coordinate instance [new nokia.maps.geo.Coordinate(53,13)]
	 *@return void
	 */
	moveTo:function(coord){
	  map.set("center",coord);
	},
	/*Move map to the top-left
	 *@param number startX The x-position of the pixel relative to the top-left corner of the current view from where to start pan.
	 *@param number startY The y-position of the pixel relative to the top-left corner of the current view from where to start pan.
	 *@param number endX The x-position of the pixel relative to the top-left corner of the current view to where to pan.
	 *@param number endY The y-position of the pixel relative to the top-left corner of the current view to where to pan.
	 *@return void
	 */
	pan:function(startX,startY,endX,endY){
	  //we use default value for animation because the render it's debends on the engine and platform!
	  map.pan(startX, startY, endX, endY);
	},
	/*translates a pixel position within the viewport to geo coordinates
	 *@param number x top position
	 *@param number y left position
	 *@return nokia.maps.geo.Coordinate A point object containing the WGS84 coordinates of the caller-supplied pixel position
	 */
	pixelToGeo:function(x,y){
	  return map.pixelToGeo(x, y);
	},
	/*centers the map on the location specified by the caller
	 *@param {nokia.maps.geo.Coordinate} coord The location on which to center the map specified in terms of WGS84 coordinates.
	 *@return void
	 */
	setCenter:function(coord){
	  map.setCenter(coord);
	},
	/*sets the position of the copyright information
	 *@param string alignment The alignment relative to the map viewport, where the copyright is to be placed 
	 *[topleft,topcenter,topright,middleleft,middlecenter,middleright,bottomleft,bottomcenter,bottomright].
	 *@return void
	 */
	setCopyrightAlignment:function(alignment){
	  map.setCopyrightAlignment(alignment);
	},
	/*sets the heading (bearing) of the map
	 *@param number heading The new value of map heading (bearing) as a number of degrees;
	 *a value between nokia.maps.map.Display#minHeading and nokia.maps.map.Display#maxHeading
	 *@return void
	 */
	setHeading:function(heading){
	  map.setHeading(heading);
	},
    /*padding in pixels for each side of the map display, thus setting a virtual viewport
	 *@param number p1 Top padding in pixels; if this is the only argument provided,
	 *it is used also to set right, bottom and left padding (padding is identical all round);
	 *if the caller provides only two arguments, padding1 sets both top and bottom paddin
	 *@param number {p2} Right padding in pixels; if padding4 (left padding) is not specified by the caller,
	 *this argument determines both right and left padding
	 *@param number p3 Bottom padding in pixels; if not provided, its value is the same as that of padding1 (top padding)
	 *@param number p4 Left padding in pixels; if not provided, its value is supplied by padding2 (right padding) or
	 *padding1 (top padding) if padding2 is not provided .
	 *@return void
	 */
	setPadding:function(p1,p2,p3,p4){
	  map.setPadding (p1, p2, p3, p4);
	},
	/*sets the tilt of the map
	 *@param number tilt The new value of map tilt in degrees
	 *@return void
	 */
	setTilt:function(tilt){
	  map.setTilt(tilt);
	},
	/*zooms the map to ensure that the bounding box provided by the caller is visible in its entirety in the map viewport
	 *@param nokia.maps.geo.BoundingBox boundingBox The bounding box that is to be visible in its entirety in the map viewport
	 *@param boolean keepCenter A Boolean indicating whether to keep the map center unchanged (true) or if the view center may change (false);
	 *
	 */
	zoomTo:function(boundingBox, keepCenter){
	  map.zoomTo(boundingBox, keepCenter);
	},
	/*set map view types
	 *@param string t type name
	 *[NORMAL]provides default street map
	 *[SMARTMAP]provides default street map
	 *[SATELLITE]provides a satellite map with streets and labels on top
	 *[SATELLITE_PLAIN]provides a satellite map without any labels on top
	 *[TERRAIN]provides a map with geographical attributes like level curves and growth
	 *[SMART_PT]provides a map including public transport lines
	 *@return void
	 */
	setType:function(t){
	  switch(t){
		case('SMARTMAP'):
		  map.set("baseMapType", nokia.maps.map.Display.SMARTMAP);
		break;
		case('SATELLITE'):
		  map.set("baseMapType", nokia.maps.map.Display.SATELLITE);
		break;
		case('SATELLITE_PLAIN'):
		  map.set("baseMapType", nokia.maps.map.Display.SATELLITE_PLAIN);
		break;
		case('TERRAIN'):
		  map.set("baseMapType", nokia.maps.map.Display.TERRAIN);
		break;
		case('SMART_PT'):
		  map.set("baseMapType", nokia.maps.map.Display.SMART_PT);
		break;
		default://NORMAL
		  map.set("baseMapType", nokia.maps.map.Display.NORMAL);
		break;
	  }
	},
	/*add new Standard Marker
	 *@param mixed coord Geo coordinate of the marker
	 *@param object prop marker properties
	 *@return object instance of Standard Marker object
	 */
	addStandardMarker:function(coord,prop){
	  var standardMarker = new nokia.maps.map.StandardMarker(coord,prop);
	  map.objects.add(standardMarker);
	  return standardMarker;
	},
	/*add new Marker
	 *@param mixed coord Geo coordinate of the marker
	 *@param object prop marker properties
	 *@return object instance of Marker object
	 */
	addMarker:function(coord,prop){
	  var marker = new nokia.maps.map.Marker(coord,prop);
	  map.objects.add(marker);
	  return marker;
	},
	/*groups nokia.map.objects for allowing operations to be performed on them as a unit
	 *@param array content The initial map of objects to be added to the container
	 *@param object [prop] continer The initialization properties for the container
	 *@return object nokia.maps.map.Container
	 */
	addContainer:function(content,prop){
	  if(content == undefined)return new nokia.maps.map.Container();
	  return new nokia.maps.map.Container(content,prop);
	},
	/*defines a map object with a circular shape
	 *@param object center An object providing the geographical coordinates of the center of the circle 
	 *@param Number radius A value that provides the length of the radius of the circle in meters
	 *@param object [props] An object that specifies object properties and their initial values
	 *@return object an new instance of nokia.maps.map.Circle
	 */
	addCircle:function(center, radius, props){
	  var obj = new nokia.maps.map.Circle(center, radius, props);
	  map.objects.add(obj);
	  return obj;
	},
	/*
	 *@param {nokia.maps.geo.Strip | nokia.maps.geo.Shape | nokia.maps.geo.Coordinate[]} coords An object containing
	 *the points (geographical locations) that define the polyline; the object can be an instance of nokia.maps.geo.Strip,
	 *a nokia.maps.geo.Shape or an array of objects, each containing the latitude and longitude of a geographical location 
	 *@param object [props] An object that specifies object properties and their initial values
	 *@return object a new instance of nokia.maps.map.Polyline
	 */
	addPolyline:function(coords, props){
	  var obj = new nokia.maps.map.Polyline(coords, props);
	  map.objects.add(obj);
	  return obj;
	},
	/*
	 *@param {nokia.maps.geo.Strip | nokia.maps.geo.Coordinate[]} path An object containing the points (geographical locations)
	 *that define the polygon; the object can be an instance of nokia.maps.geo.Strip or an array of objects, each containing
	 *the latitude and longitude of a geographical location
	 *@param object [props] An object that names polygon properties to initialize and provides their values
	 *@return object a new instance of nokia.maps.map.Polygon
	 */
	addPolygon:function(path,props){
	  var obj = new nokia.maps.map.Polygon(path,props);
	  map.objects.add(obj);
	  return obj;
	},
	/*defines a map object with a rectangular shape
	 *@param nokia.maps.geo.BoundingBox bounds A bounding box object that determines the location of the rectangle and its sixe
	 *@param object [props] An object that names the properties of the rectangle to initialize and provides their values
	 *@return object a new instance of nokia.maps.map.Rectangle
	 */
	addRectangle:function(bounds, props){
	  var obj = new nokia.maps.map.Rectangle(bounds, props) ;
	  map.objects.add(obj);
	  return obj;
	},
	/*creates a new info bubble, updates it with content and shows it on the map
	 *@param string content The content to be shown in the info bubble; it can be an HTML string, please note that Flash content
	 *in the bubble overlap other elements in the document
	 *@param object coordinate An object containing the geographic coordinates of the location, where the bubble's anchor is to be placed
	 *@param function [onUserClose] A callback method which is called when user closes the bubble (by clicking on close button) to be placed.
	 *@param boolean [hideCloseButton]:false Hides close button if set to true.
	 *@return nokia.maps.map.component.InfoBubbles.Bubble The handle of this bubble.
	 */
	InfoBubbles:function(content, coordinate, onUserClose, hideCloseButton){
	  var infoBubbles = map.addComponent(new nokia.maps.map.component.InfoBubbles());
	  bubble = infoBubbles.openBubble(content, coordinate, onUserClose,hideCloseButton);
	  return bubble;
	},
	walk:function(){
	  
	},
	/* searches for places on the basis of the parameters specified by the caller
	 *@param object param An object containing a number of parameters that define a search request:
	 *
     *{String} searchTerm - search term, required
     *{Function} onComplete - a function to be called when the request has been completed, required; the function must accept as arguments
     * - responseData, which is an instance of nokia.places.objects.SearchResponseView containing data returned by the Places back-end.
     * - status, which is a {String} constant with the value of 'OK' to indicate success or 'ERROR' to indicate request failure or time-out
     *{Object} searchCenter - an object containing the latitude and longitude of the starting point for the search ({latitude:'',longitude:''});
     *optional, if provided, useGeoLocation is ignored
     *{Object} boundingBox - instead of search center boundingBox can be passed as a parameter. Bounding box is an object containing to
     *coordinates topLeft and bottomRight ({topLeft: {latitude: '', longitude:''}, bottomRight: {latitude:'', longitude''}})
     *{Boolean} useGeoLocation - if true and searchCenter is not provided, Places search tries to use the W3C Geolocation API to get the
     *client location and use it as the search center; if this parameter is false and searchCenter is not provided, a global search is executed
     *{Number} limit - the maximum number of results to be returned, optional
	 *@param object [sm] instance of nokia.places.search.manager to used ,if not set then we will assigned to new one
	 *@return none The return value is made available asynchronously as arguments passed to the onComplete handler
	 */
	findPlaces:function(param,sm){
	  if(param.searchTerm == undefined || param.searchTerm.length < 1){
		param.onComplete(null,'ERROR');
	  }
	  if(typeof(sm) != Object)sm = nokia.places.search.manager;
	  sm.findPlaces(param);
	},
	/*
	 *@param object param An object containing a number of parameters that define a search request: 
	 *
	 *{String} category - required; a string constant containing the valid category id which must be set to one of the following values:
		  eat-drink
		  going-out
		  sights-museums
		  transport
		  accommodation
		  shopping
		  leisure-outdoor
		  administrative-areas-buildings
		  natural-geographical
	 *{Function} onComplete - required; a function to be called when the request has been completed; the function must accept as arguments responseData, which is an instance of nokia.places.objects.SearchResponseView containing data returned by the Places back-end, and status, which is a {String} constant with the value of 'OK' to indicate success or 'ERROR' to indicate request failure or time-out
	 *{Object} searchCenter - optional; an object containing the latitude and longitude of the starting point for the search ({latitude:'',longitude:''}); if this parameter is provided, useGeoLocation is ignored
	 *{Object} boundingBox - instead of search center boundingBox can be passed is a parameter. Bounding box is an object containing to coordinates topLeft and bottomRight ({topLeft: {latitude: '', longitude:''}, bottomRight: {latitude:'', longitude''}})
	 *{Boolean} useGeoLocation - if true and searchCenter is not provided, Places search tries to use the W3C Geolocation API to get the client location and use it as the search center; if this parameter is false and searchCenter is not provided, a global search is executed
	 *{Number} limit - optional; the maximum number of results to be returned
	 *@param object [sm] instance of nokia.places.search.manager to used ,if not set then we will assigned to new one
	 *@return none The return value is made available asynchronously as arguments passed to the onComplete handler
	 */
	findPlacesByCategory:function(param,sm){
	  if(param.category == undefined || param.category.length < 1){
		param.onComplete(null,'ERROR');
	  }
	  if(typeof(sm) != Object)sm = nokia.places.search.manager;
	  sm.findPlacesByCategory(param);
	},
	/*This method runs a geocoding query based on the arguments provided by the calle
	 *@param object param an object containing:
	 *
	 *address - an object containing at least one of the elements of nokia.places.objects.Place.location.address; optional, if not provided the caller is expected to supply searchTerm described below
	 *searchTerm - a {String} identifying the location to be geocoded, for example, it can contain the name of the place or the full address, etc.; optional, if not provided, the caller is expected to supply address described above
	 *onComplete - {Function}, a function to be called when the request has completed, required; the function must accept as arguments:
		  responseData - an instance of nokia.places.objects.Place containing data returned by the Places back-end
		  status - {String}, a constant, with the value of 'OK' to indicate success or 'ERROR' to indicate request failure or time-out
	 *@param object [sm] instance of nokia.places.search.manager to used ,if not set then we will assigned to new one
	 *@return none The return value is made available asynchronously as arguments passed to the onComplete handle
	 *
	 */
	geoCode:function(param){
	  if((param.searchTerm == undefined || param.searchTerm.length < 1) && (param.address == undefined || param.address.length < 1)){
		param.onComplete(null,'ERROR');
	  }
	  if(typeof(sm) != Object)sm = nokia.places.search.manager;
	  sm.geoCode(param);
	},
	
	/*runs a reverse geocoding query based on the coordinates provided by the caller. A default radius is applied. 
	 *@param number lat latitude in degrees in the range [-90 .. 90]; values outside this range result in failed queries.
	 *@param number lng  longitude in degrees in the range [-180 .. 180]; values outside this range result in failed queries 
	 *@param function onComplete a function to be called when the request has completed, required; the function must accept as arguments:
	 * - responseData - an instance of nokia.places.objects.Place containing data returned by the Places back-end
	 * - status - {String}, a constant, with the value of 'OK' to indicate success or 'ERROR' to indicate request failure or time-out
	 *@return mixed The return value is made available asynchronously as arguments passed to the onComplete handler;
	 *when status is 'OK', the argument responseData contains a place object, which is an instance of nokia.places.objects.Place
	 *or an empty String if there is no address information available for selected coordinates. Directly function also returns
	 *a number which is the request ID and can be used to cancel/abort the current request with nokia.places.comm.data.abortRequest
	 */
	reverseGeoCode:function(lat,lng,onComplete){
		var searchManager = nokia.places.search.manager;
		searchManager.reverseGeoCode({
		latitude: lat,
		longitude: lng,
		onComplete: onComplete
	});
	},
	/*search for loacation by geocode[fast & easy method]
	 *@param string q location address to be searched
	 *@param function [pfunc] function call back to process results,if not set we will use the default one[searchProcess]
	 *@param function [sfunc] function call back if search produced no results
	 *@param function [ffunc] function call back if search request failed
	  
	 */
	search:function(q){
	  var searchManager = nokia.places.search.manager,resultSet;

	// Function for receiving search results from places search and process them
	var processResults = function (data, requestStatus, requestId) {
		var i, len, locations, marker;
		
		if (requestStatus == "OK") {
			// The function findPlaces() and reverseGeoCode() of  return results in slightly different formats
			locations = data.results ? data.results.items : [data.location];
			// We check that at least one location has been found
			if (locations.length > 0) {
				// Remove results from previous search from the map
				if (resultSet) map.objects.remove(resultSet);
				// Convert all found locations into a set of markers
				resultSet = new nokia.maps.map.Container();
				for (i = 0, len = locations.length; i < len; i++) {
					marker = new nokia.maps.map.StandardMarker(locations[i].position, { text: i+1 });
					resultSet.objects.add(marker);
				}
				// Next we add the marker(s) to the map's object collection so they will be rendered onto the map
				map.objects.add(resultSet);
				// We zoom the map to a view that encapsulates all the markers into map's viewport
				map.zoomTo(resultSet.getBoundingBox(), false);
			} else { 
				alert("Your search produced no results!");
			}
		} else {
			alert("The search request failed");
		}
	  };
	  //we use geocode for searching
	  searchManager.geoCode({
		searchTerm: q,
		onComplete: processResults
	  });
	},
	/*
	 *@param array waypoint list of nokia.maps.geo.Coordinate to define route points
	 *@param array modes An array of objects that define the modes for the routes to be calculated
	 *@param function [cb] a call back function will be called when a route was calculated,if not set will use the default one.
	 *@return none
	 */
	routing:function(waypoint,modes,cb){
	  //check if waypoint list set or not
	  if(waypoint == undefined || waypoint.length < 1){
		//error waypoint not set or the list is empty!
		return;
	  }
	  // create a route manager;
	  router = new nokia.maps.routing.Manager();
	  if(typeof cb != Object){
		// The function onRouteCalculated  will be called when a route was calculated
		cb = function (observedRouter, key, value) {
				if (value == "finished") {
					var routes = observedRouter.getRoutes();
					
					//create the default map representation of a route
					var mapRoute = new nokia.maps.routing.component.RouteResultSet(routes[0]).container;
					map.objects.add(mapRoute);
					
					//Zoom to the bounding box of the route
					map.zoomTo(mapRoute.getBoundingBox(), false, "default");
				} else if (value == "failed") {
					alert("The routing request failed.");
				}
			};
	  }
	  /* We create on observer on router's "state" property so the above created
	  * onRouteCalculated we be called once the route is calculated
	  */
	  router.addObserver("state", cb);
	  // Create waypoints
	  var waypoints = new nokia.maps.routing.WaypointParameterList();
	  for(var i=0;i<waypoint.length;i++){
		waypoints.addCoordinate(waypoint[i]);
	  }
	  // Calculate the route (and call onRouteCalculated afterwards)
	  router.calculateRoute(waypoints, modes);

	  
	},
	positioning:function(){
	  if (nokia.maps.positioning.Manager) {
	  var positioning = new nokia.maps.positioning.Manager();
	  
	  // Gets the current position, if available the first given callback function is executed else the second
	  positioning.getCurrentPosition(
		  // If a position is provided by W3C geolocation API of the browser
		  function (position) {
			  var coords = position.coords, // we retrieve the longitude/latitude from position
				  marker = new nokia.maps.map.StandardMarker(coords), // creates a marker
				  /* Create a circle map object  on the  geographical coordinates of
				   * provided position with a radius in meters of the accuracy of the position
				   */
				  accuracyCircle = new nokia.maps.map.Circle(coords, coords.accuracy);
			  
			  // Add the circle and marker to the map's object collection so they will be rendered onto the map.
			  map.objects.addAll([accuracyCircle, marker]);
			  /* This method zooms the map to ensure that the bounding box calculated from the size of the circle
			   * shape is visible in its entirety in map's viewport. 
			   */
			  map.zoomTo(accuracyCircle.getBoundingBox(), false, "default");
		  }, 
		  // Something went wrong we wee unable to retrieve the GPS location
		  function (error) {
			  var errorMsg = "Location could not be determined: ";
			  
			  // We determine what caused the error and generate error message
			  if (error.code == 1) errorMsg += "PERMISSION_DENIED";
			  else if (error.code == 2) errorMsg += "POSITION_UNAVAILABLE";
			  else if (error.code == 3) errorMsg += "TIMEOUT";
			  else errorMsg += "UNKNOWN_ERROR";
				  
				  // Throw an alert with error message
				  alert(errorMsg);
			  }
		  );
	  }
	},
	///////////////////////////// helper functions ////////////////////////////////////
	
	/*A bounding box represents a rectangular area in the geographic coordinate system.
	 *It is specified in terms of its top-left and bottom-right corners. A bounding box is not necessarily the smallest rectangle
	 *spanned by the two points. A bounding box wider than 180° or higher than 90° can be defined by setting the longitude of the
	 *top-left corner to a larger value than the longitude of the bottom-right corner
	 *@param nokia.maps.geo.Coordinate topLeft An object containing the geo oordinates of the top left corner; latitude must be
	 *greater or at least the same as the latitude of bottomRight; longitude should be smaller than the longitude of bottomRight
	 *@param nokia.maps.geo.Coordinate [bottomRight] An object containing the geo oordinates of the bottom right corner; latitude must be
	 *lower or at least the same as the latitude of the top left corner; longitude should be greater than the longitude of the top left corner
	 *@param boolean [skipValidation] A flag indicating if the validation of the latitude is to be omitted; true means that no validation occurs,
	 *in which case the caller must ensure that the latitude of the bottom right corner is greater than that of the top left
	 */
	boundingBox:function(topLeft, bottomRight, skipValidation){
	  return new nokia.maps.geo.BoundingBox(topLeft, bottomRight, skipValidation);
	},
	/*stores geographic coordinates in an optimized way and allows specialized operations on them
	 *@param {Number[] | nokia.maps.geo.Coordinate[]} coords Either an array of geographic coordinates following
	 *the pattern [lat, lng, alt, ..., lat, lng, alt] or an array of instances of nokia.maps.geo.Coordinate
	 *@param string [mode] A string indicating how the array is to be interpreted.for details, please see nokia.maps.geo.Strip.convertToArray().
	 *@return object return a new instance of nokia.maps.geo.Strip
	 */
	strip:function(coords, mode){
	  return new nokia.maps.geo.Strip(coords, mode);
	},
	/*represents a geographical location, a point on the map, defined in terms of its geographical
	 *coordinates latitude, longitude and (optionally) altitude
	 *@param number lat Latitude in degrees; values must be in the range [-90, 90], otherwise the error IllegalArgument is thrown
	 *@param number lng Longitude in degrees; values must be in the range [-180, 180], otherwise the error IllegalArgument is thrown
	 *@param number [alt] Altitude in meters
	 *@param boolean [skipValidation]:false If true, validation of the latitude, longitude and altitude is not performed
	 *@return object a new instance of nokia.maps.geo.Coordinate
	 */
    coordinate:function(lat,lng,alt,skipValidation){
	  return new nokia.maps.geo.Coordinate(lat,lng,alt,skipValidation);
	}
    

  };
  
  
  //////////////////////////////////////////
  $.fn.JNokia = function(method) {
  
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      return $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }
  };
  $.fn.JNokia.defaults = {
    appId:'jGzF0E8Pw2plTbU1J7d1',
	authenticationToken:'KuHTl0TqHwlzIEtDtTE7PQ',
    log:true,
	zoom:18,
	center:[24.76610745182157,46.660324931144714],
    behavior: false,       
	zoomBar: false,                  
	scaleBar: false,                 
	overview: false,                  
	traffic: false,                   
	ContextMenu: false,               
	typeSelector: false,              
	publicTransport: false,           
	positioning: false,
    mapWidth:100,
    mapHeight:100
    
    
    };
})( jQuery );