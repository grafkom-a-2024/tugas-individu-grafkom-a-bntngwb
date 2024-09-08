"use strict";

function main() {
    // Get a WebGL context
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // Setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    gl.useProgram(program);

    // Look up where the vertex data needs to go
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // Lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Set geometry (vertices of the "F", "I", and "N")
    setGeometry(gl);

    var translation = [0, 0];
    var color = [Math.random(), Math.random(), Math.random(), 1];

    drawScene();

    // Draw the scene
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2; // 2 components per iteration
        var type = gl.FLOAT; // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0; // move forward size * sizeof(type) each iteration
        var offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        // Set the resolution
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // Set the color
        gl.uniform4fv(colorLocation, color);

        // Set the translation
        gl.uniform2fv(translationLocation, translation);

        // Draw the geometry
        var primitiveType = gl.TRIANGLES;
        var count = 36; // 6 triangles for "F", 2 for "I", 6 for "N"
        gl.drawArrays(primitiveType, 0, count);
    }
}

// Define the vertices for the letters "F", "I", and "N" using triangles
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // Letter "F" (6 triangles)
            // Left column (2 triangles)
            0, 0,   // Triangle 1
            30, 0,
            0, 150,

            0, 150,   // Triangle 2
            30, 0,
            30, 150,

            // Top rung (2 triangles)
            30, 0,   // Triangle 3
            100, 0,
            30, 30,

            30, 30,   // Triangle 4
            100, 0,
            100, 30,

            // Middle rung (2 triangles)
            30, 60,   // Triangle 5
            67, 60,
            30, 90,

            30, 90,   // Triangle 6
            67, 60,
            67, 90,

            // Letter "I" (2 triangles)
            120, 0,   // Triangle 7
            150, 0,
            120, 150,

            120, 150, // Triangle 8
            150, 0,
            150, 150,

            // Letter "N" (6 triangles)
            // Left side (2 triangles)
            170, 0,   // Triangle 9
            200, 0,
            170, 150,

            170, 150, // Triangle 10
            200, 0,
            200, 150,

            // Diagonal (2 triangles)
            170, 0,   // Triangle 11
            230, 150,
            200, 150,

            170, 0,   // Triangle 12
            200, 0,
            230, 150,

            // Right side (2 triangles)
            230, 0,   // Triangle 13
            260, 0,
            230, 150,

            230, 150, // Triangle 14
            260, 0,
            260, 150,
        ]),
        gl.STATIC_DRAW);
}

main();
