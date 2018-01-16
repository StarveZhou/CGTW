/*ObjectPool = {
    cubic1: {
        type: "cube",
        ObjectInfo: {
            positions: [
                1, 1, 1,
                1, -1, 1,
                -1, -1, 1,
                -1, 1, 1,],
            indices: [
                0, 1, 2,
                0, 2, 3,
            ],
            transformation: {
                translation: [0.0, 2.0, -1.0],
                scale: [1.0, 1.0, 1.0],
                rotation: {x: 0.0, y: 1.0, z: 0.0}
            },
            textureCoordinates: [
                0, 0,
                1, 0,
                1, 1,
                0, 1,],
            textureIndices: [
                0, 1, 2,
                0, 2, 3,
            ],
            vertexNormals: [
                0.0, 0.0, 1.0,
            ],
            normalIndices: [
                0, 0, 0, 0, 0, 0
            ],
            ambientColor: [0.1, 0.1, 0.1, 1.0],
            diffuseColor: [1.0, 1.0, 1.0, 1.0],
            specularColor: [0.3, 0.3, 0.3, 1.0],
            useBillboard: false,
            useTexture: false,
            useDepthTexture: false,
            texture: null,
            depthTexture: null,
            textureFile: null,
            depthTextureFile: null,
            shiness: 10,
            sideNum: null,
            upBottomRatio: null
            objFile: null,
            particleCenter:[0.0, 0.0, 0.0],
            particleworldSize: 1.0
        }
    },
    cubic2 : {
        type : "sphere",
        ObjectInfo : {
            positions: [
                1, 1, 1,
                1, -1, 1,
                -1, -1, 1,
                -1, 1, 1,],
            indices: [
                0, 1, 2,
                0, 2, 3,
            ],
            transformation: {
                translation: [0.0, 0.0, -1.0],
                scale: [1.0, 1.0, 1.0],
                rotation: {x:0.0, y: 1.0, z: 0.0}
            },
            textureCoordinates: [
                0, 0,
                1, 0,
                1, 1,
                0, 1,],
            textureIndices: [
                0, 1, 2,
                0, 2, 3,
            ],
            vertexNormals: [
                0.0, 0.0, 1.0,
            ],
            normalIndices: [
                0, 0, 0, 0, 0, 0
            ],
            ambientColor: [0.1, 0.1, 0.1, 1.0],
            diffuseColor: [1.0, 1.0, 1.0, 1.0],
            specularColor: [0.3, 0.3, 0.3, 1.0],
            useTexture: false,
            texture: null,
            shiness: 10,
            sideNum: null,
            upBottomRatio: null,
            objFIle: null
        }
    }
};*/


current = null;
ObjectPool = {};
BufferPool = {};
LightSources = [];
AmbientLight = [0.2, 0.2, 0.2];

worldNameList = ["miramar", "siege"];
worldSize = 20;
worldName = "siege";

const canvas = document.querySelector("#glcanvas");
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');



$(function() {
    $('#leftMenu').metisMenu();      
    $('#rightMenu').metisMenu();
    $('.myform').myform();
    let c = $("#glcanvas")[0];
    let gl = c.getContext('webgl');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    display();



});

worldTextureBk = loadTextureFromUrl(gl, "../images/" + worldName + "/" + worldName + "_bk.jpg");
worldTextureFt = loadTextureFromUrl(gl, "../images/" + worldName + "/" + worldName + "_ft.jpg");
worldTextureLf = loadTextureFromUrl(gl, "../images/" + worldName + "/" + worldName + "_lf.jpg");
worldTextureRt = loadTextureFromUrl(gl, "../images/" + worldName + "/" + worldName + "_rt.jpg");
worldTextureUp = loadTextureFromUrl(gl, "../images/" + worldName + "/" + worldName + "_up.jpg");
worldTextureDn = loadTextureFromUrl(gl, "../images/" + worldName + "/" + worldName + "_dn.jpg");


ObjectPool['world-bk'] = {
    type : "poly",
    ObjectInfo : {
        positions: [
            worldSize, worldSize, -worldSize,
            worldSize, -worldSize, -worldSize,
            -worldSize, -worldSize, -worldSize,
            -worldSize, worldSize, -worldSize,],
        indices: [
            0, 1, 2,
            0, 2, 3,
        ],
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates: [
            0, 1,
            1, 1,
            1, 0,
            0, 0,],
        textureIndices: [
            1, 2, 3,
            1, 3, 0,
        ],
        vertexNormals: [
            -1, -1, 1,
            -1, 1, 1,
            1, 1, 1,
            1, -1, 1,
        ],
        normalIndices: [
            0, 1, 2,
            0, 2, 3,
        ],
        ambientColor: [1.0, 1.0, 1.0, 1.0],
        diffuseColor: [0.0, 0.0, 0.0, 0.0],
        specularColor: [0.0, 0.0, 0.0, 0.0],
        useTexture: true,
        texture: worldTextureBk,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null,
        objFIle: null
    }
};

ObjectPool['world-ft'] = {
    type : "poly",
    ObjectInfo : {
        positions: [
            worldSize, worldSize, worldSize,
            worldSize, -worldSize, worldSize,
            -worldSize, -worldSize, worldSize,
            -worldSize, worldSize, worldSize,],
        indices: [
            0, 1, 2,
            0, 2, 3,
        ],
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates: [
            1, 1,
            0, 1,
            0, 0,
            1, 0,],
        textureIndices: [
            1, 2, 3,
            1, 3, 0,
        ],
        vertexNormals: [
            -1, -1, -1,
            -1, 1, -1,
            1, 1, -1,
            1, -1, -1,
        ],
        normalIndices: [
            0, 1, 2,
            0, 2, 3
        ],
        ambientColor: [1.0, 1.0, 1.0, 1.0],
        diffuseColor: [0.0, 0.0, 0.0, 0.0],
        specularColor: [0.0, 0.0, 0.0, 0.0],
        useTexture: true,
        texture: worldTextureFt,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null,
        objFIle: null
    }
};

ObjectPool['world-up'] = {
    type : "poly",
    ObjectInfo : {
        positions: [
            -worldSize, worldSize, -worldSize,
            worldSize, worldSize, -worldSize,
            worldSize, worldSize, worldSize,
            -worldSize, worldSize, worldSize,],
        indices: [
            0, 1, 2,
            0, 2, 3,
        ],
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates: [
            1, 1,
            0, 1,
            0, 0,
            1, 0,],
        textureIndices: [
            1, 2, 3,
            1, 3, 0,
        ],
        vertexNormals: [
            1, -1, 1,
            -1, -1, 1,
            -1, -1, -1,
            1, -1, -1,
        ],
        normalIndices: [
            0, 1, 2,
            0, 2, 3,
        ],
        ambientColor: [1.0, 1.0, 1.0, 1.0],
        diffuseColor: [0.0, 0.0, 0.0, 0.0],
        specularColor: [0.0, 0.0, 0.0, 0.0],
        useTexture: true,
        texture: worldTextureUp,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null,
        objFIle: null
    }
};

ObjectPool['world-dn'] = {
    type : "poly",
    ObjectInfo : {
        positions: [
            -worldSize, -worldSize, -worldSize,
            worldSize, -worldSize, -worldSize,
            worldSize, -worldSize, worldSize,
            -worldSize, -worldSize, worldSize,],
        indices: [
            0, 1, 2,
            0, 2, 3,
        ],
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates: [
            1, 0,
            0, 0,
            0, 1,
            1, 1,],
        textureIndices: [
            1, 2, 3,
            1, 3, 0,
        ],
        vertexNormals: [
            1, 1, 1,
            -1, 1, 1,
            -1, 1, -1,
            1, 1, -1,
        ],
        normalIndices: [
            0, 1, 2,
            0, 2, 3,
        ],
        ambientColor: [1.0, 1.0, 1.0, 1.0],
        diffuseColor: [0.0, 0.0, 0.0, 0.0],
        specularColor: [0.0, 0.0, 0.0, 0.0],
        useTexture: true,
        texture: worldTextureDn,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null,
        objFIle: null
    }
};

ObjectPool['world-lf'] = {
    type : "poly",
    ObjectInfo : {
        positions: [
            -worldSize, worldSize, worldSize,
            -worldSize, -worldSize, worldSize,
            -worldSize, -worldSize, -worldSize,
            -worldSize, worldSize, -worldSize,],
        indices: [
            0, 1, 2,
            0, 2, 3,
        ],
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates: [
            1, 1,
            0, 1,
            0, 0,
            1, 0,],
        textureIndices: [
            1, 2, 3,
            1, 3, 0,
        ],
        vertexNormals: [
            1, -1, -1,
            1, 1, -1,
            1, 1, 1,
            1, -1, 1,
        ],
        normalIndices: [
            0, 1, 2,
            0, 2, 3,
        ],
        ambientColor: [1.0, 1.0, 1.0, 1.0],
        diffuseColor: [0.0, 0.0, 0.0, 0.0],
        specularColor: [0.0, 0.0, 0.0, 0.0],
        useTexture: true,
        texture: worldTextureLf,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null,
        objFIle: null
    }
};

ObjectPool['world-rt'] = {
    type : "poly",
    ObjectInfo : {
        positions: [
            worldSize, worldSize, -worldSize,
            worldSize, -worldSize, -worldSize,
            worldSize, -worldSize, worldSize,
            worldSize, worldSize, worldSize,],
        indices: [
            0, 1, 2,
            0, 2, 3,
        ],
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates: [
            1, 1,
            0, 1,
            0, 0,
            1, 0,],
        textureIndices: [
            1, 2, 3,
            1, 3, 0,
        ],
        vertexNormals: [
            -1, -1, 1,
            -1, 1, 1,
            -1, 1, -1,
            -1, -1, -1,
        ],
        normalIndices: [
            0, 1, 2,
            0, 2, 3,
        ],
        ambientColor: [1.0, 1.0, 1.0, 1.0],
        diffuseColor: [0.0, 0.0, 0.0, 0.0],
        specularColor: [0.0, 0.0, 0.0, 0.0],
        useTexture: true,
        texture: worldTextureRt,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null,
        objFIle: null
    }
};


BufferPool['world-bk'] = initBuffers(gl, ObjectPool['world-bk'].ObjectInfo);
BufferPool['world-ft'] = initBuffers(gl, ObjectPool['world-ft'].ObjectInfo);
BufferPool['world-up'] = initBuffers(gl, ObjectPool['world-up'].ObjectInfo);
BufferPool['world-dn'] = initBuffers(gl, ObjectPool['world-dn'].ObjectInfo);
BufferPool['world-lf'] = initBuffers(gl, ObjectPool['world-lf'].ObjectInfo);
BufferPool['world-rt'] = initBuffers(gl, ObjectPool['world-rt'].ObjectInfo);

