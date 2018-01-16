let item_num = 0;
let model_num = 0;
let light_num = 0;
let particle_num = 0;

function addItem(id)
{
    let type = ObjectPool[id].type;
    if (type === "cube" || type === "sphere" || type == "cylinder" || type === "cone" || type === "prism" || type === "trustum")
    {
        $("#itemList").append("<li id=\"" + id + "\"><a href=\"#form-container\" onclick=\"selectObj('" + id + "')\">" + id + "</a>" +
            "<span class=\"fa fa-times\" onclick=\"removeItem('" + id + "')\"></span></li>");
    }

    /*
    res = $("#itemList>ul #" + id);
    res.find("a")[0].onclick=function(a){
        return function(){
            selectItem(a);
        }
    }(Obj);//通过一个匿名函数（这个匿名函数接受一个参数，接受的参数是Obj，返回一个函数）构造出一个函数

    res.find("span")[0].onclick=function(a){
        return function(){
            removeItem(a);
        }
    }(Obj);
    */
}

function addModel(id)
{
    $("#modelList").append("<li id=\"" + id + "\"><a href=\"#form-container\" onclick=\"selectObj('" + id + "')\">" + id + "</a>" +
        "<span class=\"fa fa-times\" onclick=\"removeModel('" + id + "')\"></span></li>");
}

function addLight(id)
{
    $("#lightList").append("<li id=\"" + id + "\"><a href=\"#form-container\" onclick=\"selectObj('" + id + "')\">" + id + "</a>" +
        "<span class=\"fa fa-times\" onclick=\"removeLight('" + id + "')\"></span></li>");
}

function addParticle(id)
{
    $("#particleList").append("<li id=\"" + id + "\"><a href=\"#form-container\" onclick=\"selectObj('" + id + "')\">" + id + "</a>" +
        "<span class=\"fa fa-times\" onclick=\"removeParticle('" + id + "')\"></span></li>");
}

function selectObj(id)
{
    current = id;
    showForm();
}

function removeItem(id)
{
    let res = $("#itemList").find("#" + id);
    let type = ObjectPool[id].type;
    let obj_info = ObjectPool[id].ObjectInfo;
    if (type === "cube" || type === "sphere" || type === "cylinder" || type == "cone" || type === "prism" ||type === "trustum")
    {
        if (id === current)
        {
            unshowBasicForm();
            current = null;
        }
        delete ObjectPool[id];
        res.remove();
    }
    //res.onclick=null;
}

function removeModel(id)
{
    let res = $("#modelList").find("#" + id);
    if (id === current)
    {
        unshowBasicForm();
        current = null;
    }
    removeItemFromObjectPool(id);
    res.remove();
}

function removeLight(id)
{
    let res = $("#lightList").find("#" + id);
    if (id === current)
    {
        unshowBasicForm();
        current = null;
    }
    removeItemFromObjectPool(id);
    res.remove();
}

function removeParticle(id)
{
    let res = $("#particleList").find("#" + id);
    if (id === current)
    {
        unshowBasicForm();
        current = null;
    }
    removeItemFromObjectPool(id);
    res.remove();
}

//right bar
function create(type)
{
    //const canvas = document.querySelector("#glcanvas");
    //const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    //let tempTexture = loadTexture(gl, '../images/cubetexture.png');

    let Obj = {
        positions: [],
        indices: [],
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates: [],
        textureIndices: [],
        vertexNormals: [],
        normalIndices: [],
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
        upBottomRatio: null,
        objFile: null
    };
    if (type === "cube" || type === "sphere" || type === "cylinder" || type === "cone" ||type === "prism" || type === "trustum")
    {
        item_num++;
        if (type === "prism")
        {
            Obj.sideNum = 3;
        }
        else if (type === "trustum")
        {
            Obj.sideNum = 3;
            Obj.upBottomRatio = 0.5;
        }
        Obj = {type:type, ObjectInfo:Obj};
        ObjectPool[type+item_num] = Obj;
        addItemToObjectPool(type+item_num);
        addItem(type+item_num);
    }
}

function createModel()
{
    //const canvas = document.querySelector("#glcanvas");
    //const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    //let tempTexture = loadTexture(gl, '../images/cubetexture.png');

    let Obj = {
        positions: [],
        indices: [],
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates: [],
        textureIndices: [],
        vertexNormals: [],
        normalIndices: [],
        ambientColor: [0.1, 0.1, 0.1, 1.0],
        diffuseColor: [1.0, 1.0, 1.0, 1.0],
        specularColor: [0.3, 0.3, 0.3, 1.0],
        useBillboard: false,
        useTexture: true,
        texture: null,
        textureFile: null,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null,
        objFile: null
    };

    model_num++;
    Obj = {type:"model", ObjectInfo:Obj};
    ObjectPool["model"+model_num] = Obj;
    addItemToObjectPool("model"+model_num);
    addModel("model"+model_num);
}

function createLight()
{
    let Obj = {
        usePointLighting: true,
        pointLightingLocation: [0, 10, 4],
        pointLightingSpecularColor: [0.5, 0.5, 0.5],
        pointLightingDiffuseColor: [1, 1, 1]
    };

    light_num++;
    Obj = {type:"light", ObjectInfo:Obj};
    ObjectPool["light"+light_num] = Obj;
    addItemToObjectPool("light"+light_num);
    addLight("light"+light_num);
}

function createParticle()
{
    let Obj = {
        positions: [],
        indices: [],
        transformation: {
            translation: [0.0, 0.0, 0.0],
            scale: [1.0, 1.0, 1.0],
            rotation: {x:0.0, y: 0.0, z: 0.0}
        },
        textureCoordinates: [],
        textureIndices: [],
        vertexNormals: [],
        normalIndices: [],
        ambientColor: [0.1, 0.1, 0.1, 1.0],
        diffuseColor: [1.0, 1.0, 1.0, 1.0],
        specularColor: [0.3, 0.3, 0.3, 1.0],
        useBillboard: true,
        useTexture: false,
        texture: null,
        textureFile: null,
        shiness: 10,
        sideNum: null,
        upBottomRatio: null,
        objFile: null,
        particle_num: 100,
        particle_velocity: 1.0,
        particle_size: 0.1,
        lifeTimes:[],
        centerOffsets:[],
        velocities:[]
    };

    particle_num++;
    Obj = {type:"particle", ObjectInfo:Obj};
    ObjectPool["particle"+particle_num] = Obj;
    addItemToObjectPool("particle"+particle_num);
    addParticle("particle"+particle_num);
}
