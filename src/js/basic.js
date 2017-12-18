onload = function() {
    var c = document.getElementById("glcanvas");
    c.width = window.innerWidth*0.8; c.height = window.innerHeight*0.82;
    var gl = c.getContext('webgl');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};