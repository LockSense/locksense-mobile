export const IMG_WIDTH = 224;
export const IMG_HEIGHT = 224;
const NUM_CHANNELS = 3;

function makeArray<T>(length: number): T[] {
  return Array.from(Array(length));
}

function makeRGBArray(width: number, height: number, channels: number): number[][][] {
  return makeArray(height).map(() => makeArray(width).map(() => makeArray(channels)));
}

export function convertToRGBArray(imageData: Uint8ClampedArray, width: number, height: number) {
  const rgbData = makeRGBArray(width, height, NUM_CHANNELS);
  imageData.forEach((value, index) => {
    const channelId = index % 4;
    if (channelId === 3) {
      // Alpha channel - do nothing
      return;
    }
    // Add to R/G/B channel
    const indexInChannel = Math.floor(index / 4);
    const row = Math.floor(indexInChannel / width);
    const column = indexInChannel % width;

    rgbData[row][column][channelId] = value;
  });
  return rgbData;
}
