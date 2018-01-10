function showBasicForm()
{
    let Obj = ObjectPool[current].ObjectInfo;
    let basic_form = $("#basic-form");
    basic_form.find("#extra-arg").hide();
    basic_form.fadeIn();

    basic_form.find("#basic-scalex").spinner("value", Obj.transformation.scale[0]);
    basic_form.find("#basic-scaley").spinner("value", Obj.transformation.scale[1]);
    basic_form.find("#basic-scalez").spinner("value", Obj.transformation.scale[2]);
    basic_form.find("#basic-rotx").spinner("value", Obj.transformation.rotation['x'] / 6.28 * 360);
    basic_form.find("#basic-roty").spinner("value", Obj.transformation.rotation['y'] / 6.28 * 360);
    basic_form.find("#basic-rotz").spinner("value", Obj.transformation.rotation['z'] / 6.28 * 360);
    basic_form.find("#basic-x").spinner("value", Obj.transformation.translation[0]);
    basic_form.find("#basic-y").spinner("value", Obj.transformation.translation[1]);
    basic_form.find("#basic-z").spinner("value", Obj.transformation.translation[2]);
    if (Obj.useTexture)
        basic_form.find("#basic-entex").prop("checked", true);
    else
        basic_form.find("#basic-entex").prop("checked", false);
    //$("#basic-texture").prop("value", Obj.texture);
    basic_form.find("#basic-color").colorpicker("setValue","rgba("+Obj.diffuseColor[0]*255 + "," + Obj.diffuseColor[1]*255 + "," + Obj.diffuseColor[2]*255 + "," + Obj.diffuseColor[3] + ")");

    if (ObjectPool[current].ObjectInfo.useTexture)
    {
        basic_form.find(".input-color").hide();
        basic_form.find(".input-texture").fadeIn();
    }
    else
    {
        basic_form.find(".input-texture").hide();
        basic_form.find(".input-color").fadeIn();
    }
}

function showPrismForm()
{
    let Obj = ObjectPool[current].ObjectInfo;
    let extra_arg = $("#basic-form").find("#extra-arg");
    extra_arg.find("#sideNum").spinner("value", Obj.sideNum);
    showBasicForm();
    extra_arg.show();
    extra_arg.find(".input-upBottomRatio").hide();
}

function showTrustumForm()
{
    let Obj = ObjectPool[current].ObjectInfo;
    let extra_arg = $("#basic-form").find("#extra-arg");
    extra_arg.find("#sideNum").spinner("value", Obj.sideNum);
    extra_arg.find("#upBottomRatio").spinner("value", Obj.upBottomRatio);
    showBasicForm();
    extra_arg.find(".input-upBottomRatio").show();
    extra_arg.show();
}

function showForm()
{
    let type = ObjectPool[current].type;
    $("#form-container").find(".form-title").text(type + " form");

    if (type === "cube" || type === "sphere" || type === "cylinder" || type === "cone")
    {
        showBasicForm();
    }
    else if (type === "prism")
    {
        showPrismForm();
    }
    else if (type === "trustum")
    {
        showTrustumForm();
    }

}

function unshowBasicForm()
{
    $("#basic-form").fadeOut();
}

function changeBasic()
{
    if (current == null) return ;
    let type = ObjectPool[current].type;
    let basic_form = $("#basic-form");
    let obj_info = ObjectPool[current].ObjectInfo;

    obj_info.transformation.scale[0] = basic_form.find("#basic-scalex").spinner("value");
    obj_info.transformation.scale[1] = basic_form.find("#basic-scaley").spinner("value");
    obj_info.transformation.scale[2] = basic_form.find("#basic-scalez").spinner("value");
    obj_info.transformation.rotation.x = basic_form.find("#basic-rotx").spinner("value") / 360 * 6.28;
    obj_info.transformation.rotation.y = basic_form.find("#basic-roty").spinner("value") / 360 * 6.28;
    obj_info.transformation.rotation.z = basic_form.find("#basic-rotz").spinner("value") / 360 * 6.28;
    obj_info.transformation.translation[0] = basic_form.find("#basic-x").spinner("value");
    obj_info.transformation.translation[1] = basic_form.find("#basic-y").spinner("value");
    obj_info.transformation.translation[2] = basic_form.find("#basic-z").spinner("value");
    obj_info.useTexture = !!basic_form.find("#basic-entex").is(':checked');

    let s = basic_form.find("#basic-color").colorpicker("getValue");
    s = s.substring(5);
    let a = s.substring(0, s.indexOf(','));
    obj_info.diffuseColor[0] = parseInt(a)/255;
    s = s.substring(s.indexOf(',')+1);
    a = s.substring(0, s.indexOf(','));
    obj_info.diffuseColor[1] = parseInt(a)/255;
    s = s.substring(s.indexOf(',')+1);
    a = s.substring(0, s.indexOf(','));
    obj_info.diffuseColor[2] = parseInt(a)/255;
    s = s.substring(s.indexOf(',')+1);
    a = s.substring(0, s.indexOf(')'));
    obj_info.diffuseColor[3] = parseFloat(a);

    if (obj_info.useTexture)
    {
        basic_form.find(".input-color").hide();
        basic_form.find(".input-texture").fadeIn();

    }
    else
    {
        basic_form.find(".input-texture").hide();
        basic_form.find(".input-color").fadeIn();
    }

    if (type === "prism" || type === "trustum")
    {
        obj_info.sideNum = basic_form.find("#sideNum").spinner("value");
    }

    if (type === "trustum")
    {
        obj_info.upBottomRatio = basic_form.find("#upBottomRatio").spinner("value");
    }

}

jQuery.fn.myform=function()
{
    $( ".spinner" ).spinner();
    $(".input-rot").find(".spinner").spinner({max:360, min:0, step:1});
    $(".input-scale").find(".spinner").spinner({min:0, step:0.1});
    $(".input-sideNum").find(".spinner").spinner({max:10, min:3, step:1});
    $(".input-upBottomRatio").find(".spinner").spinner({max:1, min:0.1, step:0.1});
    $("#basic-form").find(".spinner").spinner({stop:changeBasic});
    $('#basic-color').colorpicker({
        format: "rgba",
        color: "#FFFFFF"
    }).on('changeColor',
        function(ev) {
            changeBasic();
        });
}