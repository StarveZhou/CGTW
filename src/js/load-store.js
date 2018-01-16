function ObjectToString(object, layer){
    let str = "";
    let firstOne = true;
    for (let item in object){
        if (firstOne == false){
            str += "$"+layer+"$";
        }
        else{
            firstOne = false;
        }

        str += item + ":"+layer+":";
        if (typeof object[item] === "object" && Array.isArray(object[item]) === false){
            str += "{" + ObjectToString(object[item], layer+1) + "}";
        }
        else{
            str += object[item];
        }
    }

    return str;
}


function storeScene() {
    //ObjectPool ### world-box-name ###
    //ObjectPool  {}
    let str = "";
    str += "{" + ObjectToString(ObjectPool, 0) + "}";
    str += "####";
    str += worldName;

    return str;
}


function StringToObject(str, layer) {
    //console.log(str, layer);


    if (str.length === 2) return {};

    str = str.substring(1, str.length-1);
    //console.log(str);
    let strList = str.split('$'+layer+'$');
    let object = {};
    for (let i=0; i<strList.length; i++){
        let itemList = strList[i].split(":"+layer+":");
        //console.log(str, i, itemList[0], itemList[1]);
        if (itemList[1] === "null"){
            object[itemList[0]] = null;
        }
        else if (itemList[1][0] === '{'){
            object[itemList[0]] = StringToObject(itemList[1], layer+1);
        }
        else{
            if (itemList[0] === "useBillboard" ||
                itemList[0] === "useTexture"   ||
                itemList[0] === "useDepthTexture"
                ){
                object[itemList[0]] = Boolean(itemList[1]);
            }
            else if (itemList[0] === "shiness" ||
                     itemList[0] === "x"       ||
                     itemList[0] === "y"       ||
                     itemList[0] === "z"){
                object[itemList[0]] = parseInt(itemList[1]);
            }
            else if (itemList[0] === "particleworldSize"){
                object[itemList[0]] = parseFloat(itemList[1]);
            }
            else{
                if (itemList[1].indexOf(",") != -1){
                    object[itemList[0]] = itemList[1].split(",");
                    for (let id=0; id<object[itemList[0]].length; id++){
                        object[itemList[0]][id] = Number(object[itemList[0]][id]);
                    }
                }
                else{
                    object[itemList[0]] = itemList[1];
                }

            }

            if (itemList[0] === "useTexture" || itemList[0] === "useDepthTexture"){
                object[itemList[0]] = false;
            }
            //object[itemList[0]] = itemList[1];
        }
    }
    return object;
}

function loadScene(str) {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    let strList = str.split('####');

    worldName = strList[1];
    let LoadObjectPool = StringToObject(strList[0], 0);


    console.log(LoadObjectPool);
    LoadObjectPool.onload = function () {
        let LoadBufferPool = {};
        for (let item in LoadObjectPool){
            LoadBufferPool[item] = initBuffers(gl, LoadObjectPool[item]);
        }
        BufferPool = LoadBufferPool;
    }
    ObjectPool = LoadObjectPool;

}
