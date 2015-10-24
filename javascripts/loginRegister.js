define(["firebase", "dataControl", "domControl"], function(firebase, dataControl, domControl) {

	var firebaseRef = new firebase("https://nss-movie-history.firebaseio.com");

	return {
		getLogin: function(emailArg, passwordArg) {
			firebaseRef.authWithPassword({
					email 	 : "mncross@gmail.com",
					password : "abc"
			}, function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					dataControl.getUsersMovies()
					.then(function(moviesReturnedByPromise){
							$('#loginRegister').remove();
							domControl.loadProfileHbs(moviesReturnedByPromise);
					});
				}
			});
		},
		getRegister: function(){
			var newUserEmail = $('#email').val();
			firebaseRef.createUser({
					email    : newUserEmail,
					password : $('#pwd').val()
			}, function(error, userData) {
					if (error) {
						console.log("Error creating user:", error);
					} else {
						var newUser ={
							userEmail: newUserEmail
						};
						firebaseRef.child('users').child(userData.uid).set(newUser);
						$('#loginMessage').text(newUserEmail + " is now registered. Please login.");
					}
			});
		}
	};
});


