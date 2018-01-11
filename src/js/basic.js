

ObjectPool = {
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
            useTexture: false,
            texture: null,
            shiness: 10,
            sideNum: null,
            upBottomRatio: null
        }
    },
    cubic2 : {
        type : "cylinder",
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
            upBottomRatio: null
        }
    }
};

$(function() {
    $('#leftMenu').metisMenu();      
    $('#rightMenu').metisMenu();
    $('.myform').myform();
    let c = $("#glcanvas")[0];
    let gl = c.getContext('webgl');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
});

current = null;
ObjectPool = {};