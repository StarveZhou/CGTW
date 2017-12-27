function drawPolygon(gl, programInfo, projectionMatrix, positions, faceColors, indices, translation, scale, rotation) {
    const buffers = initBuffers(gl, positions, faceColors, indices);

    const modelViewMatrix = mat4.create();


    mat4.translate(
        modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [-0.0, 0.0, -6.0]);  // amount to translate

    if (translation)
        mat4.translate(
            modelViewMatrix,     // destination matrix
            modelViewMatrix,     // matrix to translate
            translation);  // amount to translate

    if (scale)
        mat4.scale(
            modelViewMatrix,
            modelViewMatrix,
            scale
        );
    if (rotation) {
        mat4.rotate(
            modelViewMatrix,  // destination matrix
            modelViewMatrix,  // matrix to rotate
            rotation.x,     // amount to rotate in radians
            [1, 0, 0]);       // axis to rotate around (X)

        mat4.rotate(
            modelViewMatrix,  // destination matrix
            modelViewMatrix,  // matrix to rotate
            rotation.y,     // amount to rotate in radians
            [0, 1, 0]);       // axis to rotate around (Y)

        mat4.rotate(
            modelViewMatrix,  // destination matrix
            modelViewMatrix,  // matrix to rotate
            rotation.z,     // amount to rotate in radians
            [0, 0, 1]);       // axis to rotate around (Z)
    }

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
        const vertexCount = indices.length;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

function drawCube(gl, programInfo, projectionMatrix, translation, scale, rotation) {
    let vertexPositionData = [
        1, 1, 1,
        1, -1, 1,
        -1, -1, 1,
        -1, 1, 1,
        1, 1, -1,
        1, -1, -1,
        -1, -1, -1,
        -1, 1, -1,
    ];
    let indexData = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        4, 0, 3, 4, 3, 7,
        5, 1, 2, 5, 2, 6,
        4, 5, 1, 4, 1, 0,
        3, 2, 6, 3, 6, 7,
    ];
    drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 1, 1, 1]], indexData, translation, scale, rotation);
}

function drawSphere(gl, programInfo, projectionMatrix, translation, scale, rotation) {
    const latitudeBands = 30;
    const longitudeBands = 30;
    const radius = 1;

    let vertexPositionData = [];
    let normalData = [];
    let textureCoordData = [];
    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        let theta = latNumber * Math.PI / latitudeBands;
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);

        for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            let phi = longNumber * 2 * Math.PI / longitudeBands;
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            let x = cosPhi * sinTheta;
            let y = cosTheta;
            let z = sinPhi * sinTheta;
            let u = 1 - (longNumber / longitudeBands);
            let v = 1 - (latNumber / latitudeBands);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            textureCoordData.push(u);
            textureCoordData.push(v);
            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }

    let indexData = [];
    for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
            let first = (latNumber * (longitudeBands + 1)) + longNumber;
            let second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }
    drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [1, 1, 1, 1], indexData, translation, scale, rotation);
    // console.log("vertex", vertexPositionData);
    // console.log("index", indexData);
}

function drawCylinder(gl, programInfo, projectionMatrix, translation, scale, rotation) {
    const radGap = 0.05;
    let vertexPositionData = [];
    for (let rad = 0.0; rad <= 2.0; rad += radGap) {
        let x = Math.cos(rad * Math.PI);
        let z = Math.sin(rad * Math.PI);
        vertexPositionData.push(x);
        vertexPositionData.push(-1);
        vertexPositionData.push(z);
        vertexPositionData.push(x);
        vertexPositionData.push(1);
        vertexPositionData.push(z);
    }
    vertexPositionData.push(0);
    vertexPositionData.push(-1);
    vertexPositionData.push(0);

    vertexPositionData.push(0);
    vertexPositionData.push(1);
    vertexPositionData.push(0);

    let indexData = [];
    let i;
    for (i = 0; i < vertexPositionData.length / 3 - 2 - 2; i += 2) {
        //console.log(i, vertexPositionData[i], vertexPositionData[i + 1], vertexPositionData[i + 2]);
        indexData.push(i);
        indexData.push(i + 1);
        indexData.push(i + 2);

        indexData.push(i + 1);
        indexData.push(i + 2);
        indexData.push(i + 3);

    }
    // 上下表面圆心
    indexData.push(i);
    indexData.push(i + 1);
    indexData.push(0);

    indexData.push(i + 1);
    indexData.push(0);
    indexData.push(1);

    //drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [1, 1, 1, 1], indexData);
    //indexData = [];
    for (i = 0; i < vertexPositionData.length / 3 - 2 - 2; i += 2) {
        indexData.push(i);
        indexData.push(i + 2);
        indexData.push(vertexPositionData.length / 3 - 2);
    }
    indexData.push(i);
    indexData.push(0);
    indexData.push(vertexPositionData.length / 3 - 2);

    for (i = 1; i < vertexPositionData.length / 3 - 2 - 2; i += 2) {
        indexData.push(i);
        indexData.push(i + 2);
        indexData.push(vertexPositionData.length / 3 - 1);
    }
    indexData.push(i);
    indexData.push(1);
    indexData.push(vertexPositionData.length / 3 - 1);
    console.log('indices', indexData);
    drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 1, 1, 1]], indexData, translation, scale, rotation);

}

function drawCone(gl, programInfo, projectionMatrix, translation, scale, rotation) {
    const radGap = 0.05;
    let vertexPositionData = [];
    for (let rad = 0.0; rad <= 2.0; rad += radGap) {
        let x = Math.cos(rad * Math.PI);
        let z = Math.sin(rad * Math.PI);
        vertexPositionData.push(x);
        vertexPositionData.push(-1);
        vertexPositionData.push(z);
    }
    // top
    vertexPositionData.push(0);
    vertexPositionData.push(1);
    vertexPositionData.push(0);
    // bottom center
    vertexPositionData.push(0);
    vertexPositionData.push(-1);
    vertexPositionData.push(0);

    let i;
    let indexData = [];
    for (i = 0; i < vertexPositionData.length / 3 - 2 - 1; i++) {
        indexData.push(i);
        indexData.push(i + 1);
        indexData.push(vertexPositionData.length / 3 - 2);
    }
    indexData.push(i);
    indexData.push(0);
    indexData.push(vertexPositionData.length / 3 - 2);

    //indexData = [];
    for (i = 0; i < vertexPositionData.length / 3 - 2 - 1; i++) {
        indexData.push(i);
        indexData.push(i + 1);
        indexData.push(vertexPositionData.length / 3 - 1);
    }
    indexData.push(i);
    indexData.push(0);
    indexData.push(vertexPositionData.length / 3 - 1);

    drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 1, 1, 1]], indexData, translation, scale, rotation);

}

function drawPrism(gl, programInfo, projectionMatrix, sideNum, translation, scale, rotation) {
    const radGap = 2 / sideNum;
    let vertexPositionData = [];
    for (let rad = 0.0; rad <= 2.0; rad += radGap) {
        let x = Math.cos(rad * Math.PI);
        let z = Math.sin(rad * Math.PI);
        vertexPositionData.push(x);
        vertexPositionData.push(-1);
        vertexPositionData.push(z);
        vertexPositionData.push(x);
        vertexPositionData.push(1);
        vertexPositionData.push(z);
    }
    vertexPositionData.push(0);
    vertexPositionData.push(-1);
    vertexPositionData.push(0);

    vertexPositionData.push(0);
    vertexPositionData.push(1);
    vertexPositionData.push(0);

    let indexData = [];
    let i;
    for (i = 0; i < vertexPositionData.length / 3 - 2 - 2; i += 2) {
        //console.log(i, vertexPositionData[i], vertexPositionData[i + 1], vertexPositionData[i + 2]);
        indexData.push(i);
        indexData.push(i + 1);
        indexData.push(i + 2);

        indexData.push(i + 1);
        indexData.push(i + 2);
        indexData.push(i + 3);

    }

    indexData.push(i);
    indexData.push(i + 1);
    indexData.push(0);

    indexData.push(i + 1);
    indexData.push(0);
    indexData.push(1);

    drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 0, 1, 1]], indexData, translation, scale, rotation);
    indexData = [];
    for (i = 0; i < vertexPositionData.length / 3 - 2 - 2; i += 2) {
        indexData.push(i);
        indexData.push(i + 2);
        indexData.push(vertexPositionData.length / 3 - 2);
    }
    indexData.push(i);
    indexData.push(0);
    indexData.push(vertexPositionData.length / 3 - 2);

    for (i = 1; i < vertexPositionData.length / 3 - 2 - 2; i += 2) {
        indexData.push(i);
        indexData.push(i + 2);
        indexData.push(vertexPositionData.length / 3 - 1);
    }
    indexData.push(i);
    indexData.push(1);
    indexData.push(vertexPositionData.length / 3 - 1);
    console.log('indices', indexData);
    drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 1, 1, 1]], indexData, translation, scale, rotation);
}

function drawTrustumOfAPyramid(gl, programInfo, projectionMatrix, sideNum, upBottomRatio, translation, scale, rotation) {
    const radGap = 2 / sideNum;
    let vertexPositionData = [];
    for (let rad = 0.0; rad <= 2.0; rad += radGap) {
        let x = Math.cos(rad * Math.PI);
        let z = Math.sin(rad * Math.PI);
        vertexPositionData.push(x);
        vertexPositionData.push(-1);
        vertexPositionData.push(z);
        vertexPositionData.push(x * upBottomRatio);
        vertexPositionData.push(1);
        vertexPositionData.push(z * upBottomRatio);
    }
    vertexPositionData.push(0);
    vertexPositionData.push(-1);
    vertexPositionData.push(0);

    vertexPositionData.push(0);
    vertexPositionData.push(1);
    vertexPositionData.push(0);

    let indexData = [];
    let i;
    for (i = 0; i < vertexPositionData.length / 3 - 2 - 2; i += 2) {
        //console.log(i, vertexPositionData[i], vertexPositionData[i + 1], vertexPositionData[i + 2]);
        indexData.push(i);
        indexData.push(i + 1);
        indexData.push(i + 2);

        indexData.push(i + 1);
        indexData.push(i + 2);
        indexData.push(i + 3);

    }

    indexData.push(i);
    indexData.push(i + 1);
    indexData.push(0);

    indexData.push(i + 1);
    indexData.push(0);
    indexData.push(1);

    drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 0, 1, 1]], indexData, translation, scale, rotation);
    indexData = [];
    for (i = 0; i < vertexPositionData.length / 3 - 2 - 2; i += 2) {
        indexData.push(i);
        indexData.push(i + 2);
        indexData.push(vertexPositionData.length / 3 - 2);
    }
    indexData.push(i);
    indexData.push(0);
    indexData.push(vertexPositionData.length / 3 - 2);

    for (i = 1; i < vertexPositionData.length / 3 - 2 - 2; i += 2) {
        indexData.push(i);
        indexData.push(i + 2);
        indexData.push(vertexPositionData.length / 3 - 1);
    }
    indexData.push(i);
    indexData.push(1);
    indexData.push(vertexPositionData.length / 3 - 1);
    console.log('indices', indexData);
    drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 1, 1, 1]], indexData, translation, scale, rotation);
}