$(function() {
    var form = $("#addContentForm");
    var user_id = $("#dLabel").text().trim();
    form.find("button").click(function() {
        $.ajax({
            type: "post",
            url: "/contents/content",
            dataType: "json",
            data: form.serialize()+"&user_id="+user_id,
            success: function(data) {
                if(data.bool == 1) {
                    window.location = window.location.origin+"/www/content.html"
                }
            }
        });
    });
})