$(function() {
    $('#leftMenu').metisMenu();      
    $('#rightMenu').metisMenu();
    var c = $("#glcanvas")[0];
    var gl = c.getContext('webgl');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
});