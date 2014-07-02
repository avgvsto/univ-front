var SessionManager = {

	session : {
		user_id : null,
		user_name: null,
		user_file: null
	},

	login : function( data ){
		console.info( "[SessionManager]--> login" );
		var url = "login";

		$.when( this.submit(data, url) ).done(function ( resp ){
			console.info(resp);
			if( resp.login === "ok"){
				Router.navigate_to("services");
				Utils.login_view_transform(resp.user);
			}
			return false;
		});
	},

	logout : function( data ){
		console.info( "[SessionManager]--> logout" );
		var url = "logout";
		$.when( this.submit( data, url) ).done(function ( resp ){
			if( resp.logout === "ok"){
				Router.navigate_to("index");
				Utils.logout_view_transform(resp.user); }
			});
	},

	get_status : function(){
		console.info( "[SessionManager]--> get_status" );
		var url = "session-status";

		$.when( this.submit(null, url) ).done(function ( resp ){
			console.info(resp);
			return resp.session_status;
		});
	},

	access_control : function(){
		console.info( "[SessionManager]--> access_control" );
		$("#services, #otro").on("pagebeforeshow", function(){
			console.warn('Se accedió a recurso denegado');
			$.ajax({
				url: 'http://localhost/univ/public/session-status',
				type: 'post',
				dataType: 'json'
			})
			.done(function(resp) {
				if(resp.session_status === "not-logged" ){
					Router.navigate_to("index");
				}
			})
			.fail(function(resp) {
				Router.navigate_to("index");
			});
		});

	},

	submit : function( data, url ) {
		return $.ajax({
			url: 'http://localhost/univ/public/' + url,
			type: 'post',
			dataType: 'json',
			data: data
		})
		.done(function(resp) {
			return resp;
		})
		.fail(function(resp) {
			return resp;
		});
	}
};