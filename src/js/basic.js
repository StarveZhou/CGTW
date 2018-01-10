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