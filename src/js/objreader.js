/*
let ObjSelector = {
    number : 0,
    name : [],
    cnt : {}
};
*/

function objStrAna(str){
    let lines = str.split('\r\n');
    let resultStr = '';
    //console.log(lines);
    for (let id in lines){
        let item = lines[id];
        item = item.replace(/ +/g, ' ');
        if (item[0] == '#' | item.length <= 1) continue;
        let items = item.split(' ');
        //console.log(item, item.length, items[0]);
        if (item.length <= 1) continue;
        else{
            resultStr += item + '=';
        }
    }
    return resultStr;
}


/**
* 输入files变量，判断变量类型
* 并根据传入文件的文件名，将obj文件中的内容输入到 <div id="obj-info"> 标签中
* 存储方式为<info id="filename_obj">...</info>
* */
/*
function insertObjIntoHtml(file){
    //let file = files[0];
    if (file == null) return null;
    let reader = new FileReader();

    let strs = new Array();

    strs = (file.name).split(".");
    //console.log(strs[0]);
    if (strs[1] === "obj"){
        reader.onload = function () {
            if (document.getElementById(strs[0] + '_obj') !== null){
                return null;
            }
            ObjSelector.name.push(strs[0] + '_obj');
            ObjSelector.number ++;
            ObjSelector.cnt[name + "_obj"] = 0;
            let info = document.createElement("info");
            info.setAttribute("id", strs[0]+"_obj");
            let res = objStrAna(this.result);
            let textNode = document.createTextNode(res);
            info.appendChild(textNode);

            let body = document.getElementById("obj-info");
            body.appendChild(info);
        }
        reader.readAsText(file);
    }
    else
    {
        return null;
    }
    //console.log("import finish");
    return strs[0] + "_obj";
}
*/


/**
* 由<input>标签调用
* 读取文件内容
* */
/*
function objReader(){
    let files = document.getElementById("files").files;
    //alert(files);
    if (files.length){
        let name = insertObjIntoHtml(files);
    }
}
*/

/**
* 传入需要删除的obj名称
* 删除 <div id="obj-info"> 标签下的 id 为 name_id 的<info>标签
* */
/*
function deleteObjFromHtml(objname){
    if (objname == null) return;

    if (ObjSelector.name.indexOf(objname) == -1) return;
    if (ObjSelector.cnt[objname] > 1){
        ObjSelector.cnt[objname] --;
    }
    else{
        let name = objname;
        let info = document.getElementById("obj-info");
        let tag = document.getElementById(name);
        if (tag !== null){
            info.removeChild(tag);
            let index = ObjSelector.name.indexOf(name);
            ObjSelector.name.splice(index, 1);
            ObjSelector.number --;
            delete ObjSelector.cnt[objname];
        }
    }

}
*/

/**
* 调试用的展示按钮
* */
/*
function objShow(){
    let s = document.getElementsByTagName("info");
    console.log(s);
}
*/

/**
* 调试删除用的展示按钮
* */
/*
function testDelete(){
    let name = "a";
    deleteObjFromHtml(name);
}
*/


function getObjInfo(objName) {
    if (objName == null) return null;

    let content = document.getElementById(objName).innerHTML;

    if (content == null) return null;

    ObjSelector.cnt[objName] ++;

    let lines = content.split('=');

    let objInfo = {
        verPosition : [],
        texPosition : [],
        norPosition : [],
        indicesForVer : [],
        indicesForTex : [],
        indicesForNor : []
    };
    for (let id in lines){
        let line = lines[id];
        let items = line.split(' ');
        switch (items[0]){
            case 'v' :
                objInfo.verPosition.push(parseFloat(items[1]));
                objInfo.verPosition.push(parseFloat(items[2]));
                objInfo.verPosition.push(parseFloat(items[3]));
                break;

            case 'vt' :
                objInfo.texPosition.push(parseFloat(items[1]));
                objInfo.texPosition.push(parseFloat(items[2]));
                objInfo.texPosition.push(parseFloat(items[3]));
                break;

            case 'vn' :
                objInfo.norPosition.push(parseFloat(items[1]));
                objInfo.norPosition.push(parseFloat(items[2]));
                objInfo.norPosition.push(parseFloat(items[3]));
                break;

            case 'f' :
                for (let i=1; i<=3; i++) {
                    let iitems = items[i].split('\/');
                    objInfo.indicesForVer.push(parseInt(iitems[0]) - 1);
                    if (iitems[1].length > 0)
                        objInfo.indicesForTex.push(parseInt(iitems[1]) - 1);
                    if (iitems[2].length > 0)
                        objInfo.indicesForNor.push(parseInt(iitems[2]) - 1);
                }

                break;

            default :
                let list = [];
                for (let i=1; i<items.length; i++){
                    list.push(items[i]);
                }
                if (items[0] === '') break;
                objInfo[items[0]] = list;
                break;

        }

    }

    let maxVer = [-1000000.0, -1000000.0, -1000000.0];
    let minVer = [1000000.0, 1000000.0, 1000000.0];
    for (let id in objInfo.verPosition){
        let item = objInfo.verPosition[id];
        if (maxVer[id%3] < item) maxVer[id%3] = item;
        if (minVer[id%3] > item) minVer[id%3] = item;
    }
    let delta = 0;
    for (let i=0; i<3; i++){
        if (maxVer[i] - minVer[i] > delta){
            delta = maxVer[i] - minVer[i];
        }
    }

    for (let id in objInfo.verPosition){
        let item = objInfo.verPosition[id];
        objInfo.verPosition[id] = item / delta;
    }

    //console.log(objInfo);
    return {
        positions: objInfo.verPosition,
        indices: objInfo.indicesForVer,
        textureCoordinates: objInfo.texPosition,
        textureIndices: objInfo.indicesForTex,
        vertexNormals: objInfo.norPosition,
        normalIndices: objInfo.indicesForNor,
    };
}

/*
* load positions, indices, textureCoordnates, textureIndices,
* vertexNormals, normalIndices from objfile file to ObjectPool[id].ObjectInfo
* @pram file the objfile
* @pram id load info into ObjectPool[id]
 */
function loadObj(id, file)
{
    let obj_info = ObjectPool[id].ObjectInfo;
    if (obj_info == null) return null;

    if (file == null)
    {
        obj_info.positions = [];
        obj_info.indices = [];
        obj_info.textureCoordinates = [];
        obj_info.textureIndices = [];
        obj_info.vertexNormals = [];
        obj_info.normalIndices = [];
        return null;
    }

    let strs = (file.name).split(".");
    if (strs[1] !== "obj") return null;

    let reader = new FileReader();

    reader.onload = function () {
        let res = objStrAna(this.result);
        let lines = res.split('=');
        let objInfo = {
            verPosition : [],
            texPosition : [],
            norPosition : [],
            indicesForVer : [],
            indicesForTex : [],
            indicesForNor : []
        };

        for (let i in lines){
            let line = lines[i];
            let items = line.split(' ');
            switch (items[0]){
                case 'v' :
                    objInfo.verPosition.push(parseFloat(items[1]));
                    objInfo.verPosition.push(parseFloat(items[2]));
                    objInfo.verPosition.push(parseFloat(items[3]));
                    break;

                case 'vt' :
                    objInfo.texPosition.push(parseFloat(items[1]));
                    objInfo.texPosition.push(parseFloat(items[2]));
                    objInfo.texPosition.push(parseFloat(items[3]));
                    break;

                case 'vn' :
                    objInfo.norPosition.push(parseFloat(items[1]));
                    objInfo.norPosition.push(parseFloat(items[2]));
                    objInfo.norPosition.push(parseFloat(items[3]));
                    break;

                case 'f' :
                    for (let j=1; j<=3; j++) {
                        let iitems = items[j].split('\/');
                        objInfo.indicesForVer.push(parseInt(iitems[0]) - 1);
                        if (iitems[1].length > 0)
                            objInfo.indicesForTex.push(parseInt(iitems[1]) - 1);
                        if (iitems[2].length > 0)
                            objInfo.indicesForNor.push(parseInt(iitems[2]) - 1);
                    }

                    break;

                default :
                    let list = [];
                    for (let j=1; j<items.length; j++){
                        list.push(items[j]);
                    }
                    if (items[0] === '') break;
                    objInfo[items[0]] = list;
                    break;
            }
        }

        let maxVer = [-1000000.0, -1000000.0, -1000000.0];
        let minVer = [1000000.0, 1000000.0, 1000000.0];
        for (let i in objInfo.verPosition){
            let item = objInfo.verPosition[i];
            if (maxVer[i%3] < item) maxVer[i%3] = item;
            if (minVer[i%3] > item) minVer[i%3] = item;
        }
        let delta = 0;
        for (let i=0; i<3; i++){
            if (maxVer[i] - minVer[i] > delta){
                delta = maxVer[i] - minVer[i];
            }
        }

        for (let i in objInfo.verPosition){
            let item = objInfo.verPosition[i];
            objInfo.verPosition[i] = item / delta;
        }

        obj_info.positions = objInfo.verPosition;
        obj_info.indices = objInfo.indicesForVer;
        obj_info.textureCoordinates = objInfo.texPosition;
        obj_info.textureIndices = objInfo.indicesForTex;
        obj_info.vertexNormals = objInfo.norPosition;
        obj_info.normalIndices = objInfo.indicesForNor;
    };

    reader.readAsText(file);
    return file.name;
}


function objDisplay(gl, programInfo,matrixInfo, object, ambientLight, lightSources, buffers) {
    drawPolygon(gl, programInfo,matrixInfo, object, ambientLight, lightSources, buffers);
}