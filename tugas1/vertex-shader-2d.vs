attribute vec2 a_position;
uniform vec2 u_resolution;

void main() {
  // konversi posisi dari piksel ke 0.0 hingga 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // konversi dari 0->1 ke 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // konversi dari 0->2 ke -1->+1 (ruang klip)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
