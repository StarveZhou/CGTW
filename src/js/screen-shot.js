function downloadImage(event){
    let canvas = document.querySelector("#glcanvas");

    let type = 'png';
    let img_png_src = canvas.toDataURL("image/png");
    let img = document.getElementById("imgss");


    let imgData = img_png_src.replace(_fixType(type),'image/octet-stream');

    //img.setAttribute("src", imgData)

    let filename = '截图' + (new Date()).getTime() + '.' + type;

    saveFile(imgData,filename);
}

let saveFile = function(data, filename){
    let save_link = document.createElement('a');
    save_link.href = data;
    save_link.download = filename;


    //let event = document.createEvent('MouseEvents');
    //event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};

let _fixType = function(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    let r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
};