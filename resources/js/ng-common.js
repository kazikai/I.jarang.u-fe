( function( $, window, undefined ) {
    /*global angular:true */
    angular.module( "iju", [ "ngSanitize" ] );
    angular.module( "iju" ).config( function( $interpolateProvider ) {
        $interpolateProvider.startSymbol( "{[{" );
        $interpolateProvider.endSymbol( "}]}" );
    } );

    angular.module( "iju" ).factory( "comma", function() {
        return {
            get: function( number ) {
                var commaResult = "",
                    numberLength;
                number = "" + number;
                numberLength = number.length;
                if( numberLength > 3 ) {
                    commaRemain = numberLength % 3;
                    for( var i = 0; i < numberLength; i += 1 ) {
                        if ( i !== 0 && i % 3 === commaRemain ) {
                            commaResult += ",";
                        }
                        commaResult += number.substr( i, 1 );
                    }
                    return commaResult;
                } else {
                    return number;
                }
            }
        };
    } );

} ( jQuery, window ) );
