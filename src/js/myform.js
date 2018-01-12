let base_form = $("#form-container");
let basic_scale = base_form.find("#basic-scale");
let basic_rot = base_form.find("#basic-rot");
let basic_loc = base_form.find("#basic-loc");
let basic_tc = base_form.find("#basic-tc");
let extra_arg = base_form.find("#extra-arg");
let basic_sideNum = extra_arg.find("#basic-sideNum");
let basic_upBotRatio = extra_arg.find("#basic-upBotRatio");
let model_arg = base_form.find("#model-arg");
let model_obj = model_arg.find("#model-obj");
let model_tex = model_arg.find("#model-texture");
let basic_light = base_form.find("#basic-light");

function hideAll()
{
    base_form.hide();
    basic_scale.hide();
    basic_rot.hide();
    basic_loc.hide();
    extra_arg.hide();
    basic_tc.hide();
    basic_sideNum.hide();
    basic_upBotRatio.hide();
    model_arg.hide();
    model_obj.hide();
    model_tex.hide();
    basic_light.hide();
}

function showScale()
{
    let Obj = ObjectPool[current].ObjectInfo;
    basic_scale.find("#basic-scalex").spinner("value", Obj.transformation.scale[0]);
    basic_scale.find("#basic-scaley").spinner("value", Obj.transformation.scale[1]);
    basic_scale.find("#basic-scalez").spinner("value", Obj.transformation.scale[2]);
    basic_scale.show();
}

function showRot()
{
    let Obj = ObjectPool[current].ObjectInfo;
    basic_rot.find("#basic-rotx").spinner("value", Obj.transformation.rotation['x'] / 6.28 * 360);
    basic_rot.find("#basic-roty").spinner("value", Obj.transformation.rotation['y'] / 6.28 * 360);
    basic_rot.find("#basic-rotz").spinner("value", Obj.transformation.rotation['z'] / 6.28 * 360);
    basic_rot.show();
}

function showLoc()
{
    let type = ObjectPool[current].type;
    if (type === "light") {
        let light_loc = ObjectPool[current].ObjectInfo.pointLightingLocation;
        basic_loc.find("#basic-x").spinner("value", light_loc[0]);
        basic_loc.find("#basic-y").spinner("value", light_loc[1]);
        basic_loc.find("#basic-z").spinner("value", light_loc[2]);
    }
    else {
        let Obj_loc = ObjectPool[current].ObjectInfo.transformation.translation;
        basic_loc.find("#basic-x").spinner("value", Obj_loc[0]);
        basic_loc.find("#basic-y").spinner("value", Obj_loc[1]);
        basic_loc.find("#basic-z").spinner("value", Obj_loc[2]);
    }
    basic_loc.show();
}

function showTC()
{
    let Obj = ObjectPool[current].ObjectInfo;

    basic_tc.find("#basic-entex").prop("checked", Obj.useTexture);
    basic_tc.find("#basic-color").colorpicker("setValue","#"+(Obj.diffuseColor[0]*255).toString(16) + (Obj.diffuseColor[1]*255).toString(16) + (Obj.diffuseColor[2]*255).toString(16));

    basic_tc.find(".input-color").hide();
    basic_tc.find(".input-texture").hide();
    if (ObjectPool[current].ObjectInfo.useTexture)
        basic_tc.find(".input-texture").show();
    else
        basic_tc.find(".input-color").show();
    basic_tc.show();
}

function showSideNum()
{
    let Obj = ObjectPool[current].ObjectInfo;
    basic_sideNum.find("#sideNum").spinner("value", Obj.sideNum);
    basic_sideNum.show();
    extra_arg.show();
}

function showUpBotRatio()
{
    let Obj = ObjectPool[current].ObjectInfo;
    basic_upBotRatio.find("#upBottomRatio").spinner("value", Obj.upBottomRatio);
    basic_upBotRatio.show();
    extra_arg.show();
}

function showModelObj()
{
    let Obj = ObjectPool[current].ObjectInfo;
    if (Obj.objFile == null) {
        model_obj.find(".input-file-label")[0].innerText = "未选择文件";
    }
    else {
       model_obj.find(".input-file-label")[0].innerText = Obj.objFile;
    }
    model_obj.show();
    model_arg.show();
}

function showModelTex()
{
    //Todo
    /*let Obj = ObjectPool[current].ObjectInfo;
    if (Obj.objFile == null) {
        model_obj.find("#input-file-label")[0].innerText = "未选择文件";
    }
    else {
        model_obj.find("#input-file-label")[0].innerText = Obj.objFile;
    }*/
    model_tex.show();
    model_arg.show();
}

function showLight()
{
    let Obj = ObjectPool[current].ObjectInfo;
    let DColor = Obj.pointLightingDiffuseColor;
    let SColor = Obj.pointLightingSpecularColor;
    basic_light.find("#basic-enlight").prop("checked", Obj.usePointLighting);
    basic_light.find("#basic-DColor").colorpicker("setValue","#"+(DColor[0]*255).toString(16) + (DColor[1]*255).toString(16) + (DColor[2]*255).toString(16));
    basic_light.find("#basic-SColor").colorpicker("setValue","#"+(SColor[0]*255).toString(16) + (SColor[1]*255).toString(16) + (SColor[2]*255).toString(16));
    basic_light.show();
}

function showForm()
{
    let type = ObjectPool[current].type;
    $("#form-container").find(".form-title").text(type + " form");

    if (type === "cube" || type === "sphere" || type === "cylinder" || type === "cone")
    {
        hideAll();
        showScale(); showRot(); showLoc();
        showTC();
        base_form.fadeIn();
    }
    else if (type === "prism")
    {
        hideAll();
        showScale(); showRot(); showLoc();
        showSideNum();
        showTC();
        base_form.fadeIn();
    }
    else if (type === "trustum")
    {
        hideAll();
        showScale(); showRot(); showLoc();
        showSideNum(); showUpBotRatio();
        showTC();
        base_form.fadeIn();
    }
    else if (type === "model")
    {
        hideAll();
        showScale(); showRot(); showLoc();
        showModelObj(); showModelTex();
        base_form.fadeIn();
    }
    else if (type === "light")
    {
        hideAll();
        showLoc();
        showLight();
        base_form.fadeIn();
    }
}

function unshowBasicForm()
{
    base_form.fadeOut();
}

function changeScale()
{
    if (current == null) return ;
    let obj_scale = ObjectPool[current].ObjectInfo.transformation.scale;
    obj_scale[0] = basic_scale.find("#basic-scalex").spinner("value");
    obj_scale[1] = basic_scale.find("#basic-scaley").spinner("value");
    obj_scale[2] = basic_scale.find("#basic-scalez").spinner("value");
    //refreshItemInObjectPool(current);
}

function changeRot()
{
    if (current == null) return ;
    let obj_rot = ObjectPool[current].ObjectInfo.transformation.rotation;
    obj_rot.x = basic_rot.find("#basic-rotx").spinner("value") / 360 * 6.28;
    obj_rot.y = basic_rot.find("#basic-roty").spinner("value") / 360 * 6.28;
    obj_rot.z = basic_rot.find("#basic-rotz").spinner("value") / 360 * 6.28;
    //refreshItemInObjectPool(current);
}

function changeLoc()
{
    if (current == null) return ;
    let type = ObjectPool[current].type;
    if (type === "light")
    {
        let light_loc = ObjectPool[current].ObjectInfo.pointLightingLocation;
        light_loc[0] = basic_loc.find("#basic-x").spinner("value");
        light_loc[1] = basic_loc.find("#basic-y").spinner("value");
        light_loc[2] = basic_loc.find("#basic-z").spinner("value");
    }
    else {
        let obj_trans = ObjectPool[current].ObjectInfo.transformation.translation;
        obj_trans[0] = basic_loc.find("#basic-x").spinner("value");
        obj_trans[1] = basic_loc.find("#basic-y").spinner("value");
        obj_trans[2] = basic_loc.find("#basic-z").spinner("value");
    }
    //refreshItemInObjectPool(current);
}

function changeTC()
{
    if (current == null) return ;
    let obj_info = ObjectPool[current].ObjectInfo;

    obj_info.useTexture = !!basic_tc.find("#basic-entex").is(':checked');
    let s = basic_tc.find("#basic-color").colorpicker("getValue");
    let a = s.substring(1, 3);
    obj_info.diffuseColor[0] = parseInt(a, 16)/255;
    a = s.substring(3, 5);
    obj_info.diffuseColor[1] = parseInt(a, 16)/255;
    a = s.substring(5, 7);
    obj_info.diffuseColor[2] = parseInt(a, 16)/255;
    obj_info.diffuseColor[3] = 1;
    /*
    let s = basic_tc.find("#basic-color").colorpicker("getValue");
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
    */
    //Todo
    if (obj_info.useTexture)
    {
        basic_tc.find(".input-color").hide();
        basic_tc.find(".input-texture").fadeIn();
    }
    else
    {
        basic_tc.find(".input-texture").hide();
        basic_tc.find(".input-color").fadeIn();
    }
    //refreshItemInObjectPool(current);
}

function changeSideNum()
{
    if (current == null) return ;
    let obj_info = ObjectPool[current].ObjectInfo;
    obj_info.sideNum = basic_sideNum.find("#sideNum").spinner("value");
    refreshItemInObjectPool(current);
}

function changeUpBotRatio()
{
    if (current == null) return ;
    let obj_info = ObjectPool[current].ObjectInfo;
    obj_info.upBottomRatio = basic_upBotRatio.find("#upBottomRatio").spinner("value");
    refreshItemInObjectPool(current);
}

function changeModelObj()
{
    if (current == null) return ;
    let obj_info = ObjectPool[current].ObjectInfo;
    obj_info.objFile = loadObj(current, model_obj.find(".input-file-file")[0].files[0]);
    showModelObj();
    console.log(ObjectPool[current].ObjectInfo.indices.length);
    refreshItemInObjectPool(current);
}

function changeModelTex()
{
    if (current == null) return ;
    let obj_info = ObjectPool[current].ObjectInfo;
    //Todo
    obj_info.texture = model_arg.find("#model-texture").files[0];
    //refreshItemInObjectPool(current);
}

function changeEnLight()
{
    if (current == null) return;
    let obj_info = ObjectPool[current].ObjectInfo;

    obj_info.usePointLighting = !!basic_light.find("#basic-enlight").is(':checked');
    refreshItemInObjectPool(current);
}

function changeDLight()
{
    if (current == null) return;
    let obj_info = ObjectPool[current].ObjectInfo;

    let s = basic_light.find("#basic-DColor").colorpicker("getValue");
    let a = s.substring(1, 3);
    obj_info.pointLightingDiffuseColor[0] = parseInt(a, 16) / 255;
    a = s.substring(3, 5);
    obj_info.pointLightingDiffuseColor[1] = parseInt(a, 16) / 255;
    a = s.substring(5, 7);
    obj_info.pointLightingDiffuseColor[2] = parseInt(a, 16) / 255;
    refreshItemInObjectPool(current);
}

function changeSLight()
{
    if (current == null) return;
    let obj_info = ObjectPool[current].ObjectInfo;

    let s = basic_light.find("#basic-SColor").colorpicker("getValue");
    let a = s.substring(1, 3);
    obj_info.pointLightingSpecularColor[0] = parseInt(a, 16) / 255;
    a = s.substring(3, 5);
    obj_info.pointLightingSpecularColor[1] = parseInt(a, 16) / 255;
    a = s.substring(5, 7);
    obj_info.pointLightingSpecularColor[2] = parseInt(a, 16) / 255;
    refreshItemInObjectPool(current);
}

jQuery.fn.myform=function()
{
    $( ".spinner" ).spinner();
    $(".input-rot").find(".spinner").spinner({max:360, min:0, step:1});
    $(".input-scale").find(".spinner").spinner({min:0, step:0.1});
    $(".input-loc").find(".spinner").spinner({step:0.1});
    $(".input-sideNum").find(".spinner").spinner({max:10, min:3, step:1});
    $(".input-upBottomRatio").find(".spinner").spinner({max:1, min:0.1, step:0.1});
    basic_scale.find(".spinner").spinner({spin:changeScale, stop:changeScale});
    basic_rot.find(".spinner").spinner({spin:changeRot, stop:changeRot});
    basic_loc.find(".spinner").spinner({spin:changeLoc, stop:changeLoc});
    basic_tc.find("#basic-color").colorpicker({
        format: "hex",
        color: "#FFFFFF"
    }).on('changeColor',
        function(ev) {
            changeTC();
        });
    basic_sideNum.find(".spinner").spinner({spin:changeSideNum, stop:changeSideNum});
    basic_upBotRatio.find(".spinner").spinner({spin:changeUpBotRatio, stop:changeUpBotRatio});
    basic_light.find("#basic-DColor").colorpicker({
        format: "hex",
        color: "#FFFFFF"
    }).on('changeColor',
        function(ev) {
            changeDLight();
        });

    basic_light.find("#basic-SColor").colorpicker({
        format: "hex",
        color: "#FFFFFF"
    }).on('changeColor',
        function(ev) {
            changeSLight();
        });
}
