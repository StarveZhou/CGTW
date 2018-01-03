var cubic_num = 0;




function addItem(Obj)
{
    var res = $("#itemList>ul #" + Obj.id);
    if (res.length)
    {
        //an item with same id
        return false;
    }
    else
    {
        $("#itemList>ul").append("<li id=\""+Obj.id+"\"><a href=\"#\">"+Obj.id+"</a>\
                                    <span class=\"fa fa-times\"></span></li>");
        res = $("#itemList>ul #" + Obj.id);
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
    }
    return true;
}

function addModel(Obj)
{
    var res = $("#modelList>ul #" + Obj.id);
    if (res.length)
    {
        //a model with same id
        return false;
    }
    else
    {
        $("#modelList>ul").append("<li id=\""+Obj.id+"\"><a href=\"#\">"+Obj.id+"</a>\
                                    <span class=\"fa fa-times\"></span></li>");
        res = $("#modelList>ul #" + Obj.id);
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
    var res = $("#lightList>ul #" + Obj.id);
    if (res.length)
    {
        //a light with same id
        return false;
    }
    else
    {
        $("#lightList>ul").append("<li id=\""+Obj.id+"\"><a href=\"#\">"+Obj.id+"</a>\
                                    <span class=\"fa fa-times\"></span></li>");
        res = $("#lightList>ul #" + Obj.id);
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

function selectItem(Obj)
{
    current=Obj;
    if (Obj.type=="cubic")
    {
        $("#cubic-form").fadeIn();
        $("#cubic-sizex").spinner("value", Obj.x_size);
        $("#cubic-sizey").spinner("value", Obj.y_size);
        $("#cubic-sizez").spinner("value", Obj.z_size);
        $("#cubic-rotx").spinner("value", Obj.x_rot);
        $("#cubic-roty").spinner("value", Obj.y_rot);
        $("#cubic-rotz").spinner("value", Obj.z_rot);
        $("#cubic-x").spinner("value", Obj.x);
        $("#cubic-y").spinner("value", Obj.y);
        $("#cubic-z").spinner("value", Obj.z);
    }
}

function removeItem(Obj)
{
    var res = $("#itemList>ul #" + Obj.id);
    if (Obj.type == "cubic")
    {
        if (Obj == current)
        {
            $("#cubic-form").fadeOut();
        }
        cubic_num--;
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
    var res = $("#modelList>ul #" + Obj.id);
    res.onclick=null;
    res.remove();
}

function selectLight(Obj)
{
    console.log("Light"+Obj.id);
}

function removeLight(Obj)
{
    var res = $("#lightList>ul #" + Obj.id);
    res.onclick=null;
    res.remove();
}


//right bar
function createCubic()
{
    cubic_num++;
    addItem({id:"cubic"+cubic_num, type:"cubic",
             x_size:1, y_size:1, z_size:1,
             x_rot:0, y_rot:0, z_rot:0,
             x:0, y:0, z:0});
}