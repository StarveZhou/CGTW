var cube_num = 0;

function addItem(id)
{
    if (ObjectPool[id].type === "cube")
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
    if (ObjectPool[id].type === "cube")
    {
        current = id;
        showCubeForm();
    }
}

function removeItem(id)
{
    let res = $("#itemList #" + id);
    if (ObjectPool[id].type === "cube")
    {
        if (id === current)
        {
            $("#cube-form").fadeOut();
        }
        delete ObjectPool[id];
        cube_num--;
    }
    
    res.onclick=null;
    res.remove();
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
    if (type === "cube")
    {
        cube_num++;
        let Obj = {
            positions: null,
            indices: null,
            transformation: {
                translation: [0.0, 0.0, 0.0],
                scale: [1.0, 1.0, 1.0],
                rotation: {x:0.0, y: 0.0, z: 0.0}
            },
            textureCoordinates: null,
            textureIndices: null,
            vertexNormals: null,
            normalIndices: null,
            ambientColor: [0.1, 0.1, 0.1, 1.0],
            diffuseColor: [1.0, 1.0, 1.0, 1.0],
            specularColor: [0.3, 0.3, 0.3, 1.0],
            useTexture: false,
            texture: null,
            shiness: 10,
            sideNum: null,
            upBottomRatio: null
        };
        Obj = {type:"cube", ObjectInfo:Obj};
        ObjectPool["cube"+cube_num] = Obj;
        addItem("cube"+cube_num);
    }
}