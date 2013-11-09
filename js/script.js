var map = null;
var location, p1;
var markersArray = [];
var linesArray = [];
var markerCounter = 0;
var guessCounter = 0;
var score = 0; // indiv selection score added to globalScore
var globalScore = 0;
var scoreTracker = [];

var quesRan = [];
var quesCounter = 0;

function myQuestions() {
	for (var i = 0; i < 20; i++) {
		quesRan[i] = i;
	}
	quesRan.sort(function() {
		return Math.random() - 0.5;
	});
}

function start() {
		
	$("#side_bar").html(function() {
		// console.log(d[quesRan[quesCounter]].image_filename);
		var masthead = "<div class='masthead'></div>";
		var name = "<h1 class='place'>" + d[quesRan[quesCounter]].name + "</h1>";
		var image = "<img class=\"side_bar_photo\" src=\"../img/" + d[quesRan[quesCounter]].image_filename + "\">";
		var roundscore = "<div class=\"round_score\"></div>";
		var checkAns = "<button onclick='checkAnswer(p1)'>Make Your Guess</button>";
		var nextQues = "<button class='next_button' onclick='nextQues()'>Next</button>";
		return masthead + name + image + roundscore + checkAns + nextQues; 
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
	
	$("#side_bar").html(function() {
		var masthead = "<div class='masthead'></div>";
		var name = "<h1 class='place'>" + d[quesRan[quesCounter]].name + "</h1>";
		var roundscore = "<div class=\"round_score\"></div>";
		var image = "<div class='descrip_box'><img class=\"side_bar_photo descrip\" src=\"../img/" + d[quesRan[quesCounter]].image_filename + "\">";
		var description = d[quesRan[quesCounter]].short_description;
		var learnmore = "<br><a target=\"_blank\" href=\"" + d[quesRan[quesCounter]].moreinfo_link + "\">Learn More</a></div>";
		var checkAns = "<button onclick='checkAnswer(p1)'>Make Your Guess</button>";
		var nextQues = "<button class='next_button' onclick='nextQues()'>Next</button>";
		return masthead + roundscore + name + image + description + learnmore + checkAns + nextQues; 
	});
	
	markersArray.push(marker);
	calcDistance(p1, p2);
	guessCounter = 1;
}

function nextQues() {

	quesCounter++;
	console.log(quesCounter);
	if (quesCounter < 5) {
		clearOverlays();
		guessCounter = 0;
		
		$("#side_bar").html(function() {
			var masthead = "<div class='masthead'></div>";
			var name = "<h1 class='place'>" + d[quesRan[quesCounter]].name + "</h1>";
			var image = "<img class=\"side_bar_photo\" src=\"../img/" + d[quesRan[quesCounter]].image_filename + "\">";
			var roundscore = "<div class=\"round_score\"></div>";
			var checkAns = "<button onclick='checkAnswer(p1)'>Make Your Guess</button>";
			var nextQues = "<button class='next_button' onclick='nextQues()'>Next</button>";
			return masthead + name + image + roundscore + checkAns + nextQues; 
		});


	} else {
		$("#side_bar").html(function() {
			var masthead = "<div class='masthead'></div>";
			var finalscore = "<h1>Final Score: " + globalScore + "</h1>";
			var round1 = "<p class='finalscores'>Round 1: " + scoreTracker[0] + "</p>";
			var round2 = "<p class='finalscores'>Round 2: " + scoreTracker[1] + "</p>";
			var round3 = "<p class='finalscores'>Round 3: " + scoreTracker[2] + "</p>";
			var round4 = "<p class='finalscores'>Round 4: " + scoreTracker[3] + "</p>";
			var round5 = "<p class='finalscores'>Round 5: " + scoreTracker[4] + "</p>";
			var roundscores = round1 + round2 + round3 + round4 + round5;
			var restart = "<button onclick='location.reload()'>Play Again</button>";
			return masthead + roundscores + finalscore + twitterTweet(globalScore) + restart;
		});
	}
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
			mapTypeIds: ['mystyle', google.maps.MapTypeId.TERRAIN],
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.BOTTOM_CENTER
		},
		panControl: true,
		panControlOptions: {
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		center: new google.maps.LatLng(38.234405,-85.804253),
		zoom: 11,
		disableDefaultUI: false,
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
			strokeColor: "rgb(64,178,128)",
			strokeOpacity: 1.0,
			strokeWeight: 3,
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
        scoreTracker.push(score);
        $(".round_score").html(function() {
        	var sc = "<h1 style='font-size:20px;'>Score: " + score + "</h1>";
        	var distance = "<h1 style='font-size:20px;'>Distance: " + dis.toFixed(2) + " km</h1>";
        	return distance + sc;
        });
        // console.log("one score: " + score);
        globalScore = globalScore + score;
        // console.log("global score: " + globalScore); 
}

function twitterTweet(score) {
	setTimeout(function() {!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs')}, 200);
	return "<a href=\"https://twitter.com/share\" style=\"width:90%\" class=\"twitter-share-button\" data-url=\"http://historicallylouisville.com\" data-text=\"Can you beat my score of " + score + "? Test your knowledge of Louisville landmarks at\" data-via=\"sndlou\" data-size=\"large\" data-count=\"none\" data-hashtags=\"hacktucky\">Tweet</a>";
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
	// console.log(d[quesRan[quesCounter]]);

	$("#side_bar").animate({width:"320px"}, 400);
	$("#side_bar").html(function() {
		var masthead = "<div class='masthead'></div>";
		var subhead = "<p class='subhead'>Explore Louisville's historic landmarks</p>";
		var description = "<p class='description' style='font-weight:bold;font-style:italic;color:rgb(211,87,61);'>Click on the map where you think each nationally registered historical landmark is located.</p>";
		var startbutton = "<img class='startbutton' style=\"width:70%;\" src='../img/startbutton.png' onclick='start()'>";
		var outline = "<img src=\"../img/outline.png\" width=\"100%\" style=\"z-index:5;\">";
		var byline = "<p style=\"float:bottom;\">Designed and built at Hacktucky 2013 by Adam Schweigert, Claire Ellen Lindsey and Frank Bi</p>"
		return masthead + subhead + description + startbutton + outline + byline;
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
