//TODO 也许渲染器可以更厉害一点
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

        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform mat4 uNormalMatrix;
        uniform vec3 uEyePosition;
        uniform vec3 uEyeFacePoint;
        uniform vec3 uEyeUp;
        
        uniform bool uUseBillboard;
        uniform vec3 uBillboardPosition;
        uniform vec3 uBillboardSize;
        
        varying vec4 vPosition; 
        varying vec4 vAmbientColor;
        varying vec4 vDiffuseColor;
        varying vec4 vSpecularColor;
        // varying vec4 vColor; 
        varying vec2 vTextureCoord;
        varying vec4 vTransformedNormal;
        
        void main(void) {
            if (uUseBillboard)
            {
                vec3 eyeFace = normalize(uEyeFacePoint - uEyePosition);
                vec3 eyeUp = normalize(uEyeUp);
                vec3 eyeRight = cross(eyeFace, eyeUp);
                vPosition = vec4(uBillboardPosition.xyz + (eyeRight * aVertexPosition.x * uBillboardSize) + \
                            (eyeUp * aVertexPosition.y * uBillboardSize), 1.0);
                vTransformedNormal = vec4(uEyePosition - uBillboardPosition, 1.0);
                //vTransformedNormal = vec4(eyeRight, 1.0);
                vPosition = uModelMatrix * aVertexPosition;
                //vTransformedNormal = uNormalMatrix*vec4(aVertexNormal,1.0);
            }
            else
            {
                vPosition = uModelMatrix * aVertexPosition;
                vTransformedNormal = uNormalMatrix*vec4(aVertexNormal,1.0);
            }
            vAmbientColor = aVertexAmbientColor;
            vDiffuseColor = aVertexDiffuseColor;
            vSpecularColor = aVertexSpecularColor;
            gl_Position = uProjectionMatrix * uViewMatrix * vPosition;
            vTextureCoord = aTextureCoord;
        }
        `;

    // Fragment shader program

    const fsSource = `
        #define MAX_LIGHT_NUM 5
        precision lowp float;
        uniform bool uUseTexture;
        uniform bool uUseDepthTexture;

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
        uniform sampler2D uDepthSampler;
        
        
        
        
        void main(void) {
            vec3 lighting = uAmbientLight;
            vec3 normal;
            vec3 eyeDirection = normalize(uEyePosition - vec3(vPosition));
            vec3 origColor = uAmbientLight*vAmbientColor.rgb;    
            vec2 texCoord;
            
            texCoord = vTextureCoord;
            
            if (uUseDepthTexture)
            {
                vec3 normalDelta;
                mat3 depth;
                float deltax;
                float deltay;
                
                texCoord = vTextureCoord + vec2(-0.015, -0.015);
                depth[0][0] = texture2D(uDepthSampler, texCoord).r;
                texCoord = vTextureCoord + vec2(-0.015, 0.0);
                depth[0][1] = texture2D(uDepthSampler, texCoord).r;
                texCoord = vTextureCoord + vec2(-0.015, 0.015);
                depth[0][2] = texture2D(uDepthSampler, texCoord).r;
                
                texCoord = vTextureCoord + vec2(0.0, -0.015);
                depth[1][0] = texture2D(uDepthSampler, texCoord).r;
                texCoord = vTextureCoord + vec2(0.0, 0.0);
                depth[1][1] = texture2D(uDepthSampler, texCoord).r;
                texCoord = vTextureCoord + vec2(0.0, 0.015);
                depth[1][2] = texture2D(uDepthSampler, texCoord).r;
                
                texCoord = vTextureCoord + vec2(0.015, -0.015);
                depth[2][0] = texture2D(uDepthSampler, texCoord).r;
                texCoord = vTextureCoord + vec2(0.015, 0.0);
                depth[2][1] = texture2D(uDepthSampler, texCoord).r;
                texCoord = vTextureCoord + vec2(0.015, 0.015);
                depth[2][2] = texture2D(uDepthSampler, texCoord).r;
                
                deltax = (depth[0][2] + 2.0 * depth[1][2] + depth[2][2]) - (depth[0][0] + 2.0 * depth[1][0] + depth[2][0]);
                deltay = (depth[2][0] + 2.0 * depth[2][1] + depth[2][2]) - (depth[0][0] + 2.0 * depth[0][1] + depth[0][2]);

                /*
                float depth0 = texture2D(uDepthSampler, texCoord).r;
                texCoord = vTextureCoord + vec2(0.01, 0);
                float depth1 = texture2D(uDepthSampler, texCoord).r;
                texCoord = vTextureCoord + vec2(0, 0.01);
                float depth2 = texture2D(uDepthSampler, texCoord).r;
                deltax = depth1 - depth0;
                deltay = depth2 - depth0;
                */
                
                normalDelta = normalize(cross(vec3(1, 0, deltax), vec3(0, 1, deltay))) - vec3(0,0,1);
                normal = normalize(vTransformedNormal.xyz + normalDelta);
                
                texCoord = vTextureCoord ;//- eyeUV.xy * (depth[0][0] * 0.02) / eyeUV.z;
            }
            else
            {
                normal = normalize(vTransformedNormal.xyz);
            }
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
                vec4 texColor = texture2D(uSampler,texCoord);
                gl_FragColor = vec4(texColor.rgb*lighting,  texColor.a);
            } else {
                gl_FragColor = vec4(origColor,vAmbientColor.a);
                // gl_FragColor = vec4(vAmbientColor.rgb*lighting,1.0);
            }
            
            const float LOG2 = 1.442695;
            float z = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = exp2( -0.001 * 
                               z * 
                               z * 
                               LOG2 );
            fogFactor = clamp(fogFactor, 0.0, 1.0);
            
            gl_FragColor = mix(vec4(1.0,1.0,1.0,0.8), gl_FragColor, fogFactor );
            
            gl_FragColor = vec4((normal.xyz + vec3(1,1,1))*0.5,1);
        }
        `;

    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    gl.useProgram(shaderProgram);

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
            viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            usePointLighting: gl.getUniformLocation(shaderProgram, 'uUsePointLighting'),
            useTexture: gl.getUniformLocation(shaderProgram, 'uUseTexture'),
            useDepthTexture: gl.getUniformLocation(shaderProgram, 'uUseDepthTexture'),
            //depthScale: gl.getUniformLocation(shaderProgram, 'uDepthScale'),
            materialShiness: gl.getUniformLocation(shaderProgram, 'uMaterialShiness'),
            eyePosition: gl.getUniformLocation(shaderProgram, 'uEyePosition'),
            eyeFacePoint: gl.getUniformLocation(shaderProgram, 'uEyeFacePoint'),
            eyeUp: gl.getUniformLocation(shaderProgram, 'uEyeUp'),
            useBillboard: gl.getUniformLocation(shaderProgram, 'uUseBillboard'),
            billboardPosition: gl.getUniformLocation(shaderProgram, 'uBillboardPosition'),
            billboardSize: gl.getUniformLocation(shaderProgram, 'uBillboardSize'),
            lightNum: gl.getUniformLocation(shaderProgram, 'uLightNum'),
            pointLightingLocation: gl.getUniformLocation(shaderProgram, 'uPointLightingLocation'),
            pointLightingSpecularColor: gl.getUniformLocation(shaderProgram, 'uPointLightingSpecularColor'),
            pointLightingDiffuseColor: gl.getUniformLocation(shaderProgram, 'uPointLightingDiffuseColor'),
            ambientLight: gl.getUniformLocation(shaderProgram, 'uAmbientLight'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            uDepthSampler: gl.getUniformLocation(shaderProgram, 'uDepthSampler')
        },
    };
}

function getMatrixInfo(){
    return {
        eye: vec3.fromValues(0.0, 0.0, 5.0),
        // eye:[0.0,0.0,0.5],
        at: vec3.fromValues(0.0, 0.0, 0.0),
        up: vec3.fromValues(0.0, 1.0, 0.0),
        bPersp: true,
        fov: 45.0,
        near: 0.1,
        far: 100.0,
        width: 10.0,
        height: 10.0,
        currentAngle: [0.0, 0.0],
        projectionMatrix: mat4.create(),
        viewMatrix: mat4.create()
    };
}

function display() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    const programInfo = getProgramInfo(gl);
    let matrixInfo = getMatrixInfo();
    initDocumentHandlers(document, matrixInfo);
    initCanvasHandlers(canvas, matrixInfo);

    function render() {
        //console.log(1)

        //console.log(AmbientLight);
        //console.log(LightSources);
        updateMatrix(gl,canvas,programInfo,matrixInfo) 
        drawScene(gl, programInfo, matrixInfo, AmbientLight, LightSources);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}

function drawScene(gl, programInfo, matrixInfo, ambientLight, lightSources) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //console.log(ObjectPool);
    for (let item in ObjectPool){
        //let object = Object.create(ObjectPool[item].ObjectInfo);
        //object["texture"] = texture1;
        //console.log(ObjectPool[item].ObjectInfo)
        //console.log(programInfo)
        //let object = Object.create(ObjectPool[item].ObjectInfo);
        let object = ObjectPool[item].ObjectInfo;
        //ObjectPool[item].ObjectInfo.texture = texture1;
        //console.log(object);
        switch (ObjectPool[item].type){

            case "cube":
                drawCube(gl, programInfo, matrixInfo, object, ambientLight, lightSources, BufferPool[item]);
                break;
            case "sphere":
                drawSphere(gl, programInfo, matrixInfo, object, ambientLight, lightSources, BufferPool[item]);
                break;
            case "cylinder":
                drawCylinder(gl, programInfo, matrixInfo, object, ambientLight, lightSources, BufferPool[item]);
                break;
            case "cone":
                drawCone(gl, programInfo, matrixInfo, object, ambientLight, lightSources, BufferPool[item]);
                break;
            case "prism":
                drawPrism(gl, programInfo, matrixInfo, object, ambientLight, lightSources, BufferPool[item]);
                break;
            case "trustum":
                drawTrustumOfAPyramid(gl, programInfo, matrixInfo, object, ambientLight, lightSources, BufferPool[item]);
                break;
            case "model":
                //console.log(object);
                if (ObjectPool[item].ObjectInfo.objFile !== null) {
                    objDisplay(gl, programInfo, matrixInfo, object, ambientLight, lightSources, BufferPool[item]);
                }
                break;
            case "particle":
                drawParticle(gl, programInfo, matrixInfo, object, ambientLight, lightSources, BufferPool[item]);
            default:
                break;
        }
    }

}
