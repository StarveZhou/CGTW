

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
    let temp = vec3.create();
    // update projection matrix
    if(matrixInfo.bPersp) {
        mat4.perspective(matrixInfo.projectionMatrix,matrixInfo.fov*Math.PI/180,canvas.clientWidth/canvas.clientHeight,matrixInfo.near,matrixInfo.far);
    }
    else{
        mat4.ortho(matrixInfo.projectionMatrix, -matrixInfo.width,matrixInfo.width,-matrixInfo.height,matrixInfo.height,matrixInfo.near,matrixInfo.far);
    }
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix,false,matrixInfo.projectionMatrix);

    // update view matrix
    //let Y = vec3.fromValues(0, 1, 0);
    mat4.lookAt(matrixInfo.viewMatrix, matrixInfo.eye, matrixInfo.at, matrixInfo.up);

    //let allModelMatrix=mat4.create();
    //mat4.rotateX(allModelMatrix,allModelMatrix,-(Math.PI/180)*matrixInfo.currentAngle[0]);
    //mat4.rotateY(allModelMatrix,allModelMatrix,-(Math.PI/180)*matrixInfo.currentAngle[1]);
    //mat4.multiply(matrixInfo.viewMatrix,matrixInfo.viewMatrix,allModelMatrix);
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
    let from = vec3.create();
    let right = vec3.create();
    vec3.sub(from, matrixInfo.eye, matrixInfo.at);
    vec3.cross(right, matrixInfo.up, from);
    vec3.normalize(right, right);
    vec3.scale(right, right, 0.05);
    switch (String.fromCharCode(ev.keyCode)) {
        case 'P':{
            matrixInfo.bPersp=!matrixInfo.bPersp;
            break;
        }
        case 'W': {
            matrixInfo.eye[1] += 0.05;
            matrixInfo.at[1] += 0.05;
            break;
        }
        case 'S': {
            matrixInfo.eye[1] -= 0.05;
            matrixInfo.at[1] -= 0.05;
            break;
        }
        case 'A': {
            vec3.sub(matrixInfo.eye, matrixInfo.eye, right);
            vec3.sub(matrixInfo.at, matrixInfo.at, right);
            break;
        }
        case 'D': {
            vec3.add(matrixInfo.eye, matrixInfo.eye, right);
            vec3.add(matrixInfo.at, matrixInfo.at, right);
            //matrixInfo.eye[0] += 0.05;
            //matrixInfo.at[0] += 0.05;
            break;
        }
        case "F":{
            matrixInfo.eye=vec3.fromValues(0.0, 0.0, 5.0);
            matrixInfo.at=vec3.fromValues(0.0, 0.0, 0.0);
            matrixInfo.up=vec3.fromValues(0.0, 1.0, 0.0);
            matrixInfo.right = vec3.fromValues(1.0, 0.0, 0.0);
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
            let ratio = ev.wheelDelta/500;
            let temp = vec3.create();
            vec3.sub(temp, matrixInfo.at, matrixInfo.eye);
            vec3.normalize(temp, temp);
            vec3.scale(temp, temp, ratio);
            vec3.add(matrixInfo.eye, matrixInfo.eye, temp);
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
            let yFactor=20.0/canvas.height;
            let xFactor=20.0/canvas.width;
            let dx=xFactor*(x-lastX);
            let dy=yFactor*(y-lastY);
            let right = vec3.create();
            let from = vec3.create();
            let r;
            let angle;
            let up = vec3.create();
            let temp = vec3.create();
            let move = vec3.create();
            let delta = vec3.create();
            vec3.sub(from, matrixInfo.eye, matrixInfo.at);
            r = vec3.distance(matrixInfo.eye, matrixInfo.at);
            vec3.normalize(from, from);
            vec3.cross(right, matrixInfo.up, from);
            vec3.normalize(up, matrixInfo.up);
            vec3.normalize(right, right);
            right[1] = 0;

            vec3.scale(move, up,dy);
            angle = vec3.length(move) / r;
            vec3.scale(delta, from, Math.cos(angle));
            vec3.scale(temp, move, Math.sin(angle));
            vec3.add(delta, delta, temp);
            vec3.normalize(delta, delta);
            vec3.scale(delta, delta, r);
            vec3.add(matrixInfo.eye, matrixInfo.at, delta);

            vec3.cross(matrixInfo.up, delta, right);
            vec3.normalize(matrixInfo.up, matrixInfo.up);

            vec3.sub(from, matrixInfo.eye, matrixInfo.at);
            vec3.normalize(from, from);
            vec3.scale(move, right, dx);
            angle = -vec3.length(move) / r;
            vec3.scale(delta, from, Math.cos(angle));
            vec3.scale(temp, move, Math.sin(angle));
            vec3.add(delta, delta, temp);
            vec3.normalize(delta, delta);

            vec3.scale(delta, delta, r);
            temp = matrixInfo.eye;
            vec3.add(matrixInfo.eye, matrixInfo.at, delta);
            matrixInfo.eye[1] = temp[1];
        }
        lastX=x;
        lastY=y;
    };
}
