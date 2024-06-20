"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DcmUtils = void 0;
const fs_extra = require("fs-extra");
const ImageUtils_1 = require("./ImageUtils");
class DcmUtils {
    /**
     * 读取dcm为png像素数组
     * @param dcmJsWrapper dcm包装对象
     */
    static readDcmAsPngPixelArray(dcmJsWrapper) {
        let pixeArr = new Uint16Array(dcmJsWrapper.dataset.PixelData[0]);
        let pngPixeArr = ImageUtils_1.ImageUtils.mapperPixelArrToPNGPixelArray_ByBitDepth_1channel(pixeArr, 16, 8);
        return pngPixeArr;
    }
    /**
     * 将16位像素数组映射到4通道png像素数组（不推荐使用，会产生新数组对象占用内存）
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
     * 将16位像素数组映射到4通道png像素数组（不推荐使用，会产生新数组对象占用内存）
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
    static defaultImageFilename() {
        // 2023-8-24_16-21-56
        return new Date().toLocaleString().replace(/[\/:]/g, "-").replace(/[ ]/g, "_");
    }
    /**
     * 将dcm存为Png
     * @param dcmJsWrapper dcm包装对象
     * @param dir 保存路径
     * @param filename 文件名（不含.Png）
     */
    static async saveAsPng(dcmJsWrapper, dir, filename) {
        let pngPixelArray = DcmUtils.readDcmAsPngPixelArray(dcmJsWrapper);
        if (filename == null) {
            filename = DcmUtils.defaultImageFilename();
        }
        return ImageUtils_1.ImageUtils.saveAsPng(pngPixelArray, dir, filename, {
            width: dcmJsWrapper.dataset.Columns,
            height: dcmJsWrapper.dataset.Rows,
            // 默认dmc转png压缩等级6
            compressionLevel: 6
        });
    }
    /**
     * 将dcm存为Jpeg
     * @param dcmJsWrapper dcm包装对象
     * @param dir 保存路径
     * @param filename 文件名（不含.Jpeg）
     */
    static async saveAsJpeg(dcmJsWrapper, dir, filename) {
        let pngPixelArray = DcmUtils.readDcmAsPngPixelArray(dcmJsWrapper);
        if (filename == null) {
            filename = DcmUtils.defaultImageFilename();
        }
        return ImageUtils_1.ImageUtils.saveAsJpeg(pngPixelArray, dir, filename, {
            width: dcmJsWrapper.dataset.Columns,
            height: dcmJsWrapper.dataset.Rows,
            quality: 100,
        });
    }
    /**
     * 将dcm存为Bmp
     * @param dcmJsWrapper dcm包装对象
     * @param dir 保存路径
     * @param filename 文件名（不含.Bmp）
     */
    static async saveAsBmp(dcmJsWrapper, dir, filename) {
        let pngPixelArray = DcmUtils.readDcmAsPngPixelArray(dcmJsWrapper);
        if (filename == null) {
            filename = DcmUtils.defaultImageFilename();
        }
        return ImageUtils_1.ImageUtils.saveAsBmp(pngPixelArray, dir, filename, {
            width: dcmJsWrapper.dataset.Columns,
            height: dcmJsWrapper.dataset.Rows,
        });
    }
    /**
     * 将dcm存为Tiff
     * @param dcmJsWrapper dcm包装对象
     * @param dir 保存路径
     * @param filename 文件名（不含.Tiff）
     */
    static async saveAsTiff(dcmJsWrapper, dir, filename) {
        let pngPixelArray = DcmUtils.readDcmAsPngPixelArray(dcmJsWrapper);
        if (filename == null) {
            filename = DcmUtils.defaultImageFilename();
        }
        return ImageUtils_1.ImageUtils.saveAsTiff(pngPixelArray, dir, filename, {
            width: dcmJsWrapper.dataset.Columns,
            height: dcmJsWrapper.dataset.Rows,
        });
    }
    /**
     * 将dcm另存（也可以覆盖原文件）
     * @param dcmJsWrapper dcm包装对象
     * @param dir 保存路径
     * @param filename 文件名（不含.dcm）
     */
    static async saveAsDcm(dcmJsWrapper, dir, filename) {
        return new Promise((res, rej) => {
            // 更新与存储字典
            let file_WriterBuffer = dcmJsWrapper.dictionary.write();
            fs_extra.writeFile(`${dir}/${filename}.dcm`, Buffer.from(file_WriterBuffer), (err) => {
                if (err != null) {
                    res(null);
                }
                else {
                    rej(err);
                }
            });
        });
    }
}
exports.DcmUtils = DcmUtils;
