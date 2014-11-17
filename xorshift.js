
var state0 = 0, state1 = 0, state2 = 0, state3 = 0;

state1 = 1;
state3 = 2;

function xorshift() {
  // uint64_t s1 = s[ 0 ];
  var s1U = state0, s1L = state1;
  // const uint64_t s0 = s[ 1 ];
  var s0U = state2, s0L = state3;

  // - t1 = [0, 0]
  var t1U = 0, t1L = 0;
  // - t2 = [0, 0]
  var t2U = 0, t2L = 0;

  // s[ 0 ] = s0;
  state0 = s0U;
  state1 = s0L;

  // k1 ^= s1 << 23;
  // - leftShift(t1, s1U, s1L, 23);
  var a1 = 23;
  var m1 = 0xFFFFFFFF << (32 - a1);
  t1U = (s1U << a1) | ((s1L & m1) >>> (32 - a1));
  t1L = s1L << a1;
  // - xor(t2, s1U, s1L, t1[0], t1[1]);
  t2U = s1U ^ t1U;
  t2L = s1L ^ t1L;

  // s1 = k1
  s1U = t2U;
  s1L = t2L;

  // k2 = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
  // - xor(t1, s1U, s1L, s0U, s0L);
  t1U = s1U ^ s0U;
  t1L = s1L ^ s0L;

  // - rightShift(t2, s1U, s1L, 17);
  var a2 = 17;
  var m2 = 0xFFFFFFFF >>> (32 - a2);
  t2U = s1U >>> a2;
  t2L = (s1L >>> a2) | ((s1U & m2) << (32 - a2));
  // - xor(t1, t1[0], t1[1], t2[0], t2[1]);
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;

  // - rightShift(t2, s0U, s0L, 26);
  var a3 = 26;
  var m3 = 0xFFFFFFFF >>> (32 - a3);
  t2U = s0U >>> a3;
  t2L = (s0L >>> a3) | ((s0U & m3) << (32 - a3));
  // - xor(t1, t1[0], t1[1], t2[0], t2[1]);
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;

  // s[1] = k2
  state2 = t1U;
  state3 = t1L;

  // return k2 + s0
  // - add(t2, t1[0], t1[1], s0U, s0L);
  var sumL = (t1L >>> 0) + (s0L >>> 0);
  t2U = (t1U + s0U + (sumL / 2 >>> 31)) >>> 0;
  t2L = sumL >>> 0;

  return [t2U, t2L];
}

module.exports = xorshift;
