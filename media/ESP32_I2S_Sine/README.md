# ESP32 I2S Sine Wave (MAX98357A)

Simple ESP32 DevKit example that outputs a **440 Hz sine wave** over I2S
to a MAX98357A I2S DAC/amp module.

## Wiring

**ESP32 DevKit ↔ MAX98357A**

- `GPIO26` → `BCLK` (or `BCK`)
- `GPIO25` → `LRC` / `LRCLK` / `WS`
- `GPIO22` → `DIN`
- `5V`     → `VIN`
- `GND`    → `GND`

Speaker:

- `SPK+` → speaker +
- `SPK-` → speaker −

Use a 4–8 Ω speaker; *do not* connect either speaker terminal to GND.

## How to use

1. Open `ESP32_I2S_Sine.ino` in Arduino IDE (folder name must match).
2. Select your ESP32 board (e.g. **ESP32 Dev Module**).
3. Flash the sketch.
4. You should hear a 440 Hz continuous tone.

## Code snippets

### I2S pin config

```cpp
#define I2S_BCLK    26
#define I2S_LRCLK   25
#define I2S_DOUT    22

i2s_pin_config_t pin_config = {
  .bck_io_num   = I2S_BCLK,
  .ws_io_num    = I2S_LRCLK,
  .data_out_num = I2S_DOUT,
  .data_in_num  = I2S_PIN_NO_CHANGE
};
```

### Sine table generation

```cpp
#define TABLE_SIZE 256
int16_t sineTable[TABLE_SIZE];

void buildSineTable() {
  for (int i = 0; i < TABLE_SIZE; i++) {
    float phase = (2.0f * PI * i) / TABLE_SIZE;
    float s = sinf(phase);
    sineTable[i] = (int16_t)(s * 28000.0f);
  }
}
```

### Streaming the sine wave

```cpp
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
```

## Tweaks

- Change `TONE_FREQUENCY` for different notes.
- Lower the multiplier in `sineTable[i] = (int16_t)(s * 28000.0f);`
  if the output is too loud or clips.
