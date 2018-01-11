/*
 * @param gl
 * @param programInfo
 * @param projectionMatrix
 * @param positions
 * @param object
 * @param ambientLight
 * @param lightSources
 */
function drawPolygon(gl, programInfo,matrixInfo, object, ambientLight, lightSources) {
    const buffers = initBuffers(gl, object);


    const modelMatrix = mat4.create();

    mat4.translate(
        modelMatrix,     // destination matrix
        modelMatrix,     // matrix to translate
        [-0.0, 0.0, -6.0]);  // amount to translate

    if (object.transformation) {
        if (object.transformation.translation)
            mat4.translate(
                modelMatrix,     // destination matrix
                modelMatrix,     // matrix to translate
                object.transformation.translation);  // amount to translate

        if (object.transformation.scale)
            mat4.scale(
                modelMatrix,
                modelMatrix,
                object.transformation.scale
            );

        if (object.transformation.rotation) {
            mat4.rotate(
                modelMatrix,  // destination matrix
                modelMatrix,  // matrix to rotate
                object.transformation.rotation.x,     // amount to rotate in radians
                [1, 0, 0]);       // axis to rotate around (X)

            mat4.rotate(
                modelMatrix,  // destination matrix
                modelMatrix,  // matrix to rotate
                object.transformation.rotation.y,     // amount to rotate in radians
                [0, 1, 0]);       // axis to rotate around (Y)

            mat4.rotate(
                modelMatrix,  // destination matrix
                modelMatrix,  // matrix to rotate
                object.transformation.rotation.z,     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)
        }
    }


    const normalMatrix = mat4.create();
    // normal matrix should transform the invert transpose matrix of modelMatrix
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

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

    // Tell WebGL how to pull out the ambient colors from the color buffer
    // into the vertexAmbientColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.ambientColor);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexAmbientColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexAmbientColor);
    }

    // Tell WebGL how to pull out the diffuse colors from the color buffer
    // into the vertexDiffuseColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.diffuseColor);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexDiffuseColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexDiffuseColor);
    }

    // Tell WebGL how to pull out the specular colors from the color buffer
    // into the vertexSpecularColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.specularColor);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexSpecularColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexSpecularColor);
    }


    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    //if (object.textureCoordinates) {
    if (object.textureCoordinates) {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.textureCoord);
    }

    // Tell WebGL how to pull out the normals 
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexNormal);
    }

    // // Tell WebGL which indices to use to index the vertices
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // console.log(matrixInfo.viewMatrix);
    // console.log(matrixInfo.projectionMatrix);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix);
    gl.uniform1i(programInfo.uniformLocations.useTexture,
        object.useTexture);
    gl.uniform1f(programInfo.uniformLocations.materialShiness,
        object.shiness);
    gl.uniform3fv(
        programInfo.uniformLocations.eyePosition,
        matrixInfo.eye);

    let pointLightingLocation = [];
    let pointLightingSpecularColor = [];
    let pointLightingDiffuseColor = [];
    let lightNum = 0;
    for (let i = 0; i < lightSources.length; i++) {
        if (lightSources[i].usePointLighting) {
            pointLightingLocation = pointLightingLocation.concat(lightSources[i].pointLightingLocation);
            pointLightingSpecularColor = pointLightingSpecularColor.concat(lightSources[i].pointLightingSpecularColor);
            pointLightingDiffuseColor = pointLightingDiffuseColor.concat(lightSources[i].pointLightingDiffuseColor);
            lightNum++;
        }
    }

    // console.log(lightSources.length);
    gl.uniform1i(programInfo.uniformLocations.lightNum, lightNum);
    if (lightNum !== 0) {
        gl.uniform3fv(
            programInfo.uniformLocations.pointLightingLocation,
            pointLightingLocation);
        gl.uniform3fv(
            programInfo.uniformLocations.pointLightingLocation,
            pointLightingLocation);
        gl.uniform3fv(
            programInfo.uniformLocations.pointLightingDiffuseColor,
            pointLightingDiffuseColor);
    }

    gl.uniform3fv(
        programInfo.uniformLocations.ambientLight,
        ambientLight);

    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, object.texture);
    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
        const vertexCount = object.indices.length;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        // gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

function drawCube(gl, programInfo, matrixInfo, object, ambientLight, lightSources) {
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
        0, 1, 2, 0, 2, 3,   //front
        4, 5, 6, 4, 6, 7,   //back
        4, 0, 3, 4, 3, 7,   //up
        5, 1, 2, 5, 2, 6,   //bottom
        4, 5, 1, 4, 1, 0,   //right
        3, 2, 6, 3, 6, 7,   //left
    ];
    let normalData = [
        1, 0, 0,
        -1, 0, 0,
        0, 1, 0,
        0, -1, 0,
        0, 0, 1,
        0, 0, -1
    ];
    let normalIndex = [
        4, 4, 4, 4, 4, 4,
        5, 5, 5, 5, 5, 5,
        2, 2, 2, 2, 2, 2,
        3, 3, 3, 3, 3, 3,
        0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1,
    ];
    let textureIndex = [
        0, 1, 2, 0, 2, 3,
        0, 1, 2, 0, 2, 3,
        0, 1, 2, 0, 2, 3,
        0, 1, 2, 0, 2, 3,
        0, 1, 2, 0, 2, 3,
        0, 1, 2, 0, 2, 3,
    ];
    let textureCoordinate = [
        0, 0,
        1, 0,
        1, 1,
        0, 1,];
    object.positions = vertexPositionData;
    object.indices = indexData;
    object.vertexNormals = normalData;
    object.normalIndices = normalIndex;
    object.textureIndices = textureIndex;
    object.textureCoordinates = textureCoordinate;
    //drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 1, 1, 1]], indexData, translation, scale, rotation);
    drawPolygon(gl, programInfo, matrixInfo, object, ambientLight, lightSources);
}

function drawSphere(gl, programInfo, matrixInfo, object, ambientLight, lightSources) {
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
    let textureIndex = [];
    let normalIndex = [];
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

            textureIndex.push(first);
            textureIndex.push(second);
            textureIndex.push(first + 1);
            textureIndex.push(second);
            textureIndex.push(second + 1);
            textureIndex.push(first + 1);

            normalIndex.push(first);
            normalIndex.push(second);
            normalIndex.push(first + 1);
            normalIndex.push(second);
            normalIndex.push(second + 1);
            normalIndex.push(first + 1);
        }
    }
    object.positions = vertexPositionData;
    object.indices = indexData;
    object.vertexNormals = normalData;
    object.normalIndices = normalIndex;
    object.textureCoordinates = textureCoordData;
    object.textureIndices = textureIndex;
    //drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [1, 1, 1, 1], indexData, translation, scale, rotation);
    drawPolygon(gl, programInfo, matrixInfo, object, ambientLight, lightSources);

}

function drawCylinder(gl, programInfo, matrixInfo, object, ambientLight, lightSources) {
    const radGap = 0.05;
    let vertexPositionData = [];
    let normalData = [];
    let textureCoordData = [];
    for (let rad = 0.0; rad <= 2.0; rad += radGap) {
        let x = Math.cos(rad * Math.PI);
        let z = Math.sin(rad * Math.PI);
        vertexPositionData.push(x);
        vertexPositionData.push(-1);
        vertexPositionData.push(z);
        vertexPositionData.push(x);
        vertexPositionData.push(1);
        vertexPositionData.push(z);

        textureCoordData.push(rad/2);
        textureCoordData.push(0);
        textureCoordData.push(rad/2);
        textureCoordData.push(1);

        normalData.push(x);
        normalData.push(0);
        normalData.push(z);
        normalData.push(x);
        normalData.push(0);
        normalData.push(z);
    }
    vertexPositionData.push(0);
    vertexPositionData.push(-1);
    vertexPositionData.push(0);
    vertexPositionData.push(0);
    vertexPositionData.push(1);
    vertexPositionData.push(0);

    textureCoordData.push(0.5);
    textureCoordData.push(0.5);
    textureCoordData.push(0.5);
    textureCoordData.push(0.5);

    normalData.push(0);
    normalData.push(-1);
    normalData.push(0);
    normalData.push(0);
    normalData.push(1);
    normalData.push(0);

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

    object.positions = vertexPositionData;
    object.indices = indexData;
    object.vertexNormals = normalData;
    object.normalIndices = indexData;
    object.textureCoordinates = textureCoordData;
    object.textureIndices = indexData;

    drawPolygon(gl, programInfo, matrixInfo, object, ambientLight, lightSources);

}


function drawCone(gl, programInfo, matrixInfo, object, ambientLight, lightSources) {
    const radGap = 0.05;
    let vertexPositionData = [];
    let normalData = [];
    let textureCoordData = [];
    for (let rad = 0.0; rad <= 2.0; rad += radGap) {
        let x = Math.cos(rad * Math.PI);
        let z = Math.sin(rad * Math.PI);
        vertexPositionData.push(x);
        vertexPositionData.push(-1);
        vertexPositionData.push(z);

        textureCoordData.push(rad/2);
        textureCoordData.push(0);

        normalData.push(x);
        normalData.push(0);
        normalData.push(z);
    }
    // top
    vertexPositionData.push(0);
    vertexPositionData.push(1);
    vertexPositionData.push(0);

    textureCoordData.push(0.5);
    textureCoordData.push(1);

    normalData.push(0);
    normalData.push(1);
    normalData.push(0);
    // bottom center
    vertexPositionData.push(0);
    vertexPositionData.push(-1);
    vertexPositionData.push(0);

    textureCoordData.push(0.5);
    textureCoordData.push(1);

    normalData.push(0);
    normalData.push(-1);
    normalData.push(0);

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


    object.positions = vertexPositionData;
    object.indices = indexData;
    object.vertexNormals = normalData;
    object.normalIndices = indexData;
    object.textureCoordinates = textureCoordData;
    object.textureIndices = indexData;

    drawPolygon(gl, programInfo, matrixInfo, object, ambientLight, lightSources);

}

function drawPrism(gl, programInfo, matrixInfo, object, ambientLight, lightSources) {
    const radGap = 2 / object.sideNum;
    let vertexPositionData = [];
    let normalData = [];
    let textureCoordData = [];
    for (let rad = 0.0; rad <= 2.0; rad += radGap) {
        let x = Math.cos(rad * Math.PI);
        let z = Math.sin(rad * Math.PI);
        vertexPositionData.push(x);
        vertexPositionData.push(-1);
        vertexPositionData.push(z);
        vertexPositionData.push(x);
        vertexPositionData.push(1);
        vertexPositionData.push(z);

        textureCoordData.push(rad/2);
        textureCoordData.push(0);
        textureCoordData.push(rad/2);
        textureCoordData.push(1);

        normalData.push(x);
        normalData.push(0);
        normalData.push(z);
        normalData.push(x);
        normalData.push(0);
        normalData.push(z);
    }
    vertexPositionData.push(0);
    vertexPositionData.push(-1);
    vertexPositionData.push(0);
    vertexPositionData.push(0);
    vertexPositionData.push(1);
    vertexPositionData.push(0);

    textureCoordData.push(0.5);
    textureCoordData.push(0.5);
    textureCoordData.push(0.5);
    textureCoordData.push(0.5);

    normalData.push(0);
    normalData.push(-1);
    normalData.push(0);
    normalData.push(0);
    normalData.push(1);
    normalData.push(0);

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

    //drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 0, 1, 1]], indexData, translation, scale, rotation);
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

    object.positions = vertexPositionData;
    object.indices = indexData;
    object.vertexNormals = normalData;
    object.normalIndices = indexData;
    object.textureCoordinates = textureCoordData;
    object.textureIndices = indexData;
    drawPolygon(gl, programInfo, matrixInfo, object, ambientLight, lightSources);
}

function drawTrustumOfAPyramid(gl, programInfo, matrixInfo, object, ambientLight, lightSources) {
    const radGap = 2 / object.sideNum;
    let vertexPositionData = [];
    let normalData = [];
    let textureCoordData = [];
    for (let rad = 0.0; rad <= 2.0; rad += radGap) {
        let x = Math.cos(rad * Math.PI);
        let z = Math.sin(rad * Math.PI);
        vertexPositionData.push(x);
        vertexPositionData.push(-1);
        vertexPositionData.push(z);
        vertexPositionData.push(x * object.upBottomRatio);
        vertexPositionData.push(1);
        vertexPositionData.push(z * object.upBottomRatio);

        textureCoordData.push(rad/2);
        textureCoordData.push(0);
        textureCoordData.push(rad/2);
        textureCoordData.push(1);

        normalData.push(x);
        normalData.push(0);
        normalData.push(z);
        normalData.push(x);
        normalData.push(0);
        normalData.push(z);
    }
    vertexPositionData.push(0);
    vertexPositionData.push(-1);
    vertexPositionData.push(0);
    vertexPositionData.push(0);
    vertexPositionData.push(1);
    vertexPositionData.push(0);

    textureCoordData.push(0.5);
    textureCoordData.push(0.5);
    textureCoordData.push(0.5);
    textureCoordData.push(0.5);

    normalData.push(0);
    normalData.push(-1);
    normalData.push(0);
    normalData.push(0);
    normalData.push(1);
    normalData.push(0);

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

    // drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [[1, 0, 1, 1]], indexData, translation, scale, rotation);
    // indexData = [];
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

    object.positions = vertexPositionData;
    object.indices = indexData;
    object.vertexNormals = normalData;
    object.normalIndices = indexData;
    object.textureCoordinates = textureCoordData;
    object.textureIndices = indexData;

    drawPolygon(gl, programInfo, matrixInfo, object, ambientLight, lightSources);
}

// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl, object) {
    // the real positions used in draw_array
    // it is expaned from positions and indices 
    let real_positions = [];
    for (let i = 0; i < object.indices.length; i++) {
        const pos = 3 * object.indices[i];
        real_positions.push(object.positions[pos]);
        real_positions.push(object.positions[pos + 1]);
        real_positions.push(object.positions[pos + 2]);
    }
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(real_positions), gl.STATIC_DRAW);

    //colors
    let ambientColors = [];
    for (let i = 0; i < object.indices.length; i++) {
        ambientColors = ambientColors.concat(object.ambientColor);
    }

    const ambientColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ambientColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ambientColors), gl.STATIC_DRAW);

    //colors
    let diffuseColors = [];
    for (let i = 0; i < object.indices.length; i++) {
        diffuseColors = diffuseColors.concat(object.diffuseColor);
    }

    const diffuseColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, diffuseColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diffuseColors), gl.STATIC_DRAW);

    //colors
    let specularColors = [];
    for (let i = 0; i < object.indices.length; i++) {
        specularColors = specularColors.concat(object.specularColor);
    }

    const specularColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, specularColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specularColors), gl.STATIC_DRAW);


    //const textureCoordBuffer = null;
    //if (object.useTexture) {
        // the real textureCoordinates used in draw_array
        // it is expaned from textureCoordinates and indices
        let real_textureCoordinates = [];
        for (let i = 0; i < object.textureIndices.length; i++) {
            const pos = 2 * object.textureIndices[i];
            real_textureCoordinates.push(object.textureCoordinates[pos]);
            real_textureCoordinates.push(object.textureCoordinates[pos + 1]);
        }
        // texture coordinate
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(real_textureCoordinates), gl.STATIC_DRAW);
    //}


    // the real normal used in draw_array
    // it is expand from textureCoordinates and indices
    let real_vertexNormals = [];
    for (let i = 0; i < object.normalIndices.length; i++) {
        const pos = 3 * object.normalIndices[i];
        real_vertexNormals.push(object.vertexNormals[pos]);
        real_vertexNormals.push(object.vertexNormals[pos + 1]);
        real_vertexNormals.push(object.vertexNormals[pos + 2]);
    }
    // console.log(object.vertexNormals);
    // console.log(real_vertexNormals);
    // the normal buffer used for lighting 
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(real_vertexNormals), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        normal: normalBuffer,
        textureCoord: textureCoordBuffer,
        ambientColor: ambientColorBuffer,
        diffuseColor: diffuseColorBuffer,
        specularColor: specularColorBuffer,
    };
}


//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// the function is needed when loading texture
// use bitwise and 
function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

// load the texture from given url 
// note that you should enable read local file in your browser 
// return texture
function loadTexture(gl, url) {
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
    image.src = url;

    return texture;
}
