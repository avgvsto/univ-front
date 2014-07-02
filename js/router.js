var Router = {
	navigate_to : function( url ){
		console.info( "[Router]--> navigate_to" );
		$.mobile.navigate("#" + url);
		SessionManager.access_control();
	}
};