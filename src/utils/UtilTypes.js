"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPixelToRGBA = void 0;
/**
 * 默认rgba转换函数
*/
const DefaultPixelToRGBA = function (pixel) {
    // 转8位图像
    //@ts-ignore
    let _pixel = (pixel * 256 / 65536).toFixed(0) * 1;
    return {
        r: _pixel,
        g: _pixel,
        b: _pixel,
        a: 255 //透明度拉满
    };
};
exports.DefaultPixelToRGBA = DefaultPixelToRGBA;
