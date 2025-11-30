#define TABLE_SIZE 256
int16_t sineTable[TABLE_SIZE];

void buildSineTable() {
  for (int i = 0; i < TABLE_SIZE; i++) {
    float phase = (2.0f * PI * i) / TABLE_SIZE;
    float s = sinf(phase);
    sineTable[i] = (int16_t)(s * 28000.0f);
  }
}
