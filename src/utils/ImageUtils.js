"use strict";
/**
    8位：  2^8 = 2^2(B) 2^3(G) 2^3(R) = 256  (256色)    可以总共显示256种颜色
    16位：2^16 = 2^5(B) 2^6(G) 2^5(R) =  65536    可以总共显示65536种颜色
    24位：2^24 = 2^8(B) 2^8(G) 2^8(R) =  16777216    可以总共显示16777216种颜色
    32位：Alpha透明度 + 24位
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUtils = void 0;
const PngJs = require("pngjs");
const Sharp = require("sharp");
class ImageUtils {
    /**
     * 将png像素数组转png图像buffer
     * @param _4ChannelPixelArr
     * @param width
     * @param height
     */
    static exchangePngPixelArrayToPngPixelBuffer(_4ChannelPixelArr, width, height) {
        let pixelBuffer = Buffer.from(_4ChannelPixelArr);
        let png = new PngJs.PNG({
            width: width,
            height: height,
        });
        png.data = pixelBuffer;
        //转换为png文件buffer
        let pngBuffer = PngJs.PNG.sync.write(png);
        return pngBuffer;
    }
    /**
     * 将单通道像素数组，利用位深，映射到4通道像素数组
     * @param _1ChannelPixelArr 4通道像素数组
     * @param oldBitDepth 旧的位深
     * @param bitDepth 目标位深
     * @param defaultAlpha 默认扩展的alpha通道值（依据源像素数组生成alpha通道）
     */
    static mapper1ChannelPixelArrTo4Channel(_1ChannelPixelArr, oldBitDepth, bitDepth, extraAlpha = undefined) {
        if (typeof (extraAlpha) != "function") {
            extraAlpha = null;
        }
        // 先分配避免push带来的扩容性能损耗
        let result = new Array(_1ChannelPixelArr.length * 4);
        let oldMaxPixel = Math.pow(2, oldBitDepth);
        let targetMaxPixel = Math.pow(2, bitDepth);
        let index = 0;
        for (let i = 0; i < _1ChannelPixelArr.length; i++) {
            // 采用位映射算法来做位深计算
            //@ts-ignore
            result[index] = ((_1ChannelPixelArr[i] * targetMaxPixel) / oldMaxPixel).toFixed(0) * 1;
            result[index + 1] = result[index];
            result[index + 2] = result[index];
            result[index + 3] = extraAlpha == null ? 255 : extraAlpha(_1ChannelPixelArr[i], result[index]);
            index += 4;
        }
        return result;
    }
    /**
     * 将单通道像素数组，自动计算最大最小像素，映射到4通道像素数组
     * @param _1ChannelPixelArr 4通道像素数组
     * @param defaultAlpha 默认扩展的alpha通道值（依据源像素数组生成alpha通道）
     */
    static mapper1ChannelPixelArrTo4Channel_auto(_1ChannelPixelArr, extraAlpha = undefined) {
        if (typeof (extraAlpha) != "function") {
            extraAlpha = null;
        }
        // 先分配避免push带来的扩容性能损耗
        let result = new Array(_1ChannelPixelArr.length * 4);
        let maxPixel = 0, minPixel = 65535;
        for (let i = 0; i < _1ChannelPixelArr.length; i++) {
            if (_1ChannelPixelArr[i] > maxPixel)
                maxPixel = _1ChannelPixelArr[i];
            if (_1ChannelPixelArr[i] < minPixel)
                minPixel = _1ChannelPixelArr[i];
        }
        if (maxPixel < minPixel)
            throw new Error(`Unknown err: max < min`);
        let pWidth = maxPixel - minPixel, index = 0;
        for (let i = 0; i < _1ChannelPixelArr.length; i++) {
            //@ts-ignore
            result[index] = Math.floor((_1ChannelPixelArr[i] - minPixel) / pWidth * 255);
            result[index + 1] = result[index];
            result[index + 2] = result[index];
            result[index + 3] = extraAlpha == null ? 255 : extraAlpha(_1ChannelPixelArr[i], result[index]);
            ;
            index += 4;
        }
        return result;
    }
    /**
     * 将16位单通道像素数组映射到4通道png像素数组（不推荐使用，会产生新数组对象占用内存）
     * @param dcmPixelArray
     */
    static mapperDcmPixelArrayToPngPixelArray(dcmPixelArray, toRGBA) {
        let result = new Array(dcmPixelArray.length * 4);
        let index = 0;
        for (let i = 0; i < dcmPixelArray.length; i++) {
            let rgba = toRGBA(i, dcmPixelArray[i]);
            result[index] = rgba.r;
            result[index + 1] = rgba.g;
            result[index + 2] = rgba.b;
            result[index + 3] = rgba.a;
            index += 4;
        }
        return result;
    }
    /**
     * 将4通道png像素数组映射到16位单通道像素数组（不推荐使用，会产生新数组对象占用内存）
     */
    static mapperPngPixelArrayToDcmPixelArray(pngPixelArray, toUInt16Pixel) {
        let result = new Uint16Array(pngPixelArray.length / 4);
        let index = 0;
        for (let i = 0; i < pngPixelArray.length; i += 4) {
            let pixel = toUInt16Pixel(index, pngPixelArray[i], pngPixelArray[i + 1], pngPixelArray[i + 2], pngPixelArray[i + 3]);
            result[index] = pixel;
            index++;
        }
        return result;
    }
    /**
     * 4通道像素数组转为png Sharp
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.png)
     * @param config 宽度、高度、压缩等级
     */
    static toPngSharp(_4ChannelPixelArr, config) {
        if (isNaN(config.compressionLevel)) {
            config.compressionLevel = 0;
        }
        if (config.compressionLevel < 0 || config.compressionLevel > 9) {
            config.compressionLevel = 0;
        }
        let pngBuffer = ImageUtils.exchangePngPixelArrayToPngPixelBuffer(_4ChannelPixelArr, config.width, config.height);
        return Sharp(pngBuffer).png({ compressionLevel: config.compressionLevel });
    }
    /**
     * 4通道像素数组转为jpeg Sharp
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.jpeg)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static toJpeSharpg(_4ChannelPixelArr, config) {
        if (isNaN(config.quality)) {
            config.quality = 100;
        }
        if (config.quality < 1 || config.quality > 100) {
            config.quality = 100;
        }
        let pngBuffer = ImageUtils.exchangePngPixelArrayToPngPixelBuffer(_4ChannelPixelArr, config.width, config.height);
        return Sharp(pngBuffer).jpeg({ quality: config.quality });
    }
    /**
     * 4通道像素数组转为tiff Sharp
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.tiff)
     * @param config 宽度、高度、图像质量（1-100），位深 (1,2,4,8)
     */
    static toTiffSharp(_4ChannelPixelArr, config) {
        if (isNaN(config.quality)) {
            config.quality = 100;
        }
        if (config.quality < 1 || config.quality > 100) {
            config.quality = 100;
        }
        let pngBuffer = ImageUtils.exchangePngPixelArrayToPngPixelBuffer(_4ChannelPixelArr, config.width, config.height);
        // 当前采用的sharp库tiff只支持位深到8
        return Sharp(pngBuffer).tiff({ quality: config.quality, bitdepth: 8 });
    }
    /**
     * 4通道像素数组转为bmp Sharp
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.bmp)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static toBmpSharp(_4ChannelPixelArr, config) {
        let pngBuffer = ImageUtils.exchangePngPixelArrayToPngPixelBuffer(_4ChannelPixelArr, config.width, config.height);
        // bmp保持高质量无压缩
        return Sharp(pngBuffer).jpeg({ quality: 100 });
    }
    //////////////////////////////////////////
    /**
     * 4通道像素数组存储为png
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.png)
     * @param config 宽度、高度、压缩等级
     */
    static async saveAsPng(_4ChannelPixelArr, dir, filename, config) {
        return new Promise((res, rej) => {
            ImageUtils.toPngSharp(_4ChannelPixelArr, config).toFile(`${dir}/${filename}.png`, (err, outInfo) => {
                if (err != null) {
                    return rej(err);
                }
                return res(outInfo);
            });
        });
    }
    /**
     * 4通道像素数组存储为jpeg
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.jpeg)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static async saveAsJpeg(_4ChannelPixelArr, dir, filename, config) {
        return new Promise((res, rej) => {
            ImageUtils.toJpeSharpg(_4ChannelPixelArr, config).toFile(`${dir}/${filename}.jpg`, (err, outInfo) => {
                if (err != null) {
                    return rej(err);
                }
                return res(outInfo);
            });
        });
    }
    /**
     * 4通道像素数组存储为tiff
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.tiff)
     * @param config 宽度、高度、图像质量（1-100），位深 (1,2,4,8)
     */
    static async saveAsTiff(_4ChannelPixelArr, dir, filename, config) {
        return new Promise((res, rej) => {
            ImageUtils.toTiffSharp(_4ChannelPixelArr, config).toFile(`${dir}/${filename}.tiff`, (err, outInfo) => {
                if (err != null) {
                    return rej(err);
                }
                return res(outInfo);
            });
        });
    }
    /**
     * 4通道像素数组存储为bmp
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.bmp)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static saveAsBmp(_4ChannelPixelArr, dir, filename, config) {
        return new Promise((res, rej) => {
            ImageUtils.toBmpSharp(_4ChannelPixelArr, config).toFile(`${dir}/${filename}.bmp`, (err, outInfo) => {
                if (err != null) {
                    return rej(err);
                }
                return res(outInfo);
            });
        });
    }
    ////////////////////////////
    /**
     * 4通道像素数组转为png二进制文件数据
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.png)
     * @param config 宽度、高度、压缩等级
     */
    static async toPngBin(_4ChannelPixelArr, config) {
        return new Promise((_res, _rej) => {
            ImageUtils.toPngSharp(_4ChannelPixelArr, config).toBuffer((err, buff, oInfo) => {
                if (err) {
                    return _rej(err);
                }
                return _res(buff);
            });
        });
    }
    /**
     * 4通道像素数组转为jpeg二进制文件数据
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.jpeg)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static async toJpegBin(_4ChannelPixelArr, config) {
        return new Promise((_res, _rej) => {
            ImageUtils.toJpeSharpg(_4ChannelPixelArr, config).toBuffer((err, buff, oInfo) => {
                if (err) {
                    return _rej(err);
                }
                return _res(buff);
            });
        });
    }
    /**
     * 4通道像素数组转为tiff二进制文件数据
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.tiff)
     * @param config 宽度、高度、图像质量（1-100），位深 (1,2,4,8)
     */
    static async toTiffBin(_4ChannelPixelArr, config) {
        return new Promise((_res, _rej) => {
            ImageUtils.toTiffSharp(_4ChannelPixelArr, config).toBuffer((err, buff, oInfo) => {
                if (err) {
                    return _rej(err);
                }
                return _res(buff);
            });
        });
    }
    /**
     * 4通道像素数组转为bmp二进制文件数据
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] )
     * @param dir 目录
     * @param filename 文件名 (不包含.bmp)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static async toBmpBin(_4ChannelPixelArr, config) {
        return new Promise((_res, _rej) => {
            ImageUtils.toBmpSharp(_4ChannelPixelArr, config).toBuffer((err, buff, oInfo) => {
                if (err) {
                    return _rej(err);
                }
                return _res(buff);
            });
        });
    }
}
exports.ImageUtils = ImageUtils;
