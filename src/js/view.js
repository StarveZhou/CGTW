

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
    gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false,matrixInfo.viewMatrix);
}



function isOut(point) {
    let pad=1;
    let trueWorldSize=worldSize-pad;
    if(point[0]>-trueWorldSize&&point[0]<trueWorldSize&&point[1]>-trueWorldSize&&point[1]<trueWorldSize&&point[2]>-trueWorldSize&&point[2]<trueWorldSize)
        return false;
    else
        return true;
}


// followings are small handler

/**
 *
 * @param ev
 * @param matrixInfo
 */
function keydown(ev,matrixInfo) {
    let delta=0.05;
    let temp=vec3.create();
    switch (ev.keyCode) {
        case 'P'.charCodeAt():{
            matrixInfo.bPersp=!matrixInfo.bPersp;
            break;
        }
        case 'W'.charCodeAt(): {
            let r=vec3.create();
            vec3.sub(r,matrixInfo.at,matrixInfo.eye);
            vec3.scaleAndAdd(temp,matrixInfo.eye,r,delta);
            if(!isOut(temp)){
                vec3.copy(matrixInfo.eye,temp);
            }
            vec3.scaleAndAdd(matrixInfo.at,matrixInfo.at,r,delta);
            break;
        }
        case 'S'.charCodeAt(): {
            let r=vec3.create();
            vec3.sub(r,matrixInfo.at,matrixInfo.eye);
            vec3.scaleAndAdd(temp,matrixInfo.eye,r,-delta);
            if(!isOut(temp)){
                vec3.copy(matrixInfo.eye,temp);
            }
            vec3.scaleAndAdd(matrixInfo.at,matrixInfo.at,r,-delta);
            break;
        }
        case 'A'.charCodeAt(): {
            vec3.scaleAndAdd(temp,matrixInfo.eye,matrixInfo.right,-delta);
            if(!isOut(temp)){
                vec3.copy(matrixInfo.eye,temp);
            }
            vec3.scaleAndAdd(matrixInfo.at,matrixInfo.at,matrixInfo.right,-delta);
            break;
        }
        case 'D'.charCodeAt(): {
            vec3.scaleAndAdd(temp,matrixInfo.eye,matrixInfo.right,delta);
            if(!isOut(temp)){
                vec3.copy(matrixInfo.eye,temp);
            }
            vec3.scaleAndAdd(matrixInfo.at,matrixInfo.at,matrixInfo.right,delta);
            break;
        }
        //space key
        case 32:{
            vec3.scaleAndAdd(temp,matrixInfo.eye,matrixInfo.up,delta);
            if(!isOut(temp)){
                vec3.copy(matrixInfo.eye,temp);
            }
            vec3.scaleAndAdd(matrixInfo.at,matrixInfo.at,matrixInfo.up,delta);
            break;
        }
        //shift key
        case 16:{
            vec3.scaleAndAdd(temp,matrixInfo.eye,matrixInfo.up,-delta);
            if(!isOut(temp)){
                vec3.copy(matrixInfo.eye,temp);
            }
            vec3.scaleAndAdd(matrixInfo.at,matrixInfo.at,matrixInfo.up,-delta);
            break;
        }
        case 'F'.charCodeAt():{
            matrixInfo.eye=vec3.fromValues(0.0, 0.0, 5.0);
            matrixInfo.at=vec3.fromValues(0.0, 0.0, 0.0);
            matrixInfo.up=vec3.fromValues(0.0, 1.0, 0.0);
            matrixInfo.right=vec3.fromValues(5.0,0.0,0.0);
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


function rotateWith(inVec,origin,s,angle){
    vec3.sub(inVec,inVec,origin);
    let normalS=vec3.create();
    vec3.normalize(normalS,s);
    // vec3.cross(normalT,normalR,normalS);
    let u=normalS[0];
    let v=normalS[1];
    let w=normalS[2];
    let costheta=Math.cos(angle/180*Math.PI);
    let sintheta=Math.sin(angle/180*Math.PI);
    let M=mat3.fromValues(u*u+(1-u*u)*costheta,u*v*(1-costheta)+w*sintheta,u*w*(1-costheta)-v*sintheta,
        u*v*(1-costheta)-w*sintheta,v*v+(1-v*v)*costheta,v*w*(1-costheta)+u*sintheta,
        u*w*(1-costheta)+v*sintheta,v*w*(1-costheta)-u*sintheta,w*w+(1-w*w)*costheta);
    let newS=vec3.create();
    vec3.transformMat3(newS,inVec,M);
    vec3.add(newS,newS,origin);
    return newS;
}


/**
 * Actually a canvas relevant handler(all callbacks register on canvas's event can be added to this function)
 * @param canvas
 * @param matrixInfo
 */
function initCanvasHandlers(canvas,matrixInfo){
    // canvas.onmousewheel=function (ev) {
    //     if(ev.shiftKey&&(!bRoam)){
    //         let r=vec3.create();
    //         let temp=vec3.create();
    //         vec3.sub(r,matrixInfo.at,matrixInfo.eye);
    //         vec3.scaleAndAdd(temp,matrixInfo.eye,r,-ev.wheelDelta/5000);
    //         if(!isOut(temp)){
    //             vec3.copy(matrixInfo.eye,temp);
    //         }
    //         vec3.scaleAndAdd(matrixInfo.at,matrixInfo.at,r,-ev.wheelDelta/5000);
    //     }
    // };
    // let dragging = false;
    let lastX=0,lastY=0;
    //push the button
    // canvas.onmousedown=function (ev) {
    //     let x= ev.clientX, y= ev.clientY;
    //     let rect=ev.target.getBoundingClientRect();
    //     if(rect.left<=x&&x<rect.right&&rect.top<=y&&y<rect.bottom){
    //         lastX=x;
    //         lastY=y;
    //         dragging=true;
    //     }
    // };
    //release the mouse
    canvas.onclick=function (ev) {
        matrixInfo.bRoam=!matrixInfo.bRoam;
    };
    canvas.onmouseup=function (ev) {dragging=false};
    canvas.onmousemove=function(ev){
        let x=ev.clientX,y=ev.clientY;
        // if(dragging&&(!bRoam)){
        //     let yFactor=100/canvas.height;
        //     let xFactor=100/canvas.width;
        //     let dx=xFactor*(x-lastX);
        //     let dy=yFactor*(y-lastY);
        //     let r=vec3.create();
        //     let t=vec3.create();
        //     // vec3.sub(r,matrixInfo.eye,matrixInfo.at);
        //     vec3.sub(r,matrixInfo.at,matrixInfo.eye);
        //     vec3.cross(matrixInfo.right,r,matrixInfo.up);
        //     vec3.cross(t,matrixInfo.right,r);
        //     let upPoint=vec3.create();
        //
        //     vec3.add(upPoint,matrixInfo.eye,matrixInfo.up);
        //     matrixInfo.eye=rotateWith(matrixInfo.eye,matrixInfo.at,matrixInfo.right,-dy);
        //     let newPoint=rotateWith(upPoint,matrixInfo.at,matrixInfo.right,-dy);
        //     vec3.sub(matrixInfo.up,newPoint,matrixInfo.eye);
        //
        //     matrixInfo.eye=rotateWith(matrixInfo.eye,matrixInfo.at,t,-dx);
        //     newPoint=rotateWith(newPoint,matrixInfo.at,t,-dx);
        //     vec3.sub(matrixInfo.up,newPoint,matrixInfo.eye);
        //     // vec3.sub(r,matrixInfo.eye,matrixInfo.at);
        //     vec3.sub(r,matrixInfo.at,matrixInfo.eye);
        //     vec3.cross(matrixInfo.right,r,matrixInfo.up);
        //     console.log(matrixInfo.right);
        // }
        if(matrixInfo.bRoam){
            let yFactor=800/canvas.height;
            let xFactor=800/canvas.width;
            let dx=xFactor*(x-lastX);
            let dy=yFactor*(y-lastY);
            let r=vec3.create();
            let t=vec3.create();
            vec3.sub(r,matrixInfo.at,matrixInfo.eye);
            vec3.cross(matrixInfo.right,r,matrixInfo.up);
            vec3.cross(t,matrixInfo.right,r);
            let upPoint=vec3.create();
            vec3.add(upPoint,matrixInfo.eye,matrixInfo.up);
            matrixInfo.at=rotateWith(matrixInfo.at,matrixInfo.eye,matrixInfo.right,-dy);
            let newPoint=rotateWith(upPoint,matrixInfo.eye,matrixInfo.right,-dy);
            vec3.sub(matrixInfo.up,newPoint,matrixInfo.eye);

            matrixInfo.at=rotateWith(matrixInfo.at,matrixInfo.eye,t,-dx);
            newPoint=rotateWith(newPoint,matrixInfo.eye,t,-dx);
            vec3.sub(matrixInfo.up,newPoint,matrixInfo.eye);
            vec3.sub(r,matrixInfo.at,matrixInfo.eye);
            vec3.cross(matrixInfo.right,r,matrixInfo.up);
        }
        lastX=x;
        lastY=y;
    };
}