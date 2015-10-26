define(["jquery", "q", "firebase"],
	function($, q, firebase) {

	var firebaseRef = new firebase("https://nss-movie-history.firebaseio.com/");

	return {
		OMDbSearch: function(searchString) {
			var deferred = q.defer();
			searchString = searchString.split(' ').join('+');
			$.ajax("http://www.omdbapi.com/?s=" + searchString + "&type=movie&r=json")
			.done(function(potentialMatches) {
				var searchResultsArray = potentialMatches.Search;
				var mappedSearchResultsArray = searchResultsArray.map(function(currentValue) {
					if(currentValue.Poster === "N/A") {
						currentValue.Poster = "../images/defaultPoster.jpg";
					} else {
						currentValue.Poster = "http://img.omdbapi.com/?i=" + currentValue.imdbID + "&apikey=8513e0a1";
					}
					currentValue.active = true;
					return currentValue;
				});
				deferred.resolve(mappedSearchResultsArray);
			}).fail(function() {
				console.log("OMDb search failed");
			});
			return deferred.promise;
		},
		OMDbIDSearch: function(imdbID) {
			var deferred = q.defer();
			$.ajax("http://www.omdbapi.com/?i=" + imdbID + "&r=json")
			.done(function(exactMatch) {
				deferred.resolve(exactMatch);
			})
			.fail(function() {
				console.log("OMDb exact match failed");
			});
			return deferred.promise;
		},
		addUserMovie: function(movieObject) {
			var newMovie;
			if (movieObject.Poster == "N/A") {
				newMovie = {
					Title: movieObject.Title,
					Year: movieObject.Year,
					Actors: movieObject.Actors.replace(/(, )/g, "|").split('|'),
					watched: false,
					Poster: "../images/defaultPoster.jpg",
					rating: 0,
					imdbID: movieObject.imdbID,
					savedToFirebase: true,
					active: true
				};
			} else {
				newMovie = {
					Title: movieObject.Title,
					Year: movieObject.Year,
					Actors: movieObject.Actors.replace(/(, )/g, "|").split('|'),
					watched: false,
					Poster: "http://img.omdbapi.com/?i=" + movieObject.imdbID + "&apikey=8513e0a1",
					rating: 0,
					imdbID: movieObject.imdbID,
					savedToFirebase: true,
					active: true
				};
			}
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(movieObject.imdbID).set(newMovie);
		},
		getUsersMovies: function() {
			var uid = firebaseRef.getAuth().uid;
			var deferred = q.defer();
			$.ajax("https://nss-movie-history.firebaseio.com/users/" + uid + "/movies/.json")
			.done(function(userMovies) {
				var firebaseMoviesArray = _.values(userMovies).sort(function(a, b) {
          if (a.Title[0] < b.Title[0]) {
            return -1;
          }
          if (a.Title[0] > b.Title[0]) {
            return 1;
          }
          return 0;
        });
				deferred.resolve(firebaseMoviesArray);
			})
			.fail(function() {
				console.log("getUsersMovies was a fail");
			});
			return deferred.promise;
		},
		deleteUsersMovies: function(imdbID) {
			// firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbid).remove(function(error) {
			// 	if (error) {
			// 		console.log("there was an error", error);
			// 	}
			// });
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({active: false});
		},
		markWatched: function(imdbID, thisButton) {
			$(thisButton).attr("watched", true);
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({watched: true});
			$(thisButton).removeClass("btn-danger");
			$(thisButton).addClass("btn-success");
			$(thisButton).text("Watched");
		},
		markUnwatched: function(imdbID, thisButton) {
			$(thisButton).attr("watched", false);
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({watched: false});
			$(thisButton).removeClass("btn-success");
			$(thisButton).addClass("btn-danger");
			$(thisButton).text("Not Watched");
		},
		changeRating: function(imdbID, thisButton, ratingValue) {
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({rating: ratingValue});

		}
	};
});


