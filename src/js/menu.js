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
    console.log("Item"+Obj.id);
}

function removeItem(Obj)
{
    var res = $("#itemList>ul #" + Obj.id);
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