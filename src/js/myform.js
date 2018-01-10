function showCubeForm()
{
    let Obj = ObjectPool[current].ObjectInfo;
    let cube_form = $("#cube-form");
    cube_form.fadeIn();
    $("#cube-sizex").spinner("value", Obj.transformation.scale[0]);
    $("#cube-sizey").spinner("value", Obj.transformation.scale[1]);
    $("#cube-sizez").spinner("value", Obj.transformation.scale[2]);
    $("#cube-rotx").spinner("value", Obj.transformation.rotation['x'] / 6.28 * 360);
    $("#cube-roty").spinner("value", Obj.transformation.rotation['y'] / 6.28 * 360);
    $("#cube-rotz").spinner("value", Obj.transformation.rotation['z'] / 6.28 * 360);
    $("#cube-x").spinner("value", Obj.transformation.translation[0]);
    $("#cube-y").spinner("value", Obj.transformation.translation[1]);
    $("#cube-z").spinner("value", Obj.transformation.translation[2]);
    if (Obj.useTexture)
        $("#cube-entex").prop("checked", true);
    else
        $("#cube-entex").prop("checked", false);
    //$("#cube-texture").prop("value", Obj.texture);
    $("#cube-color").colorpicker("setValue","rgba("+Obj.diffuseColor[0]*255 + "," + Obj.diffuseColor[1]*255 + "," + Obj.diffuseColor[2]*255 + "," + Obj.diffuseColor[3] + ")");

    if (ObjectPool[current].ObjectInfo.useTexture)
    {
        cube_form.find(".input-color").hide();
        cube_form.find(".input-texture").fadeIn();

    }
    else
    {
        cube_form.find(".input-texture").hide();
        cube_form.find(".input-color").fadeIn();
    }
}

function changeCube()
{
    if (current == null) return ;
    if ($("#cube-sizex").spinner("value") != null)
        ObjectPool[current].ObjectInfo.transformation.scale[0] = $("#cube-sizex").spinner("value");
    if ($("#cube-sizey").spinner("value") != null)
        ObjectPool[current].ObjectInfo.transformation.scale[1] = $("#cube-sizey").spinner("value");
    if ($("#cube-sizez").spinner("value") != null)
        ObjectPool[current].ObjectInfo.transformation.scale[2] = $("#cube-sizez").spinner("value");
    if ($("#cube-rotx").spinner("value") != null)
        ObjectPool[current].ObjectInfo.transformation.rotation.x = $("#cube-rotx").spinner("value") / 360 * 6.28;
    if ($("#cube-roty").spinner("value") != null)
        ObjectPool[current].ObjectInfo.transformation.rotation.y = $("#cube-roty").spinner("value") / 360 * 6.28;
    if ($("#cube-rotz").spinner("value") != null)
        ObjectPool[current].ObjectInfo.transformation.rotation.z = $("#cube-rotz").spinner("value") / 360 * 6.28;
    if ($("#cube-x").spinner("value") != null)
        ObjectPool[current].ObjectInfo.transformation.translation[0] = $("#cube-x").spinner("value");
    if ($("#cube-y").spinner("value") != null)
        ObjectPool[current].ObjectInfo.transformation.translation[1] = $("#cube-y").spinner("value");
    if ($("#cube-z").spinner("value") != null)
        ObjectPool[current].ObjectInfo.transformation.translation[2] = $("#cube-z").spinner("value");

    if ($("#cube-entex").is(':checked'))
        ObjectPool[current].ObjectInfo.useTexture = true;
    else
        ObjectPool[current].ObjectInfo.useTexture = false;

    if ($("#cube-color").colorpicker("getValue")!= null)
    {
        s = $("#cube-color").colorpicker("getValue");
        s = s.substring(5);
        a = s.substring(0, s.indexOf(','));
        ObjectPool[current].ObjectInfo.diffuseColor[0] = parseInt(a)/255;
        s = s.substring(s.indexOf(',')+1);
        a = s.substring(0, s.indexOf(','));
        ObjectPool[current].ObjectInfo.diffuseColor[1] = parseInt(a)/255;
        s = s.substring(s.indexOf(',')+1);
        a = s.substring(0, s.indexOf(','));
        ObjectPool[current].ObjectInfo.diffuseColor[2] = parseInt(a)/255;
        s = s.substring(s.indexOf(',')+1);
        a = s.substring(0, s.indexOf(')'));
        ObjectPool[current].ObjectInfo.diffuseColor[3] = parseFloat(a);
    }

    let cube_form = $("#cube-form");
    if (ObjectPool[current].ObjectInfo.useTexture)
    {
        cube_form.find(".input-color").hide();
        cube_form.find(".input-texture").fadeIn();

    }
    else
    {
        cube_form.find(".input-texture").hide();
        cube_form.find(".input-color").fadeIn();
    }

}

jQuery.fn.myform=function()
{
    $( ".spinner" ).spinner();
    $(".input-rot").find(".spinner").spinner({max:360, min:0});
    $(".input-size").find(".spinner").spinner({min:0});
    $("#cube-form").find(".spinner").spinner({stop:changeCube});
    $('#cube-color').colorpicker({
        format: "rgba",
        color: "#FFFFFF"
    }).on('changeColor',
        function(ev) {
            changeCube();
        });
}