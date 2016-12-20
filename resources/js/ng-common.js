( function( $, window, undefined ) {
    /*global angular:true */
    angular.module( "iju", [  ] );
    angular.module( "iju" ).config( function( $interpolateProvider ) {
        $interpolateProvider.startSymbol( "{[{" );
        $interpolateProvider.endSymbol( "}]}" );
    } );

} ( jQuery, window ) );
