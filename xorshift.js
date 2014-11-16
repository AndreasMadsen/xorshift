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
   var LSBSum = readA[1] + readB[1];

   write[0] = readA[0] + readB[0] + (LSBSum / 2 >>> 31);
   write[1] = LSBSum & 0xFFFFFFFF;
}

s[1] = 1;
s[3] = 2;

var t1 = new Uint32Array(2);
var t2 = new Uint32Array(2);

var s1 = new Uint32Array(2);
var s0 = new Uint32Array(2);

function xorshift() {
   // uint64_t s1 = s[ 0 ];
   s1.set(s.subarray(0, 2));
   // const uint64_t s0 = s[ 1 ];
   s0.set(s.subarray(2, 4));

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
