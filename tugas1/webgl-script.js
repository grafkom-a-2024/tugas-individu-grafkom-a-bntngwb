"use strict";

function fetchShader(url) {
    return fetch(url)
        .then(response => response.text());
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function main() {
    // Ambil konteks WebGL
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // Ambil shader dari file
    Promise.all([
        fetchShader('vertex-shader-2d.vs'),
        fetchShader('fragment-shader-2d.fs')
    ]).then(([vertexShaderSource, fragmentShaderSource]) => {
        // Setup program GLSL
        var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return;
        }

        // Program shader siap
        gl.useProgram(program);

        // Set atribut dan uniform
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        var colorUniformLocation = gl.getUniformLocation(program, "u_color");

        // Buat buffer posisi
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Resize canvas
        gl.canvas.width = gl.canvas.clientWidth;
        gl.canvas.height = gl.canvas.clientHeight;

        // Atur viewport
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Bersihkan canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Aktifkan atribut
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // Set resolusi
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // Gambar 50 kotak acak dengan warna acak
        for (var i = 0; i < 50; ++i) {
            setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
            gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    });
}

// Mengembalikan bilangan bulat acak dari 0 hingga range - 1
function randomInt(range) {
    return Math.floor(Math.random() * range);
}

// Mengisi buffer dengan nilai yang mendefinisikan sebuah kotak
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}

main();
