( function( $, window, undefined ) {

    function parseQuery(qs) {
        qs = qs || location.search;
        var result = {},
            keyValuePairs = qs.slice(1).split("&");
            for (var i = 0, l = keyValuePairs.length; i < l; i++) {
                var keyValuePair = keyValuePairs[i].split("=");
                if (keyValuePair[0] !== "" && !!keyValuePair[1]) {
                    result[keyValuePair[0]] = decodeURIComponent(keyValuePair[1]) || "";
                }
        }
        return result;
    }

    angular.module( "iju" ).controller( "ijuCtrl", [ "$scope", "$http", "$httpParamSerializer", "comma", function( $scope, $http, $httpParamSerializer, comma ) {
        var qs = parseQuery();
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
            $scope.loading = true;
            $scope.id = qs.id ? qs.id: null;
            $scope.keyword = param.query;

            $http.get( 'http://139.162.71.151:3000/api/search/shop?' + $httpParamSerializer( param )  ).then( function( res ) {
                console.log( res.data );
                $scope.loading = false;
                var exceptList = $scope.except ? $scope.except.split( /\ +/ ) : [];
                var exceptListLength = exceptList.length;
                var filterList = res.data.items.filter( function( v ) {
                    var valid = true;
                    for ( var i = 0; i < exceptListLength; i += 1 ) {
                        if ( v && v.title && v.title.indexOf( exceptList[ i ] ) > -1 ) {
                            valid = false;
                            break;
                        }
                    }
                    if ( valid ) {
                        return v;
                    }
                } );
                var lowPrice = {
                    lprice: null
                };
                var highPrice = {
                    lprice: 0
                };

                filterList.forEach( function( v ) {
                    if( !lowPrice.lprice || v.lprice && +v.lprice > 1000 && ( +v.lprice < +lowPrice.lprice ) ) {
                        lowPrice = v;
                        console.log( lowPrice );
                    }
                    if( v.lprice && ( +v.lprice > +highPrice.lprice ) ) {
                        highPrice = v;
                    }
                } );

                if ( filterList.length > 1000 && res.data.total > 10000 ) {
                    alert("입력하신 키워드가 너무 다양한 검색 결과를 포함하고 있습니다.\n검색 결과를 좁히기 위해 구체적인 상품 이름을 입력해 주세요.\n예)\n스마트폰(X),\nApple iPhone 7 128GB(O)");
                } else if ( !filterList.length || !res.data.total ) {
                    alert( "검색 결과가 없습니다." );
                    return;
                }
                $scope.filterList = filterList;
                $scope.filterCount = filterList.length;
                $scope.highPrice = comma.get( highPrice.lprice );
                $scope.lowPrice = comma.get( lowPrice.lprice );
                $scope.price = lowPrice.lprice;
                $scope.result = true;
            }, function( res ) {
                alert( "실패" );
            } );
        }
        function subscribe(){
            var param = {
                id: $scope.id,
                keyword: $scope.keyword,
                except: $scope.except,
                price: $scope.price
            };
            $http.get( "http://139.162.71.151:3000/subscribe?" + $httpParamSerializer( param ) ).then( function( res ) {
                alert( "등록 성공" );
            }, function( res ) {
                alert( "등록 실패" );
            } );
            return false;
        }

        $scope.result = false;
        $scope.search = search;
        $scope.subscribe = subscribe;




        //$(document).on("click", ".btn-success", function( e ){
        //    e.preventDefault();
        //    alert("입력하신 키워드가 너무 다양한 검색 결과를 포함하고 있습니다.\n검색 결과를 좁히기 위해 구체적인 상품 이름을 입력해 주세요.\n예)\n스마트폰(X),\nApple iPhone 7 128GB(O)");
        //    $("#search-result").show();
        //});


    } ] );
} ( jQuery, window ) );