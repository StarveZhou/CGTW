function addItemToObjectPool(name) {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    let mType = ObjectPool[name].type;
    if (mType === "cube"     ||
        mType === "sphere"   ||
        mType === "cylinder" ||
        mType === "cone"     ||
        mType === "prism"    ||
        mType === "trustum"  ||
        mType === "obj"){

        switch (mType){
            case "cube":
                ObjectPool[name].ObjectInfo = createCubeData(ObjectPool[name].ObjectInfo);
                break;
            case "sphere":
                ObjectPool[name].ObjectInfo = createSphereData(ObjectPool[name].ObjectInfo);
                break;
            case "cylinder":
                ObjectPool[name].ObjectInfo = createCylinderData(ObjectPool[name].ObjectInfo);
                break;
            case "cone":
                ObjectPool[name].ObjectInfo = createConeData(ObjectPool[name].ObjectInfo);
                break;
            case "prism":
                ObjectPool[name].ObjectInfo = createPrismData(ObjectPool[name].ObjectInfo);
                break;
            case "trustum":
                ObjectPool[name].ObjectInfo = createTrustumOfAPyramidData(ObjectPool[name].ObjectInfo);
                break;
            default:
                break;
        }

        let buffer = initBuffers(gl, ObjectPool[name].ObjectInfo);
        BufferPool[name] = buffer;
    }
    else if (mType == "light"){
        let lightSource = ObjectPool[name].ObjectInfo;
        lightSource["name"] = name;
        LightSources.concat(lightSource);
    }
}

function removeItemFromObjectPool(name) {
    let mType = ObjectPool[name].type;
    if (mType === "cube"     ||
        mType === "sphere"   ||
        mType === "cylinder" ||
        mType === "cone"     ||
        mType === "prism"    ||
        mType === "trustum"  ||
        mType === "obj"){

        delete BufferPool[name];
        let objName = ObjectPool[name].ObjectInfo.objFile;
        deleteObjFromHtml(objName);
        delete ObjectPool[name];
    }
    else if (mType === "light"){
        for (let i=0; i<LightSources.length; i=i+1){
            if (LightSources[i].name === name){
                LightSources.splice(i, 1);
                break;
            }
        }
    }
}

function refreshItemInObjectPool(name){
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    let mType = ObjectPool[name].type;
    if (mType === "cube"     ||
        mType === "sphere"   ||
        mType === "cylinder" ||
        mType === "cone"     ||
        mType === "prism"    ||
        mType === "trustum"  ||
        mType === "obj"){
        let buffer = initBuffers(gl, ObjectPool[name].ObjectInfo);
        BufferPool[name] = buffer;
    }
    else if (mType === "light"){
        for (let i=0; i<LightSources.length; i=i+1){
            if (LightSources[i].name === name){
                LightSources.splice(i, 1);
                break;
            }
        }

        let lightSource = ObjectPool[name].ObjectInfo;
        lightSource["name"] = name;
        LightSources.concat(lightSource);
    }
    else if (mType === "ambient-light"){
        AmbientLight = ObjectPool[name].ObjectInfo["ambient-light"].slice();
    }
}