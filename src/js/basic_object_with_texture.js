/**
 *
 * @param gl
 * @param programInfo
 * @param projectionMatrix
 * @param positions
 * @param object
 * @param ambientLight
 * @param lightSources
 */
function drawPolygon(gl, programInfo, projectionMatrix, object, ambientLight, lightSources) {
    const buffers = initBuffers(gl, object);


    const modelViewMatrix = mat4.create();
    const cubeRotation = 1;
    const eyePosition = [0,-1,5];

    mat4.translate(
        modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [-0.0, 0.0, -6.0]);  // amount to translate
    // mat4.rotate(
    //     modelViewMatrix,  // destination matrix
    //     modelViewMatrix,  // matrix to rotate
    //     cubeRotation,     // amount to rotate in radians
    //     [0, 1, 0]);       // axis to rotate around (Z)
    // mat4.rotate(
    //     modelViewMatrix,  // destination matrix
    //     modelViewMatrix,  // matrix to rotate
    //     cubeRotation * .7,// amount to rotate in radians
    //     [0, 1, 0]);       // axis to rotate around (X)

    const normalMatrix = mat4.create();
    // normal matrix should transform the invert transpose matrix of modelViewMatrix
    mat4.invert(normalMatrix,modelViewMatrix);
    mat4.transpose(normalMatrix,normalMatrix);

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
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix);
    gl.uniform1i( programInfo.uniformLocations.useTexture,
        object.useTexture);
    gl.uniform1f( programInfo.uniformLocations.materialShiness,
        object.shiness);
    gl.uniform3fv(
        programInfo.uniformLocations.eyePosition,
        eyePosition);

    var pointLightingLocation = [];
    var pointLightingSpecularColor = [];
    var pointLightingDiffuseColor = [];
    var lightNum = 0;
    for (var i = 0;i < lightSources.length;i++) {
        if (lightSources[i].usePointLighting) {
            pointLightingLocation = pointLightingLocation.concat(lightSources[i].pointLightingLocation);
            pointLightingSpecularColor = pointLightingSpecularColor.concat(lightSources[i].pointLightingSpecularColor);
            pointLightingDiffuseColor = pointLightingDiffuseColor.concat(lightSources[i].pointLightingDiffuseColor);
            lightNum++;
        }  
    }

    // console.log(lightSources.length);
    gl.uniform1i( programInfo.uniformLocations.lightNum,lightNum);
    if (lightNum != 0) {
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


// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl, object) {
	// the real positions used in draw_array
	// it is expaned from positions and indices 
	real_positions = [];
	for (var i = 0;i < object.indices.length;i++) {
		const pos = 3*object.indices[i];
		real_positions.push(object.positions[pos]);
		real_positions.push(object.positions[pos+1]);
		real_positions.push(object.positions[pos+2]);
	}
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(real_positions), gl.STATIC_DRAW);

    //colors
    var colors = [];
    for (var i = 0;i < object.indices.length;i++) {
    	colors = colors.concat(object.faceColors);
	}
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


    // the real textureCoordinates used in draw_array
    // it is expaned from textureCoordinates and indices 
    real_textureCoordinates = [];
    for (var i = 0;i < object.textureIndices.length;i++) {
    	const pos = 2*object.textureIndices[i];
    	real_textureCoordinates.push(object.textureCoordinates[pos]);
    	real_textureCoordinates.push(object.textureCoordinates[pos+1]);
    }
    // texture coordinate
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(real_textureCoordinates), gl.STATIC_DRAW);


    // the real normal used in draw_array
    // it is expaned from textureCoordinates and indices 
    real_vertexNormals = [];
    for (var i = 0;i < object.normalIndices.length;i++) {
    	const pos = 3*object.normalIndices[i];
    	real_vertexNormals.push(object.vertexNormals[pos]);
    	real_vertexNormals.push(object.vertexNormals[pos+1]);
    	real_vertexNormals.push(object.vertexNormals[pos+2]);
    }
    // the normal buffer used for lighting 
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(real_vertexNormals), gl.STATIC_DRAW);
  
    return {
        position: positionBuffer,
        normal: normalBuffer,
        textureCoord: textureCoordBuffer,
        color: colorBuffer,
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