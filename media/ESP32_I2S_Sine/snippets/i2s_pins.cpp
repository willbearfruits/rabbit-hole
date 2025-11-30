#define I2S_BCLK    26
#define I2S_LRCLK   25
#define I2S_DOUT    22

i2s_pin_config_t pin_config = {
  .bck_io_num   = I2S_BCLK,
  .ws_io_num    = I2S_LRCLK,
  .data_out_num = I2S_DOUT,
  .data_in_num  = I2S_PIN_NO_CHANGE
};
