let item_num = 0;

function addItem(id)
{
    let type = ObjectPool[id].type;
    if (type === "cube" || type === "sphere" || type == "cylinder" || type === "cone" || type === "prism" || type === "trustum")
    {
        $("#itemList").append("<li id=\"" + id + "\"><a href=\"#form-container\" onclick=\"selectItem('" + id + "')\">" + id + "</a>" +
            "<span class=\"fa fa-times\" onclick=\"removeItem('" + id + "')\"></span></li>");
    }
    /*
    res = $("#itemList>ul #" + id);
    res.find("a")[0].onclick=function(a){
        return function(){
            selectItem(a);
        }
    }(Obj);//通过一个匿名函数（这个匿名函数接受一个参数，接受的参数是Obj，返回一个函数）构造出一个函数

    res.find("span")[0].onclick=function(a){
        return function(){
            removeItem(a);
        }
    }(Obj);
    */
}

function addModel(Obj)
{
    let res = $("#modelList").find(">ul #" + Obj.id);
    if (res.length)
    {
        //a model with same id
        return false;
    }
    else
    {
        $("#modelList").find(">ul").append("<li id=\""+Obj.id+"\"><a href=\"#\">"+Obj.id+"</a>\
                                    <span class=\"fa fa-times\"></span></li>");
        res = $("#modelList").find(">ul #" + Obj.id);
        res.find("a")[0].onclick=function(a){
            return function(){
                selectModel(a);
            }
        }(Obj);//通过一个匿名函数（这个匿名函数接受一个参数，接受的参数是Obj，返回一个函数）构造出一个函数

        res.find("span")[0].onclick=function(a){
            return function(){
                removeModel(a);
            }
        }(Obj);
    }
    return true;
}

function addLight(Obj)
{
    let res = $("#lightList").find(">ul #" + Obj.id);
    if (res.length)
    {
        //a light with same id
        return false;
    }
    else
    {
        $("#lightList").find(">ul").append("<li id=\""+Obj.id+"\"><a href=\"#\">"+Obj.id+"</a>\
                                    <span class=\"fa fa-times\"></span></li>");
        res = $("#lightList").find(">ul #" + Obj.id);
        res.find("a")[0].onclick=function(a){
            return function(){
                selectLight(a);
            }
        }(Obj);//通过一个匿名函数（这个匿名函数接受一个参数，接受的参数是Obj，返回一个函数）构造出一个函数

        res.find("span")[0].onclick=function(a){
            return function(){
                removeLight(a);
            }
        }(Obj);
    }
    return true;
}

function selectItem(id)
{
    let type = ObjectPool[id].type;
    if (type === "cube" || type === "sphere" || type == "cylinder" || type === "cone" || type === "prism" ||type === "trustum") {
        current = id;
        showForm();
    }
}

function removeItem(id)
{
    let res = $("#itemList").find("#" + id);
    let type = ObjectPool[id].type;
    if (type === "cube" || type === "sphere" || type === "cylinder" || type == "cone" || type === "prism" ||type === "trustum")
    {
        if (id === current)
        {
            unshowBasicForm();
            current = null;
        }
        delete ObjectPool[id];
        res.remove();
    }
    //res.onclick=null;
}

function selectModel(Obj)
{
    console.log("Model"+Obj.id);
}

function removeModel(Obj)
{
    let res = $("#modelList").find(">ul #" + Obj.id);
    res.onclick=null;
    res.remove();
}

function selectLight(Obj)
{
    console.log("Light"+Obj.id);
}

function removeLight(Obj)
{
    let res = $("#lightList").find(">ul #" + Obj.id);
    res.onclick=null;
    res.remove();
}


//right bar
function create(type)
{
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    tempTexture = loadTexture(gl, '1_img');

    let Obj = {
        positions: null,
        indices: null,
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates:[0, 1,
            0, 0,
            1, 0,
            1, 1,],
        textureIndices: null,
        vertexNormals: null,
        normalIndices: null,
        ambientColor: [0.1, 0.1, 0.1, 1.0],
        diffuseColor: [1.0, 1.0, 1.0, 1.0],
        specularColor: [0.3, 0.3, 0.3, 1.0],
        useTexture: true,
        texture: tempTexture,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null
    };
    if (type === "cube" || type === "sphere" || type === "cylinder" || type === "cone" ||type === "prism" || type === "trustum")
    {
        item_num++;
        if (type === "prism")
        {
            Obj.sideNum = 3;
        }
        else if (type === "trustum")
        {
            Obj.sideNum = 3;
            Obj.upBottomRatio = 0.5;
        }
        Obj = {type:type, ObjectInfo:Obj};
        ObjectPool[type+item_num] = Obj;
        addItem(type+item_num);
    }
}