
var s = new Uint32Array(4);

function leftShift(read, write, amount) {
  var s0 = read[0];
  var s1 = read[1];

  var m = 0xFFFFFFFF << (32 - amount);
  write[0] = (s0 << amount) | ((s1 & m) >>> (32 - amount));
  write[1] = s1 << amount;
}

function xor(readA, readB, write) {
  write[0] = readA[0] ^ readB[0];
  write[1] = readA[1] ^ readB[1];
}

function rightShift(read, write, amount) {
  var s0 = read[0];
  var s1 = read[1];

  var m = 0xFFFFFFFF >>> (32 - amount);
  write[1] = (s1 >>> amount) | ((s0 & m) << (32 - amount));
  write[0] = s0 >>> amount;
}

function add(readA, readB, write) {
  var readA16 = new Uint16Array(readA.buffer);
  var readB16 = new Uint16Array(readB.buffer);
  var write16 = new Uint16Array(write.buffer);

  var a00 = readA16[2];
  var a01 = readA16[3];
  var a10 = readA16[0];
  var a11 = readA16[1];

  var b00 = readB16[2];
  var b01 = readB16[3];
  var b10 = readB16[0];
  var b11 = readB16[1];

  c00 = a00 + b00;
  c01 = a01 + b01 + (c00 >>> 16);
  c10 = a10 + b10 + (c01 >>> 16);
  c11 = a11 + b11 + (c10 >>> 16);

  write16[2] = c00;
  write16[3] = c01;
  write16[0] = c10;
  write16[1] = c11;
}

s[1] = 1;
s[3] = 2;

function xorshift() {
  var t1 = new Uint32Array(2);
  var t2 = new Uint32Array(2);

  // uint64_t s1 = s[ 0 ];
  var s1 = new Uint32Array(s.subarray(0, 2));

  // const uint64_t s0 = s[ 1 ];
  var s0 = new Uint32Array(s.subarray(2, 4));

  // s[ 0 ] = s0;
  s[0] = s0[0];
  s[1] = s0[1];

  // s1 ^= s1 << 23;
  leftShift(s1, t1, 23);
  xor(s1, t1, s1);

  // k = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
  xor(s1, s0, t1);
  rightShift(s1, t2, 17);
  xor(t1, t2, t1);
  rightShift(s0, t2, 26);
  xor(t1, t2, t1);

  // s[1] = k
  s[2] = t1[0];
  s[3] = t1[1];

  // return k + s0
  add(t1, s0, t2);

  return t2;
}

module.exports = xorshift;
