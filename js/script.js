var myStyle = [
	{
		featureType: "administrative",
		elementType: "labels",
		stylers: [
			{ visibility: "off" }
		]
	},{
		featureType: "poi",
		elementType: "labels",
		stylers: [
			{ visibility: "off" }
		]
	},{
		featureType: "water",
		elementType: "labels",
		stylers: [
			{ visibility: "on" }
		]
	},{
		featureType: "road",
		elementType: "labels",
		stylers: [
			{ visibility: "off" }
		]
	}
];

var map = null;
var location, p1;
var markersArray = [];
var markerCounter = 0;
var guessCounter = 0;
var score = 0;
var ranIndex;

// Random number generator

	ranIndex = Math.floor((Math.random()*180)+1);


function start() {
	modal.open({ content: function() { 
		return "<div class='modal-content'>" + d[ranIndex].name + "</div>"; 
	}});
}


function clearOverlays() {
	for (var i = 0; i < markersArray.length; i++ ) {
		markersArray[i].setMap(null);
	}
	markersArray = [];
}

function initalize() {
	map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControlOptions: {
			mapTypeIds: ['mystyle', google.maps.MapTypeId.TERRAIN]
		},
		center: new google.maps.LatLng(38.255976,-85.756214),
		zoom: 12,
		disableDefaultUI: true,
		mapTypeId: 'mystyle'
	});

	google.maps.event.addListener(map, 'click', function(event){
		if (guessCounter == 0) {
			var lat = event.latLng.lat();
			var long = event.latLng.lng();
			if (markerCounter == 0) {
				placeMarker(lat, long);
			} else {
				clearOverlays();
				placeMarker(lat, long);
			}
		}
	});
}


function placeMarker(lat, long) {
	var marker = new google.maps.Marker({
		animation: google.maps.Animation.DROP,
		position: new google.maps.LatLng(lat, long),
		map: map
	});
	// console.log(lat);
	markersArray.push(marker);
	markerCounter++;
	p1 = new google.maps.LatLng(lat, long);
}

function checkAnswer(p1) {
	var answerIcon = new google.maps.MarkerImage("../img/drop_red-18.png", null, null, null, new google.maps.Size(55,75));
	var p2 = new google.maps.LatLng(d[ranIndex].lat, d[ranIndex].long);
	var marker = new google.maps.Marker({
		animation: google.maps.Animation.DROP,
		position: new google.maps.LatLng(p2.nb, p2.ob),
		map: map,
		icon: answerIcon
	});
	calcDistance(p1, p2);
	guessCounter = 1;
}

function calcDistance(point1, point2) {
	var distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000;

	// Draw line
	setTimeout(function() {
		var line = new google.maps.Polyline({
		path: [new google.maps.LatLng(point1.nb, point1.ob), new google.maps.LatLng(point2.nb, point2.ob)],
			strokeColor: "black",
			strokeOpacity: 1.0,
			strokeWeight: 4,
			map: map
		});
	}, 500);

	setTimeout(function() {
		modal.open({ content: function() { return "<div class='modal-content'>asdfasdfasd</div>"; } })
	}, 1000);

	calcScore(distance);

}

function calcScore(dis) {
        // dis = distance away in km
        // use the distance to generate some kind of score
        // add it to the score variable
        score = Math.round(score + (1 / dis) * 100);
        console.log(score)
}

var modal = (function(){
        var
        method = {},
        $overlay,
        $modal,
        $content,
        $close;

        method.center = function () {
                    var top, left;
                    top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
                    left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;
                    $modal.css({
                            top:top + $(window).scrollTop(),
                            left:left + $(window).scrollLeft()
                    });
        };

        method.open = function (settings) {
                        var s = $content.empty().append(settings.content)

                                $modal.css({
                                            width: settings.width || "auto",
                                            height: settings.height || "auto"
                                });


                    $modal.fadeIn(420);
                    $overlay.fadeIn(420);
						$close.fadeIn(420);

                    method.center();
                    $(window).bind("resize.modal", method.center);
                    $modal.show();
                    $overlay.show();
        };


        method.close = function () {
                    $modal.fadeOut(420);
                    $overlay.fadeOut(420);
                    $close.fadeOut(0);
                    $content.empty();
                    $(window).unbind("resize.modal");
        };

        $overlay = $("<div id='overlay'></div>");
        $modal = $("<div id='modal'></div>");
        $content = $("<div id='grid-content'></div>");
        $close = $("<a id='close' href='#'></a>");

        $modal.hide();
        $overlay.hide();
        $modal.append($content, $close);

        $(document).ready(function(){
                    $("body").append($overlay, $modal);
        });

        $overlay.click(function(e){
                    e.preventDefault();
                    method.close();
        });

        $close.click(function(e){
                e.preventDefault();
                method.close();
        });

        return method;
}());


$(document).ready(function() {
	initalize();
	console.log(d[ranIndex]);
	map.mapTypes.set('mystyle', new google.maps.StyledMapType(myStyle));
	$("#top_bar").animate({height:"70px"}, 500);
});

