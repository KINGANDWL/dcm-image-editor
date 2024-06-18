/**
    8位：  2^8 = 2^2(B) 2^3(G) 2^3(R) = 256  (256色)    可以总共显示256种颜色
    16位：2^16 = 2^5(B) 2^6(G) 2^5(R) =  65536    可以总共显示65536种颜色
    24位：2^24 = 2^8(B) 2^8(G) 2^8(R) =  16777216    可以总共显示16777216种颜色
    32位：Alpha透明度 + 24位 
 */


import { PngPixelArray, PngPixelBuffer, BitDepth, FourChannelPixelArray } from './UtilTypes';
import * as PngJs from 'pngjs';
import * as Sharp from "sharp"
import { OutputInfo } from 'sharp';

export class ImageUtils {
    /**
     * 将png像素数组转png图像buffer
     * @param _4ChannelPixelArr 
     * @param width 
     * @param height 
     */
    private static exchangePngPixelArrayToPngPixelBuffer(_4ChannelPixelArr: PngPixelArray, width: number, height: number): PngPixelBuffer {
        let pixelBuffer = Buffer.from(_4ChannelPixelArr);

        let png = new PngJs.PNG({
            width: width,
            height: height,
        });
        png.data = pixelBuffer;
        //转换为png文件buffer
        let pngBuffer = PngJs.PNG.sync.write(png);

        return pngBuffer
    }


    /**
     * 将单通道像素数组，利用位深，映射到4通道像素数组
     * @param _1ChannelPixelArr 4通道像素数组 
     * @param oldBitDepth 旧的位深
     * @param bitDepth 目标位深
     * @param defaultAlpha 默认扩展的alpha通道值（依据源像素数组生成alpha通道）
     */
    static mapperPixelArrToPNGPixelArray_ByBitDepth_1channel(_1ChannelPixelArr: number[], oldBitDepth: BitDepth, bitDepth: BitDepth, extraAlpha: (oldPixel: number, newPixel: number) => number = undefined): FourChannelPixelArray {
        if (typeof (extraAlpha) != "function") {
            extraAlpha = function (oldPixel: number, newPixel: number) {
                return 255;
            }
        }

        // 先分配避免push带来的扩容性能损耗
        let result: FourChannelPixelArray = new Array(_1ChannelPixelArr.length * 4);
        let oldMaxPixel = Math.pow(2, oldBitDepth);
        let targetMaxPixel = Math.pow(2, bitDepth);
        let index = 0;
        for (let i = 0; i < _1ChannelPixelArr.length; i++) {
            // 采用位映射算法来做位深计算
            //@ts-ignore
            result[index] = ((_1ChannelPixelArr[i] * targetMaxPixel) / oldMaxPixel).toFixed(0) * 1;
            result[index + 1] = result[index];
            result[index + 2] = result[index];
            result[index + 3] = extraAlpha(_1ChannelPixelArr[i], result[index]);
            index += 4;
        }
        return result;
    }

    /**
     * 利用位深映射4通道像素数组
     * @param _4ChannelPixelArr 4通道像素数组
     * @param oldBitDepth 旧的位深
     * @param bitDepth 目标位深
     * @param newArray 是否创建新数组（false则修改源数组-目的是节约内存）
     */
    static mapperPixelArrToPNGPixelArray_ByBitDepth_4channel(_4ChannelPixelArr: FourChannelPixelArray, oldBitDepth: BitDepth, bitDepth: BitDepth, newArray: boolean = true): FourChannelPixelArray {
        // 先分配避免push带来的扩容性能损耗
        let result: FourChannelPixelArray = _4ChannelPixelArr;
        if (newArray === true) {
            result = new Array(_4ChannelPixelArr.length);
        }
        let oldMaxPixel = Math.pow(2, oldBitDepth);
        let targetMaxPixel = Math.pow(2, bitDepth);
        let index = 0;
        for (let i = 0; i < _4ChannelPixelArr.length; i++) {
            // 采用位映射算法来做位深计算
            //@ts-ignore
            result[index] = ((_4ChannelPixelArr[i] * targetMaxPixel) / oldMaxPixel).toFixed(0) * 1;
            result[index + 1] = result[index];
            result[index + 2] = result[index];
            result[index + 3] = result[index];
            index += 4;
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
    static toPngSharp(_4ChannelPixelArr: PngPixelArray, config: {
        width: number,
        height: number,
        // 图像压缩等级
        compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
    }) {
        if (isNaN(config.compressionLevel)) { config.compressionLevel = 0; }
        if (config.compressionLevel < 0 || config.compressionLevel > 9) { config.compressionLevel = 0; }

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
    static toJpeSharpg(_4ChannelPixelArr: PngPixelArray, config: {
        width: number,
        height: number,
        // 图像质量（1-100）
        quality?: number,
    }) {
        if (isNaN(config.quality)) { config.quality = 100; }
        if (config.quality < 1 || config.quality > 100) { config.quality = 100; }

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
    static toTiffSharp(_4ChannelPixelArr: PngPixelArray, config: {
        width: number,
        height: number,
        quality?: number,
    }) {
        if (isNaN(config.quality)) { config.quality = 100; }
        if (config.quality < 1 || config.quality > 100) { config.quality = 100; }

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
    static toBmpSharp(_4ChannelPixelArr: PngPixelArray, config: {
        width: number,
        height: number,
    }) {
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
    static async saveAsPng(_4ChannelPixelArr: PngPixelArray, dir: string, filename: string, config: {
        width: number,
        height: number,
        // 图像压缩等级
        compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
    }): Promise<OutputInfo> {
        return ImageUtils.toPngSharp(_4ChannelPixelArr, config).toFile(`${dir}/${filename}.png`);
    }
    /**
     * 4通道像素数组存储为jpeg
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] ) 
     * @param dir 目录
     * @param filename 文件名 (不包含.jpeg)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static async saveAsJpeg(_4ChannelPixelArr: PngPixelArray, dir: string, filename: string, config: {
        width: number,
        height: number,
        // 图像质量（1-100）
        quality?: number,
    }): Promise<OutputInfo> {
        return ImageUtils.toJpeSharpg(_4ChannelPixelArr, config).toFile(`${dir}/${filename}.jpg`);
    }
    /**
     * 4通道像素数组存储为tiff
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] ) 
     * @param dir 目录
     * @param filename 文件名 (不包含.tiff)
     * @param config 宽度、高度、图像质量（1-100），位深 (1,2,4,8)
     */
    static async saveAsTiff(_4ChannelPixelArr: PngPixelArray, dir: string, filename: string, config: {
        width: number,
        height: number,
        quality?: number,
    }): Promise<OutputInfo> {
        return ImageUtils.toTiffSharp(_4ChannelPixelArr, config).toFile(`${dir}/${filename}.tiff`);
    }
    /**
     * 4通道像素数组存储为bmp
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] ) 
     * @param dir 目录
     * @param filename 文件名 (不包含.bmp)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static saveAsBmp(_4ChannelPixelArr: PngPixelArray, dir: string, filename: string, config: {
        width: number,
        height: number,
    }): Promise<OutputInfo> {
        return ImageUtils.toBmpSharp(_4ChannelPixelArr, config).toFile(`${dir}/${filename}.bmp`);
    }


    ////////////////////////////


    /**
     * 4通道像素数组转为png二进制文件数据
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] ) 
     * @param dir 目录
     * @param filename 文件名 (不包含.png)
     * @param config 宽度、高度、压缩等级
     */
    static async toPngBin(_4ChannelPixelArr: PngPixelArray, config: {
        width: number,
        height: number,
        // 图像压缩等级
        compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
    }): Promise<Buffer> {
        return new Promise((_res, _rej) => {
            ImageUtils.toPngSharp(_4ChannelPixelArr, config).toBuffer((err, buff, oInfo) => {
                if (err) { return _rej(err) }
                return _res(buff);
            });
        })
    }
    /**
     * 4通道像素数组转为jpeg二进制文件数据
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] ) 
     * @param dir 目录
     * @param filename 文件名 (不包含.jpeg)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static async toJpegBin(_4ChannelPixelArr: PngPixelArray, config: {
        width: number,
        height: number,
        // 图像质量（1-100）
        quality?: number,
    }): Promise<Buffer> {
        return new Promise((_res, _rej) => {
            ImageUtils.toJpeSharpg(_4ChannelPixelArr, config).toBuffer((err, buff, oInfo) => {
                if (err) { return _rej(err) }
                return _res(buff);
            });
        })
    }
    /**
     * 4通道像素数组转为tiff二进制文件数据
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] ) 
     * @param dir 目录
     * @param filename 文件名 (不包含.tiff)
     * @param config 宽度、高度、图像质量（1-100），位深 (1,2,4,8)
     */
    static async toTiffBin(_4ChannelPixelArr: PngPixelArray, config: {
        width: number,
        height: number,
        quality?: number,
    }): Promise<Buffer> {
        return new Promise((_res, _rej) => {
            ImageUtils.toTiffSharp(_4ChannelPixelArr, config).toBuffer((err, buff, oInfo) => {
                if (err) { return _rej(err) }
                return _res(buff);
            });
        })
    }
    /**
     * 4通道像素数组转为bmp二进制文件数据
     * @param _4ChannelPixelArr 4通道像素数组( rgba[ ] ) 
     * @param dir 目录
     * @param filename 文件名 (不包含.bmp)
     * @param config 宽度、高度、图像质量（1-100）
     */
    static async toBmpBin(_4ChannelPixelArr: PngPixelArray, config: {
        width: number,
        height: number,
    }): Promise<Buffer> {
        return new Promise((_res, _rej) => {
            ImageUtils.toBmpSharp(_4ChannelPixelArr, config).toBuffer((err, buff, oInfo) => {
                if (err) { return _rej(err) }
                return _res(buff);
            });
        })
    }
}

