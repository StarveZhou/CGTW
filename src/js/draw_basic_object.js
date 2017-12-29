function drawPolygon(gl, programInfo, projectionMatrix, positions, faceColors, indices, translation, scale, rotation, texture, textureCoordinates) {
    const buffers = initBuffers(gl, positions, faceColors, indices, textureCoordinates);

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

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    if (textureCoordinates)
    {
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

    if (texture)
    {
        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    }

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

function drawSphere(gl, programInfo, projectionMatrix, translation, scale, rotation, texture) {
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
    drawPolygon(gl, programInfo, projectionMatrix, vertexPositionData, [1, 1, 1, 1], indexData, translation, scale, rotation, texture, textureCoordData);
    console.log("vertex", vertexPositionData);
    console.log("index", indexData);
    console.log("textureCoord", textureCoordData)
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

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
// function initBuffers(gl, positions, faceColors, indices) {
//     // positions
//     const positionBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
//
//     //colors
//     let colors = [];
//     for (let i = 0; i < faceColors.length; ++i) {
//         const c = faceColors[i];
//         for (let j = 0; j < 2 + indices.length / 3; j++)
//             colors = colors.concat(c);
//     }
//     const colorBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
//
//     // indices
//     const indexBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
//     return {
//         position: positionBuffer,
//         color: colorBuffer,
//         indices: indexBuffer,
//     };
// }

function initBuffers(gl, positions, faceColors, indices, textureCoordinates) {
    // positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    //colors
    var colors = [];
    for (var i = 0; i < faceColors.length; ++i) {
        const c = faceColors[i];
        for (var j = 0; j < 2 + indices.length / 3; j++)
            colors = colors.concat(c);
    }
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // indices
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        color: colorBuffer,
        indices: indexBuffer,
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
    return (value & (value - 1)) == 0;
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

    var image = new Image();
    image.onload = function() {
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