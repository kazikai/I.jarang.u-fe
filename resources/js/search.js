( function( $, window, undefined ) {



    angular.module( "iju" ).controller( "ijuCtrl", [ "$scope", "$http", "$httpParamSerializer", function( $scope, $http, $httpParamSerializer ) {

        function makeQuery( modelList ){
            var queryStringArray = [];
            if ( !Array.isArray( modelList ) ) {
                return;
            }
            modelList.forEach( function( v ) {
                if ( typeof $scope[ v ] !== "undefined" ) {
                    if ( v === "option" ) {
                        queryStringArray.push( $scope[ v ].replace( /\ +/g, "+" ) );
                    } else {
                        queryStringArray.push( $scope[ v ] );
                    }
                }
            } );
            return queryStringArray.join( "+" );
        }

        function search(){
            var param = {
                sort: "sim",
                display: "100"
            };
            if ( !$scope.maker || !$scope.model ) {
                alert( "제조사와 제품명은 꼭 입력해주세요." );
                return;
            }
            param.query = makeQuery( [ "maker", "model", "version", "option" ] );

            $http.get( 'http://139.162.71.151:3000/api/search/shop?' + $httpParamSerializer( param )  ).then( function( res ) {
                console.log( res.data );
            }, function( res ) {
                alert( "실패" );
            } );
        }


        $scope.searchWord = "";
        $scope.search = search;




        //$(document).on("click", ".btn-success", function( e ){
        //    e.preventDefault();
        //    alert("입력하신 키워드가 너무 다양한 검색 결과를 포함하고 있습니다.\n검색 결과를 좁히기 위해 구체적인 상품 이름을 입력해 주세요.\n예)\n스마트폰(X),\nApple iPhone 7 128GB(O)");
        //    $("#search-result").show();
        //});


    } ] );
} ( jQuery, window ) );