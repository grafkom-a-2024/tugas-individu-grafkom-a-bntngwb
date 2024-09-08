"use strict";

function main() {
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // Atur program GLSL
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    gl.useProgram(program);

    // Cari lokasi atribut posisi
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // Cari lokasi uniform
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");

    // Buat buffer untuk menyimpan posisi
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Atur geometri (vertex dari "F", "I", dan "N")
    setGeometry(gl);

    var translation = [0, 0];
    var color = [Math.random(), Math.random(), Math.random(), 1];

    drawScene();

    // Gambar adegan
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Beritahu WebGL cara mengubah dari ruang clip ke piksel
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Bersihkan kanvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Beritahu WebGL untuk menggunakan program kami (pasangan shader)
        gl.useProgram(program);

        // Aktifkan atribut
        gl.enableVertexAttribArray(positionLocation);

        // Hubungkan buffer posisi
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Beritahu atribut cara mengambil data dari positionBuffer (ARRAY_BUFFER)
        var size = 2; // 2 komponen per iterasi
        var type = gl.FLOAT; // data adalah float 32bit
        var normalize = false; // tidak normalisasi data
        var stride = 0; // maju ukuran * sizeof(type) setiap iterasi
        var offset = 0; // mulai dari awal buffer
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        // Atur resolusi
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // Atur warna
        gl.uniform4fv(colorLocation, color);

        // Atur translasi
        gl.uniform2fv(translationLocation, translation);

        // Gambar geometri
        var primitiveType = gl.TRIANGLES;
        var count = 36; // 6 segitiga untuk "F", 2 untuk "I", 6 untuk "N"
        gl.drawArrays(primitiveType, 0, count);
    }
}

// Definisikan vertex untuk huruf "F", "I", dan "N" menggunakan segitiga
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // Huruf "F" (6 segitiga)
            // Kolom kiri (2 segitiga)
            0, 0,   // Segitiga 1
            30, 0,
            0, 150,

            0, 150,   // Segitiga 2
            30, 0,
            30, 150,

            // Rung atas (2 segitiga)
            30, 0,   // Segitiga 3
            100, 0,
            30, 30,

            30, 30,   // Segitiga 4
            100, 0,
            100, 30,

            // Rung tengah (2 segitiga)
            30, 60,   // Segitiga 5
            67, 60,
            30, 90,

            30, 90,   // Segitiga 6
            67, 60,
            67, 90,

            // Huruf "I" (2 segitiga)
            120, 0,   // Segitiga 7
            150, 0,
            120, 150,

            120, 150, // Segitiga 8
            150, 0,
            150, 150,

            // Huruf "N" (6 segitiga)
            // Sisi kiri (2 segitiga)
            170, 0,   // Segitiga 9
            200, 0,
            170, 150,

            170, 150, // Segitiga 10
            200, 0,
            200, 150,

            // Diagonal (2 segitiga)
            170, 0,   // Segitiga 11
            230, 150,
            200, 150,

            170, 0,   // Segitiga 12
            200, 0,
            230, 150,

            // Sisi kanan (2 segitiga)
            230, 0,   // Segitiga 13
            260, 0,
            230, 150,

            230, 150, // Segitiga 14
            260, 0,
            260, 150,
        ]),
        gl.STATIC_DRAW);
}

main();
