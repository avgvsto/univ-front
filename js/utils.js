var Utils = {

	login_view_transform : function(user){
		console.info( "[Utils]--> login_view_transform" );

		//clean
		email: $("#login #email").val("");
        password: $("#login #password").val("");

        //push user user
        console.info(user);
        $("#services #user-name").html("Usuario: " + user.name);
        $("#services #user-file").html("Legajo: " + user.file);

        //index btn-login to btn-services
        $("#index-header a").html("Servicios");
        $("#index-header a").attr('href', '#services');
        
	},

	logout_view_transform : function(user){

        //index btn-login to btn-services
        $("#index-header a").html("Login");
        $("#index-header a").attr('href', '#login');
        
	},

};