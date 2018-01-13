

//
// let g_eye = vec3.fromValues(0.0, 0.0, 5.0);
// let g_at = vec3.fromValues(0.0, 0.0, 0.0);
// let g_up = vec3.fromValues(0.0, 1.0, 0.0);
// let g_bPersp= true;
// let g_fov=30.0;
// let g_near=1.0;
// let g_far=100.0;
// let g_width=10.0;
// let g_height=10.0;



/**
 *  function of updateMatrix
 * @param gl
 * @param canvas
 * @param programInfo
 * @param matrixInfo
 */
function updateMatrix(gl,canvas,programInfo,matrixInfo) {
    // update projection matrix
    if(matrixInfo.bPersp) {
        mat4.perspective(matrixInfo.projectionMatrix,matrixInfo.fov*Math.PI/180,canvas.clientWidth/canvas.clientHeight,matrixInfo.near,matrixInfo.far);
    }
    else{
        mat4.ortho(matrixInfo.projectionMatrix, -matrixInfo.width,matrixInfo.width,-matrixInfo.height,matrixInfo.height,matrixInfo.near,matrixInfo.far);
    }
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix,false,matrixInfo.projectionMatrix);

    // update view matrix
    mat4.lookAt(matrixInfo.viewMatrix, matrixInfo.eye, matrixInfo.at, matrixInfo.up);

    let allModelMatrix=mat4.create();
    mat4.rotateX(allModelMatrix,allModelMatrix,-(Math.PI/180)*matrixInfo.currentAngle[0]);
    mat4.rotateY(allModelMatrix,allModelMatrix,-(Math.PI/180)*matrixInfo.currentAngle[1]);
    mat4.multiply(matrixInfo.viewMatrix,matrixInfo.viewMatrix,allModelMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false,matrixInfo.viewMatrix);

    // update model matrix
    // mat4.rotateX(matrixInfo.modelViewMatrix,mat4.create(),-(Math.PI/180)*matrixInfo.currentAngle[0]);
    // mat4.rotateY(matrixInfo.modelViewMatrix,matrixInfo.modelViewMatrix,-(Math.PI/180)*matrixInfo.currentAngle[1]);
    // gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix);
}






// followings are small handler

/**
 *
 * @param ev
 * @param matrixInfo
 */
function keydown(ev,matrixInfo) {
    switch (String.fromCharCode(ev.keyCode)) {
        case 'P':{
            matrixInfo.bPersp=!matrixInfo.bPersp;
            break;
        }
        case 'W': {
            matrixInfo.eye[1] += 0.05;
            matrixInfo.at[1]+=0.05;
            break;
        }
        case 'S': {
            matrixInfo.eye[1] -= 0.05;
            matrixInfo.at[1]-=0.05;
            break;
        }
        case 'A': {
            matrixInfo.eye[0] -= 0.05;
            matrixInfo.at[0]-=0.05;
            break;
        }
        case 'D': {
            matrixInfo.eye[0] += 0.05;
            matrixInfo.at[0]+=0.05;
            break;
        }
        case "F":{
            matrixInfo.eye=vec3.fromValues(0.0, 0.0, 5.0);
            matrixInfo.at=vec3.fromValues(0.0, 0.0, 0.0);
            matrixInfo.up=vec3.fromValues(0.0, 1.0, 0.0);
            break;
        }
        default:
            return;
    }
}




// followings are event handler(including different objects' event, e.g document or canvas
function initDocumentHandlers(document,matrixInfo) {
    document.onkeydown = function (ev) {
        keydown(ev, matrixInfo);
    };
}





/**
 * Actually a canvas relevant handler(all callbacks register on canvas's event can be added to this function)
 * @param canvas
 * @param matrixInfo
 */
function initCanvasHandlers(canvas,matrixInfo){
    canvas.onmousewheel=function (ev) {
        if(ev.shiftKey){
            matrixInfo.eye[2]-=ev.wheelDelta/500;
        }
    };
    let dragging = false;
    let lastX=-1,lastY=-1;
    //push the button
    canvas.onmousedown=function (ev) {
        let x= ev.clientX, y= ev.clientY;
        let rect=ev.target.getBoundingClientRect();
        if(rect.left<=x&&x<rect.right&&rect.top<=y&&y<rect.bottom){
            lastX=x;
            lastY=y;
            dragging=true;
        }
    };
    //release the mouse
    canvas.onmouseup=function (ev) {dragging=false};
    canvas.onmousemove=function(ev){
        let x=ev.clientX,y=ev.clientY;
        if(dragging){
            let yFactor=100/canvas.height;
            let xFactor=100/canvas.width;
            let dx=xFactor*(x-lastX);
            let dy=yFactor*(y-lastY);
            matrixInfo.currentAngle[0]=Math.max(Math.min(matrixInfo.currentAngle[0]+dy,90.0),-90.0);
            matrixInfo.currentAngle[1]=matrixInfo.currentAngle[1]+dx;
        }
        lastX=x;
        lastY=y;
    };
}