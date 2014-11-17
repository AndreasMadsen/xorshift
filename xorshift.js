
// uint64_t s = [0, 0]
var state0U = 0, state0L = 0, state1U = 0, state1L = 0;

// s = [1, 2]
state0L = 1;
state1L = 2;

function xorshift() {
  // uint64_t s1 = s[0]
  var s1U = state0U, s1L = state0L;
  // uint64_t s0 = s[1]
  var s0U = state1U, s0L = state1L;

  // s[0] = s0
  state0U = s0U;
  state0L = s0L;

  // - t1 = [0, 0]
  var t1U = 0, t1L = 0;
  // - t2 = [0, 0]
  var t2U = 0, t2L = 0;

  // s1 ^= s1 << 23;
  // :: t1 = s1 << 23
  var a1 = 23;
  var m1 = 0xFFFFFFFF << (32 - a1);
  t1U = (s1U << a1) | ((s1L & m1) >>> (32 - a1));
  t1L = s1L << a1;
  // :: s1 = s1 ^ t1
  s1U = s1U ^ t1U;
  s1L = s1L ^ t1L;

  // t1 = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
  // :: t1 = s1 ^ s0
  t1U = s1U ^ s0U;
  t1L = s1L ^ s0L;
  // :: t2 = s1 >> 17
  var a2 = 17;
  var m2 = 0xFFFFFFFF >>> (32 - a2);
  t2U = s1U >>> a2;
  t2L = (s1L >>> a2) | ((s1U & m2) << (32 - a2));
  // :: t1 = t1 ^ t2
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;
  // :: t2 = s0 >> 26
  var a3 = 26;
  var m3 = 0xFFFFFFFF >>> (32 - a3);
  t2U = s0U >>> a3;
  t2L = (s0L >>> a3) | ((s0U & m3) << (32 - a3));
  // :: t1 = t1 ^ t2
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;

  // s[1] = t1
  state1U = t1U;
  state1L = t1L;

  // return t1 + s0
  // :: t2 = t1 + s0
  var sumL = (t1L >>> 0) + (s0L >>> 0);
  t2U = (t1U + s0U + (sumL / 2 >>> 31)) >>> 0;
  t2L = sumL >>> 0;
  // :: ret t2
  return [t2U, t2L];
}

module.exports = xorshift;
 module.exports.setSeed = function(seed1, seed2) {
   s[0] = seed1[0];
   s[1] = seed1[1];
   s[2] = seed2[0];
   s[3] = seed2[1];

   return xorshift;
};
 module.exports.random = function() {
   var r = xorshift();
   //             2^32                 2^64
   return (r[0] * 4294967296 + r[1]) / 18446744073709552000;
};
