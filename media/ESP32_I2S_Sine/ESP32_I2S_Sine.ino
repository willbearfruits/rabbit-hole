#include <Arduino.h>
#include "driver/i2s.h"

// ---- Pin configuration (matches typical ESP32 DevKit wiring) ----
// MAX98357A connections:
//   BCLK  -> GPIO26
//   LRC   -> GPIO25
//   DIN   -> GPIO22
#define I2S_BCLK    26   // MAX98357A BCLK
#define I2S_LRCLK   25   // MAX98357A LRC / LRCLK / WS
#define I2S_DOUT    22   // MAX98357A DIN

// ---- Audio configuration ----
#define I2S_PORT        I2S_NUM_0
#define SAMPLE_RATE     44100          // 44.1 kHz
#define TONE_FREQUENCY  440.0f        // A4, 440 Hz
#define TABLE_SIZE      256           // Sine table size

int16_t sineTable[TABLE_SIZE];

// ------------------------------------------------
// Build a 16-bit sine wave lookup table
// ------------------------------------------------
void buildSineTable() {
  for (int i = 0; i < TABLE_SIZE; i++) {
    float phase = (2.0f * PI * i) / TABLE_SIZE;
    float s = sinf(phase);
    // 16-bit signed: -32768..32767; keep some headroom
    sineTable[i] = (int16_t)(s * 28000.0f);
  }
}

// ------------------------------------------------
// I2S Setup
// ------------------------------------------------
void setupI2S() {
  // I2S configuration (TX only, 16-bit, stereo frames)
  i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
    .communication_format = (i2s_comm_format_t)(I2S_COMM_FORMAT_I2S | I2S_COMM_FORMAT_I2S_MSB),
    .intr_alloc_flags = 0,
    .dma_buf_count = 8,
    .dma_buf_len = 64,
    .use_apll = false,
    .tx_desc_auto_clear = true,
    .fixed_mclk = 0
  };

  // Pin configuration (BCLK, LRCLK, DATA OUT)
  i2s_pin_config_t pin_config = {
    .bck_io_num = I2S_BCLK,
    .ws_io_num = I2S_LRCLK,
    .data_out_num = I2S_DOUT,
    .data_in_num = I2S_PIN_NO_CHANGE
  };

  // Install and start I2S driver
  i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pin_config);
  // Make sure clock is exactly what we want
  i2s_set_clk(I2S_PORT, SAMPLE_RATE, I2S_BITS_PER_SAMPLE_16BIT, I2S_CHANNEL_STEREO);
}

void setup() {
  delay(1000);  // optional: small delay so serial can attach if you want

  buildSineTable();
  setupI2S();
}

// ------------------------------------------------
// Stream sine wave forever
// ------------------------------------------------
void loop() {
  // We’ll generate a small buffer each loop iteration
  const int frames = 128;                 // frames = stereo samples (L+R)
  int16_t buffer[frames * 2];             // 2 samples per frame (L,R)

  static float phaseIndex = 0.0f;
  float phaseIncrement = (TABLE_SIZE * TONE_FREQUENCY) / (float)SAMPLE_RATE;

  for (int i = 0; i < frames; i++) {
    // Wrap phase index into table range
    if (phaseIndex >= TABLE_SIZE) {
      phaseIndex -= TABLE_SIZE;
    }

    int idx = (int)phaseIndex;
    int16_t sample = sineTable[idx];

    // Stereo: copy same sample to L and R
    buffer[i * 2 + 0] = sample;  // Left
    buffer[i * 2 + 1] = sample;  // Right

    phaseIndex += phaseIncrement;
  }

  size_t bytesWritten = 0;
  i2s_write(I2S_PORT, buffer, sizeof(buffer), &bytesWritten, portMAX_DELAY);
}
