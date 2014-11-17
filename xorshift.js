var s = [0, 0, 0, 0];

s[1] = 1;
s[3] = 2;

var t1 = [0, 0];
var t2 = [0, 0];

function xorshift() {
  // uint64_t s1 = s[ 0 ];
  var s1U = s[0], s1L = s[1];
  // const uint64_t s0 = s[ 1 ];
  var s0U = s[2], s0L = s[3];

  // s[ 0 ] = s0;
  s[0] = s0U;
  s[1] = s0L;

  // k1 ^= s1 << 23;
  // - leftShift(t1, s1U, s1L, 23);
  var a1 = 23;
  var m1 = 0xFFFFFFFF << (32 - a1);
  t1[0] = (s1U << a1) | ((s1L & m1) >>> (32 - a1));
  t1[1] = s1L << a1;
  // - xor(t2, s1U, s1L, t1[0], t1[1]);
  t2[0] = s1U ^ t1[0];
  t2[1] = s1L ^ t1[1];

  // s1 = k1
  s1U = t2[0];
  s1L = t2[1];

  // k2 = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
  // - xor(t1, s1U, s1L, s0U, s0L);
  t1[0] = s1U ^ s0U;
  t1[1] = s1L ^ s0L;

  // - rightShift(t2, s1U, s1L, 17);
  var a2 = 17;
  var m2 = 0xFFFFFFFF >>> (32 - a2);
  t2[0] = s1U >>> a2;
  t2[1] = (s1L >>> a2) | ((s1U & m2) << (32 - a2));
  // - xor(t1, t1[0], t1[1], t2[0], t2[1]);
  t1[0] = t1[0] ^ t2[0];
  t1[1] = t1[1] ^ t2[1];

  // - rightShift(t2, s0U, s0L, 26);
  var a3 = 26;
  var m3 = 0xFFFFFFFF >>> (32 - a3);
  t2[0] = s0U >>> a3;
  t2[1] = (s0L >>> a3) | ((s0U & m3) << (32 - a3));
  // - xor(t1, t1[0], t1[1], t2[0], t2[1]);
  t1[0] = t1[0] ^ t2[0];
  t1[1] = t1[1] ^ t2[1];

  // s[1] = k2
  s[2] = t1[0];
  s[3] = t1[1];

  // return k2 + s0
  // - add(t2, t1[0], t1[1], s0U, s0L);
  var sumL = (t1[1] >>> 0) + (s0L >>> 0);
  t2[0] = (t1[0] + s0U + (sumL / 2 >>> 31)) >>> 0;
  t2[1] = sumL >>> 0;

  return t2;
}

module.exports = xorshift;
