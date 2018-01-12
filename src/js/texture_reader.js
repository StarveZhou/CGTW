let imgSelector = {
    number : 0,
    name : []
};

/**
* 根据objReader修改
* 输入files变量，判断变量类型
* 并根据传入文件的文件名，将image文件中的内容输入到 <div id="img-info"> 标签中
* 存储方式为<info id="filename_">...</info>
* */
function insertImgIntoHtml(files){
    let file = files[0];

    let reader = new FileReader();

    let strs = new Array();

    let name;
    strs = (file.name).split(".");
    console.log(strs[0]);
    if (strs[1] === "jpg"||strs[1] === "png"){
        reader.onload = function (evt) {
            if (document.getElementById(strs[0] + '_img') != undefined){
                return;
            }
            imgSelector.name.push(strs[0] + '_img');
            let info = document.createElement("info");
            name = strs[0] + '_img';
            // info.setAttribute("id", strs[0]+"_img");
           
            let childNode = document.createElement('img');
            childNode.src = evt.target.result;
            childNode.setAttribute("id", strs[0]+"_img");
            info.appendChild(childNode);

            console.log(strs[0]+"_img");

            let body = document.getElementById("img_lib");
            body.appendChild(info);
        }
        reader.readAsDataURL(file);
    }
    else
    {
        console.log("not supported texture file");
    }
    return name;
}



/**
* 由<input>标签调用
* 读取文件内容
* */
function imgReader(){
    let files = document.getElementById("files").files;
    alert(files);
    if (files.length){
        let name = insertImgIntoHtml(files);
    }
}
/**
* 传入需要删除的texture名称
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