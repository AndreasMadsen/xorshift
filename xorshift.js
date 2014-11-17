var s = [0, 0, 0, 0];

function leftShift(write, readU, readL, amount) {
  var m = 0xFFFFFFFF << (32 - amount);
  write[0] = (readU << amount) | ((readL & m) >>> (32 - amount));
  write[1] = readL << amount;
}

function xor(write, read1U, read1L, read2U, read2L) {
  write[0] = read1U ^ read2U;
  write[1] = read1L ^ read2L;
}

function rightShift(write, readU, readL, amount) {
  var m = 0xFFFFFFFF >>> (32 - amount);
  write[0] = readU >>> amount;
  write[1] = (readL >>> amount) | ((readU & m) << (32 - amount));
}

function add(write, read1U, read1L, read2U, read2L) {
   var sumL = (read1L >>> 0) + (read2L >>> 0);

   write[0] = (read1U + read2U + (sumL / 2 >>> 31)) >>> 0;
   write[1] = sumL >>> 0;
}

s[1] = 1;
s[3] = 2;

var t1 = [0, 0];
var t2 = [0, 0];

function xorshift() {
  // Lint64_t s1 = s[ 0 ];
  var s1U = s[0], s1L = s[1];
  // const Lint64_t s0 = s[ 1 ];
  var s0U = s[2], s0L = s[3];

  // s[ 0 ] = s0;
  s[0] = s0U;
  s[1] = s0L;

  // k1 ^= s1 << 23;
  leftShift(t1, s1U, s1L, 23);
  xor      (t2, s1U, s1L, t1[0], t1[1]);

  // s1 = k1
  s1U = t2[0];
  s1L = t2[1];

  // k2 = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
  xor       (t1, s1U, s1L, s0U, s0L);

  rightShift(t2, s1U, s1L, 17);
  xor       (t1, t1[0], t1[1], t2[0], t2[1]);

  rightShift(t2, s0U, s0L, 26);
  xor       (t1, t1[0], t1[1], t2[0], t2[1]);

  // s[1] = k2
  s[2] = t1[0];
  s[3] = t1[1];

  // retLrn k2 + s0
  add(t2, t1[0], t1[1], s0U, s0L);

  return t2;
}

module.exports = xorshift;
