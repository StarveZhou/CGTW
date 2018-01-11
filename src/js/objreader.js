let ObjSelector = {
    number : 0,
    name : []
};

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
function insertObjIntoHtml(files){
    let file = files[0];

    let reader = new FileReader();

    let strs = new Array();

    let name;
    strs = (file.name).split(".");
    //console.log(strs[0]);
    if (strs[1] === "obj"){
        reader.onload = function () {
            if (document.getElementById(strs[0] + '_obj') != undefined){
                return;
            }
            ObjSelector.name.push(strs[0] + '_obj');
            let info = document.createElement("info");
            name = strs[0] + '_obj';
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
        console.log("this is not an obj file");
    }
    console.log("import finish");
    return name;
}



/**
* 由<input>标签调用
* 读取文件内容
* */
function objReader(){
    let files = document.getElementById("files").files;
    alert(files);
    if (files.length){
        let name = insertObjIntoHtml(files);
    }
}
/**
* 传入需要删除的obj名称
* 删除 <div id="obj-info"> 标签下的 id 为 name_id 的<info>标签
* */

function deleteObjFromHtml(objname){
    let name = objname;
    let info = document.getElementById("obj-info");
    let tag = document.getElementById(name);
    if (typeof tag !== "undefined"){
        info.removeChild(tag);
        let index = ObjSelector.name.indexOf(name);
        ObjSelector.name.splice(index, 1);
        ObjSelector.number --;
    }
}


/**
* 调试用的展示按钮
* */
function objShow(){
    let s = document.getElementsByTagName("info");
    console.log(s);
}

/**
* 调试删除用的展示按钮
* */
function testDelete(){
    let name = "a";
    deleteObjFromHtml(name);
}

/**
 *
 * @param objName
 * @returns {{positions: Array, indices: Array, textureCoordinates: Array, textureIndices: Array, vertexNormals: Array, normalIndices: Array}}
 */
function getObjInfo(objName) {
    let content = document.getElementById(objName).innerHTML;
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

        transformation: {
            translation: [0.0, 0.0, -1.0],
            scale: [3.0, 3.0, 3.0],
            rotation: {x:0.0, y: 1.0, z: 0.0}
        },

        ambientColor: [0.1, 0.1, 0.1, 1.0],
        diffuseColor: [1.0, 1.0, 1.0, 1.0],
        specularColor: [0.3, 0.3, 0.3, 1.0],
        useTexture: false,
        texture: null,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null
    };
}


function objDisplay(gl, programInfo,matrixInfo, object, ambientLight, lightSources) {
    drawPolygon(gl, programInfo,matrixInfo, object, ambientLight, lightSources);
}