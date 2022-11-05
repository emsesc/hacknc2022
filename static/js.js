$(document).ready(function($){

    // filter things

    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myList li").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });


    //--- CONTINUE ---
    $("form > p > a").click(function(){
        //-- Detect terms and conditions
        var term = false;
        if ($(".term > i").hasClass('fa-check-square-o')){
            term = true;
        }
        
        //-- only example
        var user = {};
        user.name = $("input[name='name']").val();
        user.diet = $("input[name='diet']").val();
        user.phone = $("input[name='phone']").val();
        user.items = $("input[name='items']").val();

        //-- Validator            
        $("input").each(function(e, valor){
            var error = false;
            if ($(this).val() == ""){
                error = true;
            }
            if (error === true){
                //-- with errors
                $(this).parent().css({"color":"red"});
                $(this).css({"border-bottom":"1px solid red"});
            }else{
                //-- without errors
                $(this).parent().css({"color":"black"});
                $(this).css({"border-bottom":"1px solid silver","color":"gray"}); 
            }
        })

        //-- msg example
        $("body").append(JSON.stringify(user) + "<br>");
    })
})