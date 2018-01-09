function getProgramInfo(gl) {
    const vsSource = `
        precision lowp float;
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexAmbientColor;
        attribute vec4 aVertexDiffuseColor;
        attribute vec4 aVertexSpecularColor;
        // attribute vec4 aVertexColor;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform mat4 uNormalMatrix;
        
        varying vec4 vPosition; 
        varying vec4 vAmbientColor;
        varying vec4 vDiffuseColor;
        varying vec4 vSpecularColor;
        // varying vec4 vColor; 
        varying vec2 vTextureCoord;
        varying vec4 vTransformedNormal;

        void main(void) {
            vPosition = uModelViewMatrix * aVertexPosition;
            vAmbientColor = aVertexAmbientColor;
            vDiffuseColor = aVertexDiffuseColor;
            vSpecularColor = aVertexSpecularColor;
            gl_Position = uProjectionMatrix * vPosition;
            vTextureCoord = aTextureCoord;
            vTransformedNormal = uNormalMatrix*vec4(aVertexNormal,1.0);
        }
        `;

    // Fragment shader program

    const fsSource = `
        #define MAX_LIGHT_NUM 5
        precision lowp float;
        uniform bool uUseTexture;

        uniform float uMaterialShiness;
        uniform vec3 uEyePosition;
        uniform int uLightNum;
        uniform vec3 uPointLightingLocation[MAX_LIGHT_NUM];
        uniform vec3 uPointLightingSpecularColor[MAX_LIGHT_NUM];
        uniform vec3 uPointLightingDiffuseColor[MAX_LIGHT_NUM];
        uniform vec3 uAmbientLight;

        // the variable share with vsSource
        varying vec4 vPosition;
        varying vec4 vAmbientColor;
        varying vec4 vDiffuseColor;
        varying vec4 vSpecularColor;
        // varying vec4 vColor; 
        varying vec2 vTextureCoord;
        varying vec4 vTransformedNormal;

        uniform sampler2D uSampler;

        void main(void) {
            vec3 lighting = uAmbientLight;
            vec3 normal = normalize(vTransformedNormal.xyz);
            vec3 eyeDirection = normalize(uEyePosition - vec3(vPosition));
            vec3 origColor = uAmbientLight*vAmbientColor.rgb;

            for (int i = 0;i < MAX_LIGHT_NUM;i++) {
                if (i < uLightNum) {
                    // the direction for point light
                    vec3 directionalVector = normalize(uPointLightingLocation[i] - vec3(vPosition));
                    vec3 reflectionDirection = reflect(-directionalVector, normal);

                    float specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShiness);
                    float diffuseLightWeighting = max(dot(normal, directionalVector), 0.0);

                    // lighting = uAmbientLight+ uPointLightingDiffuseColor * diffuseLightWeighting;
                    lighting += uPointLightingSpecularColor[i] * specularLightWeighting
                        + uPointLightingDiffuseColor[i] * diffuseLightWeighting;

                    origColor +=  uPointLightingSpecularColor[i]*specularLightWeighting*vSpecularColor.rgb + uPointLightingDiffuseColor[i]*diffuseLightWeighting*vDiffuseColor.rgb;
                }
            }

            if (uUseTexture) {
                vec4 texColor = texture2D(uSampler,vTextureCoord);
                gl_FragColor = vec4(texColor.rgb*lighting,  texColor.a);
            } else {
                gl_FragColor = vec4(origColor,vAmbientColor.a);
                // gl_FragColor = vec4(vAmbientColor.rgb*lighting,1.0);     
            }
        }
        `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    return {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexAmbientColor: gl.getAttribLocation(shaderProgram, 'aVertexAmbientColor'),
            vertexDiffuseColor: gl.getAttribLocation(shaderProgram, 'aVertexDiffuseColor'),
            vertexSpecularColor: gl.getAttribLocation(shaderProgram, 'aVertexSpecularColor'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            usePointLighting: gl.getUniformLocation(shaderProgram, 'uUsePointLighting'),
            useTexture: gl.getUniformLocation(shaderProgram, 'uUseTexture'),
            materialShiness: gl.getUniformLocation(shaderProgram, 'uMaterialShiness'),
            eyePosition: gl.getUniformLocation(shaderProgram, 'uEyePosition'),
            lightNum: gl.getUniformLocation(shaderProgram, 'uLightNum'),
            pointLightingLocation: gl.getUniformLocation(shaderProgram, 'uPointLightingLocation'),
            pointLightingSpecularColor: gl.getUniformLocation(shaderProgram, 'uPointLightingSpecularColor'),
            pointLightingDiffuseColor: gl.getUniformLocation(shaderProgram, 'uPointLightingDiffuseColor'),
            ambientLight: gl.getUniformLocation(shaderProgram, 'uAmbientLight'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };


}

function getProjectionMatrix(gl){
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    console.log("aspect : " + aspect)
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    return projectionMatrix;
}

function getLightSources() {
    let lightSource1 = {
        usePointLighting: true,
        pointLightingLocation: [0, 10, 4],
        pointLightingSpecularColor: [0.5, 0.5, 0.5],
        pointLightingDiffuseColor: [1, 1, 1],
    };

    let lightSource2 = {
        usePointLighting: true,
        pointLightingLocation: [0, 10, -4],
        pointLightingSpecularColor: [0.5, 0.5, 0.5],
        pointLightingDiffuseColor: [0.4, 0.4, 0.4],
    };


    let lightSources = [];
    lightSources = lightSources.concat(lightSource1);
    lightSources = lightSources.concat(lightSource2);

    return lightSources;
}

function getAmbientLight() {
    return [0.2, 0.2, 0.2];
}

function getEyePosition() {
    return [0, 0, 5];
}

function display() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    const programInfo = getProgramInfo(gl);

    function render(cnt) {
        let projectionMatrix = getProjectionMatrix(gl);
        let ambientLight = getAmbientLight();
        let lightSources = getLightSources();
        let eyePosition = getEyePosition();

        drawScene(gl, programInfo, projectionMatrix, ambientLight, lightSources, eyePosition);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}

function drawScene(gl, programInfo, projectionMatrix, ambientLight, lightSources, eyePosition) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let item in ObjectPool){
        switch (ObjectPool[item].type){
            case "cube":
                drawCube(gl, programInfo, projectionMatrix, ObjectPool[item].ObjectInfo, ambientLight, lightSources, eyePosition);
                break;
            case "sphere":
                drawSphere(gl, programInfo, projectionMatrix, ObjectPool[item].ObjectInfo, ambientLight, lightSources, eyePosition);
                break;
            case "cylinder":
                drawCylinder(gl, programInfo, projectionMatrix, ObjectPool[item].ObjectInfo, ambientLight, lightSources, eyePosition);
                break;
            case "cone":
                drawCone(gl, programInfo, projectionMatrix, ObjectPool[item].ObjectInfo, ambientLight, lightSources, eyePosition);
                break;
            case "prism":
                drawPrism(gl, programInfo, projectionMatrix, ObjectPool[item].ObjectInfo, ambientLight, lightSources, eyePosition);
                break;
            case "trustumofapyramid":
                drawTrustumOfAPyramid(gl, programInfo, projectionMatrix, ObjectPool[item].ObjectInfo, ambientLight, lightSources, eyePosition);
                break;
            case "obj":
                objDisplay(gl, programInfo, projectionMatrix, ObjectPool[item].ObjectInfo, ambientLight, lightSources, eyePosition);
                break;
            default:
                console.log("CGTWError :: undefined ObjectPool type")
        }
    }

}
