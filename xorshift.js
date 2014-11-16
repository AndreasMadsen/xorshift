var s = new Uint32Array(4);

function leftShift(write, readL, readU, amount) {
  var m = 0xFFFFFFFF << (32 - amount);
  write[0] = (readL << amount) | ((readU & m) >>> (32 - amount));
  write[1] = readU << amount;
}

function xor(write, read1L, read1U, read2L, read2U) {
  write[0] = read1L ^ read2L;
  write[1] = read1U ^ read2U;
}

function rightShift(write, readL, readU, amount) {
  var m = 0xFFFFFFFF >>> (32 - amount);
  write[0] = readL >>> amount;
  write[1] = (readU >>> amount) | ((readL & m) << (32 - amount));
}

function add(write, read1L, read1U, read2L, read2U) {
   var LSBSum = read1U + read2U;

   write[0] = read1L + read2L + (LSBSum / 2 >>> 31);
   write[1] = LSBSum & 0xFFFFFFFF;
}

s[1] = 1;
s[3] = 2;

var t1 = new Uint32Array(2);
var t2 = new Uint32Array(2);

function xorshift() {
  // uint64_t s1 = s[ 0 ];
  var s1L = s[0], s1U = s[1];
  // const uint64_t s0 = s[ 1 ];
  var s0L = s[2], s0U = s[3];

  // s[ 0 ] = s0;
  s[0] = s0L;
  s[1] = s0U;

  // k1 ^= s1 << 23;
  leftShift(t1, s1L, s1U, 23);
  xor      (t2, s1L, s1U, t1[0], t1[1]);

  // s1 = k1
  s1L = t2[0];
  s1U = t2[1];

  // k2 = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
  xor       (t1, s1L, s1U, s0L, s0U);

  rightShift(t2, s1L, s1U, 17);
  xor       (t1, t1[0], t1[1], t2[0], t2[1]);

  rightShift(t2, s0L, s0U, 26);
  xor       (t1, t1[0], t1[1], t2[0], t2[1]);

  // s[1] = k2
  s[2] = t1[0];
  s[3] = t1[1];

  // return k2 + s0
  add(t2, t1[0], t1[1], s0L, s0U);

  return t2;
}

module.exports = xorshift;
