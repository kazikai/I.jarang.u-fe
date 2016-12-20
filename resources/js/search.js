( function( $, window, undefined ) {



    angular.module( "iju" ).controller( "ijuCtrl", [ "$scope", "$http", function( $scope, $http ) {

        function search(){
            var req = {
                method: 'POST',
                url: 'https://openapi.naver.com/v1/search/shop.json',
                headers: {
                    "X-Naver-Client-Id": "dJdCUoFXDK_PXuGff36e",
                    "X-Naver-Client-Secret": "r8RuqNlwCA"
                },
                data: {
                    query: encodeURIComponent( $scope.searchWord ),
                    sort: "sim",
                    display: "100"
                }
            };
            $http( req ).then( function( res ) {
                console.log( res.data );
            }, function( res ) {
                alert( "실패" );
            } );
        }


        $scope.searchWord = "";
        $scope.search = search;




        $(document).on("click", ".btn-success", function( e ){
            e.preventDefault();
            alert("입력하신 키워드가 너무 다양한 검색 결과를 포함하고 있습니다.\n검색 결과를 좁히기 위해 구체적인 상품 이름을 입력해 주세요.\n예)\n스마트폰(X),\nApple iPhone 7 128GB(O)");
            $("#search-result").show();
        });


    } ] );
} ( jQuery, window ) );