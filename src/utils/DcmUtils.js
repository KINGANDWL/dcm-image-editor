"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DcmUtils = void 0;
const fs_extra = require("fs-extra");
const ImageUtils_1 = require("./ImageUtils");
class DcmUtils {
    /**
     * 读取dcm为png像素数组
     * @param dcmJsWrapper dcm包装对象
     * @param autoMapping 自动通过最大最小像素映射
     */
    static readDcmAsPngPixelArray(dcmJsWrapper, autoMapping = false) {
        let pixeArr = new Uint16Array(dcmJsWrapper._dataset.PixelData[0]);
        let pngPixeArr;
        if (autoMapping === true) {
            let maxPixel = 0, minPixel = 65535;
            for (let i = 0; i < pixeArr.length; i++) {
                if (pixeArr[i] > maxPixel)
                    maxPixel = pixeArr[i];
                if (pixeArr[i] < minPixel)
                    minPixel = pixeArr[i];
            }
            if (maxPixel < minPixel)
                throw new Error(`Unknown err: max < min`);
            pngPixeArr = new Array(pixeArr.length * 4);
            let pWidth = maxPixel - minPixel, index = 0;
            for (let i = 0; i < pixeArr.length; i++) {
                //@ts-ignore
                pngPixeArr[index] = Math.floor((pngPixeArr[index] - minPixel) / pWidth * 255);
                pngPixeArr[index + 1] = pngPixeArr[index];
                pngPixeArr[index + 2] = pngPixeArr[index];
                pngPixeArr[index + 3] = 255;
                index += 4;
            }
        }
        else {
            pngPixeArr = ImageUtils_1.ImageUtils.mapper1ChannelPixelArrTo4Channel(pixeArr, 16, 8);
        }
        return pngPixeArr;
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
