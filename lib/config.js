/**
 * Options forwarded to http client module
 */
const requestOptions = {
  responseType: 'text',
  responseEncoding: 'utf8',
  maxRedirects: 2,
  timeout: 3000
};

/**
 * Options forwarded to webpage-capture module
 */
const captureOptions = {
  outputType: 'png',
  outputDir: './output'
};

/**
 * Default options used in the scanner script
 */
const defaultOptions = {
  timeout: 3000,
  onlySuccess: false,
  capture: false,
  requestOptions: requestOptions,
  captureOptions: captureOptions
};

module.exports = {
  requestOptions,
  captureOptions,
  defaultOptions
};
