const int frames = 128;
int16_t buffer[frames * 2];
static float phaseIndex = 0.0f;

void loop() {
  float phaseIncrement = (TABLE_SIZE * TONE_FREQUENCY) / (float)SAMPLE_RATE;

  for (int i = 0; i < frames; i++) {
    if (phaseIndex >= TABLE_SIZE) phaseIndex -= TABLE_SIZE;
    int idx = (int)phaseIndex;
    int16_t sample = sineTable[idx];
    buffer[i * 2 + 0] = sample; // L
    buffer[i * 2 + 1] = sample; // R
    phaseIndex += phaseIncrement;
  }

  size_t bytesWritten;
  i2s_write(I2S_PORT, buffer, sizeof(buffer), &bytesWritten, portMAX_DELAY);
}
