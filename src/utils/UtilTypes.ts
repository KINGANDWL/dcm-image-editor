/**
 * png文件buffer（包含png文件头信息等buffer）
 */
export type PngBuffer = Buffer;
/**
 * png类型的像素数组（即rgba四通道像素数组）
 */
export type PngPixelArray = number[];
/**
 * png像素buffer，即 Buffer.from(PngPixelArray)，也就是只包含4通道的像素的buffer
 */
export type PngPixelBuffer = Buffer;
/**
 * dcm像素数组
 */
export type DcmPixelArray = Uint16Array;
/**
 * 4通道像素数组
 */
export type FourChannelPixelArray = PngPixelArray;


/**
 * 根据单通道像素（灰像素）转4通道像素数
 */
export type PixelToRGBA = (pixel: number) => { r: number, g: number, b: number, a: number }


/**
 * 默认rgba转换函数
*/
export const DefaultPixelToRGBA = function (pixel: number) {
    // 转8位图像
    //@ts-ignore
    let _pixel = (pixel * 256 / 65536).toFixed(0) * 1;
    return {
        r: _pixel,
        g: _pixel,
        b: _pixel,
        a: 255 //透明度拉满
    }
}

/**
 * 位深类型
 */
export type BitDepth = 1 | 2 | 4 | 8 | 16 | 24 | 32;