/*let imgSelector = {
    count:{}
};*/

/**
* 根据objReader修改
* 输入files变量，判断变量类型
* 并根据传入文件的文件名，将image文件中的内容输入到 <div id="img-info"> 标签中
* 存储方式为<info id="filename_">...</info>
* */
/*
function insertImgIntoHtml(id, file){

    let obj_info = ObjectPool[id].ObjectInfo;
    if (obj_info == null) return null;

    if (file == null)
    {
        return null;
    }

    let reader = new FileReader();
    let strs = (file.name).split(".");

    if (strs[1] !== "jpg" && strs[1] !== "png")
    {
        return null;
    }

    let name = strs[0] + '_img';
    if (imgSelector.count[name] != null){
        imgSelector.count[name]++;
        return file.name;
    }

    reader.onload = function (evt) {
        let name = strs[0] + '_img';
        imgSelector.count[name] = 1;

        let childNode = document.createElement('img');
        childNode.src = evt.target.result;
        childNode.setAttribute("id", name);

        let body = document.getElementById("img-lib");
        body.appendChild(childNode);

        const canvas = document.querySelector("#glcanvas");
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        obj_info.texture = loadTexture(gl, name);
    }
    reader.readAsDataURL(file);

    return file.name;
}
*/
/**
* 由<input>标签调用
* 读取文件内容
* */
/*
function imgReader(){
    let files = document.getElementById("files").files;
    alert(files);
    if (files.length){
        let name = insertImgIntoHtml(files);
    }
}
*/
/**
* 传入需要删除的texture名称
* 删除 <div id="img-lib"> 标签下的 id 为 name_id 的<info>标签
* */
/*
function deleteImgFromHtml(filename){
    if (filename == null) return;
    let name = filename.split(".")[0] + "_img";

    if (imgSelector.count[name] == null) return ;

    if (imgSelector.count[name] != 1)
    {
        imgSelector.count[name]--;
        return ;
    }

    let info = $("#img-lib");
    let tag = info.find("#" + name);
    if (tag.length != 0){
        info[0].removeChild(tag[0]);
    }

    delete imgSelector.count[name];
}
*/
// load the texture from given url 
// note that you should enable read local file in your browser 
// return texture
/*
function loadTexture(gl, imgId) {

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    let image = document.getElementById(imgId);
    let src = image.src;

    image.src = src;
    // console.log(image.src);
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        // if size of image is not power of 2, should do something
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };

    return texture;
}
*/

/**
 * 从file加载纹理文件，更新id为obj_name的Object
 * @param obj_name 需要更新的Object的id
 * @param file 纹理所在的文件，以file类型传入
 * @returns filename 返回纹理文件的名字，不包含路径，加载失败返回null
 */
function loadTexture(obj_name, file)
{
    let obj_info = ObjectPool[obj_name].ObjectInfo;
    if (obj_info == null) return null;

    if (file == null)
    {
        return null;
    }

    let reader = new FileReader();
    let strs = (file.name).split(".");

    if (strs[1] !== "jpg" && strs[1] !== "png")
    {
        return null;
    }

    reader.onload = function (evt) {
        const canvas = document.querySelector("#glcanvas");
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        let image = new Image();

        image.src = evt.target.result;
        // console.log(image.src);
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                srcFormat, srcType, image);

            // if size of image is not power of 2, should do something
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // wrapping to clamp to edge
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };

        obj_info.texture = texture;
    }
    reader.readAsDataURL(file);

    return file.name;
}