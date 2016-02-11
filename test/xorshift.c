#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>

uint64_t s[16];
int p;

uint64_t xorshift128plus(void) {
    uint64_t s1 = s[0];
    const uint64_t s0 = s[1];
    s[0] = s0;
    s1 ^= s1 << 23;
    s[1] = s1 ^ s0 ^ (s1 >> 17) ^ (s0 >> 26);
    return s[1] + s0;
}

uint64_t xorshift1024star(void) {
    const uint64_t s0 = s[p];
    uint64_t s1 = s[p = (p + 1) & 15];
    s1 ^= s1 << 31;
    s[p] = s1 ^ s0 ^ (s1 >> 11) ^ (s0 >> 30);
    return s[p] * UINT64_C(1181783497276652981);
}

typedef uint64_t (*xorshift_function)(void);

int main(int argc, char *argv[]) {
    if (argc == 1) {
        printf("Expected PRNG name as first argument: xorshift128plus or xorshift1024star\n");
        return 1;
    }

    xorshift_function xorshift;
    int count;

    if (strcmp(argv[1], "xorshift128plus") == 0) {
        if (argc < 5) {
            printf("4 arguments required, %d found\n", argc - 1);
            return 1;
        }

        xorshift = xorshift128plus;
        s[0] = strtoull(argv[2], NULL, 16);
        s[1] = strtoull(argv[3], NULL, 16);
        count = atoi(argv[4]);
    } else if (strcmp(argv[1], "xorshift1024star") == 0) {
        if (argc < 20) {
            printf("19 arguments required, %d found\n", argc - 1);
            return 1;
        }

        xorshift = xorshift1024star;
        for (int i = 0; i < 16; ++i) {
            s[i] = strtoull(argv[i + 2], NULL, 16);
        }
        p = atoi(argv[18]);
        count = atoi(argv[19]);
    } else {
        printf("Algorithm not found\n");
        return 1;
    }

    for (; count > 0; --count) {
        printf("%016llx", xorshift());
    }
    printf("\n");

    return 0;
}
