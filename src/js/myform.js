function changeCubic()
{
    if ($("#cubic-sizex").spinner("value") != null)
        current.x_size = $("#cubic-sizex").spinner("value");
    if ($("#cubic-sizey").spinner("value") != null)
        current.y_size = $("#cubic-sizey").spinner("value");
    if ($("#cubic-sizez").spinner("value") != null)
        current.z_size = $("#cubic-sizez").spinner("value");
    if ($("#cubic-rotx").spinner("value") != null)
        current.x_rot = $("#cubic-rotx").spinner("value");
    if ($("#cubic-roty").spinner("value") != null)
        current.x_rot = $("#cubic-roty").spinner("value");
    if ($("#cubic-rotz").spinner("value") != null)
        current.x_rot = $("#cubic-rotz").spinner("value");
    if ($("#cubic-x").spinner("value") != null)
        current.x = $("#cubic-x").spinner("value");
    if ($("#cubic-y").spinner("value") != null)
        current.y = $("#cubic-y").spinner("value");
    if ($("#cubic-z").spinner("value") != null)
        current.z = $("#cubic-z").spinner("value");
}

jQuery.fn.myform=function()
{
    $( ".spinner" ).spinner();
    $(".input-rot .spinner").spinner({max:360, min:0});
    $(".input-size .spinner").spinner({min:0});
    $("#cubic-form .spinner").spinner({stop:changeCubic});
}