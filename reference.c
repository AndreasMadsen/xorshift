#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

/* The state must be seeded so that it is not everywhere zero. */
uint64_t s[ 2 ];

uint64_t xorshift128plus(void) {
	uint64_t s1 = s[ 0 ];
	const uint64_t s0 = s[ 1 ];
	s[ 0 ] = s0;
	s1 ^= s1 << 23;
	return ( s[ 1 ] = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) ) ) + s0;
}

int main(int argc, char *argv[]) {
  s[0] = 1L;
  s[1] = 2L;

  uint64_t length = 10;
  if (argc > 1) {
    length = atoi(argv[1]);
  }

  if(argc > 3) {
    s[0] = atol(argv[2]);
    s[1] = atol(argv[3]);
  }

  printf("[\n");
  for (int i = 0; i < length; i++) {
    printf("  \"%016llX\"", xorshift128plus());
		if (i < length - 1) {
			printf(",\n");
		}
  }
	printf("\n]\n");
}
