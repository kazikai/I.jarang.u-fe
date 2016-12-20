// Demo script
jQuery(function($){
    $(document).on("click", ".btn-success", function( e ){
        e.preventDefault();
        alert("입력하신 키워드가 너무 다양한 검색 결과를 포함하고 있습니다.\n검색 결과를 좁히기 위해 구체적인 상품 이름을 입력해 주세요.\n예)\n스마트폰(X),\nApple iPhone 7 128GB(O)");
        $("#search-result").show();
    });
});