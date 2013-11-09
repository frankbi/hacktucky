var map = null;
var location, p1;
var markersArray = [];
var linesArray = [];
var markerCounter = 0;
var guessCounter = 0;
var score = 0; // indiv selection score added to globalScore
var globalScore = 0;

var quesRan = [];
var quesCounter = 0;

function myQuestions() {
	for (var i = 0; i < 4; i++) {
		quesRan[i] = Math.floor((Math.random()*20)+1);
	}
}

function start() {
		
	$("#side_bar").html(function() {
		console.log(d[quesRan[quesCounter]].image_filename);
		var masthead = "<div class='masthead'><h1 class='title'>Historically Louisville</h1></div>";
		var name = "<h1>" + d[quesRan[quesCounter]].name + "</h1>";
		var image = "<img class=\"side_bar_photo\" src=\"../img/" + d[quesRan[quesCounter]].image_filename + "\">";
		var checkAns = "<button onclick='checkAnswer(p1)'>Make Your Guess</button>";
		var nextQues = "<button class='next_button' onclick='nextQues()'>Next</button>";
		return masthead + name + image + checkAns + nextQues; 
	});

}

function checkAnswer(p1) {
	var answerIcon = new google.maps.MarkerImage("../img/marker-red.png", null, null, null, new google.maps.Size(45,65));
	var p2 = new google.maps.LatLng(d[quesRan[quesCounter]].lat, d[quesRan[quesCounter]].long);
	var marker = new google.maps.Marker({
		animation: google.maps.Animation.DROP,
		position: new google.maps.LatLng(p2.nb, p2.ob),
		map: map,
		icon: answerIcon
	});
	markersArray.push(marker);
	calcDistance(p1, p2);
	guessCounter = 1;
}

function nextQues() {
	quesCounter++;
	clearOverlays();
	guessCounter = 0;
	
	////////////////////////
	/* replace from above */
	$("#side_bar").html(function() {
		console.log(d[quesRan[quesCounter]].image_filename);
		var masthead = "<div class='masthead'><h1 class='title'>Historically Louisville</h1></div>";
		var name = "<h1>" + d[quesRan[quesCounter]].name + "</h1>";
		var image = "<img class=\"side_bar_photo\" src=\"../img/" + d[quesRan[quesCounter]].image_filename + "\">";
		var checkAns = "<button onclick='checkAnswer(p1)'>Make Your Guess</button>";
		var nextQues = "<button class='next_button' onclick='nextQues()'>Next</button>";
		return masthead + name + image + checkAns + nextQues; 
	});
	/* replace from above */
	////////////////////////
}

function clearOverlays() {
	for (var i = 0; i < markersArray.length; i++ ) {
		markersArray[i].setMap(null);
	}
	for (var z = 0; z < linesArray.length; z++) {                           
  		linesArray[z].setMap(null);
	}
	markersArray = [];
	linesArray = [];
}

function initalize() {
	map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControlOptions: {
			mapTypeIds: ['mystyle', google.maps.MapTypeId.TERRAIN]
		},
		center: new google.maps.LatLng(38.234405,-85.804253),
		zoom: 11,
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
	var answerIcon = new google.maps.MarkerImage("../img/marker-green.png", null, null, null, new google.maps.Size(45,65));
	var marker = new google.maps.Marker({
		animation: google.maps.Animation.DROP,
		position: new google.maps.LatLng(lat, long),
		map: map,
		icon: answerIcon
	});
	// console.log(lat);
	markersArray.push(marker);
	markerCounter++;
	p1 = new google.maps.LatLng(lat, long);
}

function calcDistance(point1, point2) {
	var distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000;

	// Draw line
	setTimeout(function() {
		var line = new google.maps.Polyline({
		path: [new google.maps.LatLng(point1.nb, point1.ob), new google.maps.LatLng(point2.nb, point2.ob)],
			strokeColor: "black",
			strokeOpacity: 1.0,
			strokeWeight: 2,
			map: map
		});
		linesArray.push(line);
	}, 500);

	calcScore(distance);

}

function calcScore(dis) {
        // dis = distance away in km
        // use the distance to generate some kind of score
        // add it to the score variable
        score = Math.round(score + (1 / dis) * 100);
        console.log("one score: " + score);
        globalScore = globalScore + score;
        console.log("global score: " + globalScore); 
}

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
			{ visibility: "on" }
		]
	}
];

$(document).ready(function() {
	initalize();
	myQuestions();
	console.log(d[quesRan[quesCounter]]);

	$("#side_bar").animate({width:"320px"}, 400);
	$("#side_bar").html(function() {
		var masthead = "<div class='masthead'><h1 class='title'>Historically Louisville</h1></div>";
		var startbutton = "<button onclick='start()' class='start_button'>Let's get started</button>";
		return masthead + startbutton;
	});

	/*
	$("#top_bar").html(function() {
		var title = "<h1 class=\"title\">Historically Louisville</h1>";
		var byline = "<h2 class=\"byline\">By Adam Schweigert, Claire Ellen Lindsey and Frank Bi</h2>";
		var start = "<button onclick=\"start()\" class=\"header\">Let's get started</button>";
		return title + byline + start;
	});
	*/
	
	map.mapTypes.set('mystyle', new google.maps.StyledMapType(myStyle));
});
