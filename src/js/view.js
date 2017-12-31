


let g_eye = vec3.fromValues(0.0, 0.0, 5.0);
let g_at = vec3.fromValues(0.0, 0.0, 0.0);
let g_up = vec3.fromValues(0.0, 1.0, 0.0);
let g_bPersp= true;
let g_fov=30.0;
let g_near=1.0;
let g_far=100.0;
let g_width=10.0;
let g_height=10.0;

/**
 *
 * @param ev
 * @param gl
 * @param canvas
 * @param u_ProjMatrix
 * @param projMatrix
 * @param u_ViewMatrix
 * @param viewMatrix
 * @param u_ModelMatrix
 * @param modelMatrix
 * @param currentAngle
 */
function keydown(ev, gl,canvas,u_ProjMatrix,projMatrix, u_ViewMatrix, viewMatrix,u_ModelMatrix,modelMatrix,currentAngle) {
    switch (ev.keyCode()) {
        case 'p':{
            g_bPersp=!g_bPersp;
            break;
        }
        case 'w': {
            g_eye[1] = 0.01;
            break;
        }
        case 's': {
            g_eye[1] -= 0.01;
            break;
        }
        case 'a': {
            g_eye[0] -= 0.01;
            break;
        }
        case 'd': {
            g_eye[0] += 0.01;
            break;
        }

        default:
            return;
    }
    updateMatrix(gl,canvas,u_ProjMatrix,projMatrix, u_ViewMatrix, viewMatrix,u_ModelMatrix,modelMatrix,currentAngle);
}

/**
 *
 * @param gl
 * @param canvas
 * @param u_ProjMatrix
 * @param projMatrix
 * @param u_ViewMatrix
 * @param viewMatrix
 * @param u_ModelMatrix
 * @param modelMatrix
 * @param currentAngle
 */
function updateMatrix(gl,canvas,u_ProjMatrix,projMatrix, u_ViewMatrix, viewMatrix,u_ModelMatrix,modelMatrix,currentAngle) {
    // update projection matrix
    if(g_bPersp) {
        mat4.perspective(projMatrix,g_fov,canvas.width/canvas.height,g_near,g_far);
    }
    else{
        mat4.ortho(projMatrix, -g_width,g_width,-g_height,g_height,g_near,g_far);
    }
    gl.uniformMatrix4fv(u_ProjMatrix,false,projMatrix);

    // update view matrix
    mat4.lookAt(viewMatrix, g_eye, g_at, g_up);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);

    // update model matrix
    mat4.rotateX(modelMatrix,mat4.create(),-(Math.PI/180)*currentAngle[0]);
    mat4.rotateY(modelMatrix,modelMatrix,-(Math.PI/180)*currentAngle[1]);
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix);

}


/**
 *
 * @param canvas
 * @param currentAngle
 */
function initRotateHandlers(canvas,currentAngle){
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
            currentAngle[0]=Math.max(Math.min(currentAngle[0]+dy,90.0),-90.0);
            // currentAngle[0]=currentAngle[0]+dy;
            currentAngle[1]=currentAngle[1]+dx;
        }
        lastX=x;
        lastY=y;
    }
}