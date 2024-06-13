// import * as path from "path"
// import * as fs_extra from "fs-extra"
// import * as DcmJs from "dcmjs"
// import * as pngjs from "pngjs"
// import * as dicom_parser from "dicom-parser";
// import * as Sharp from "sharp"
// import { DcmJsWrapper } from './dcm/DcmJsWrapper';
// import { DcmUtils } from "./utils/DcmUtils";
// import { VR_ENUM } from './dcm/VR.enum';
// import { ImageUtils } from './utils/ImageUtils';
// let dcmjsWrapper = new DcmJsWrapper(path.join(__dirname, "../resources/test.dcm"));
// // dcmjsWrapper.upsertTag("00810010", { vr: VR_ENUM.LO, Value: ["This is myTag"] })
// let pixelArr = []
// for(let i=0; i<25; i++){
// 	for(let k=0; k<25; k++){
// 		pixelArr.push(65535)
// 	}
// }
// let dcmjsWrapper2 = new DcmJsWrapper();
// // dcmjsWrapper2.resetPixel_Uint16Array(Uint16Array.from(pixelArr),25)
// dcmjsWrapper2.setPixel(dcmjsWrapper.getPixelUint16Array(),1560,2048)
// dcmjsWrapper2.upsertTag("00810010", { vr: VR_ENUM.LO, Value: ["This is myTag"] })
// DcmUtils.saveAsDcm(dcmjsWrapper2, path.join(__dirname, "../resources/"), "test2");
// // DcmUtils.saveAsPng(dcmjsWrapper2, path.join(__dirname, "../resources/"), "test2");
// // DcmUtils.saveAsJpeg(dcmjsWrapper2, path.join(__dirname, "../resources/"), "test2");
// // DcmUtils.saveAsBmp(dcmjsWrapper2, path.join(__dirname, "../resources/"), "test2");
// // DcmUtils.saveAsTiff(dcmjsWrapper2, path.join(__dirname, "../resources/"), "test2");
// console.log(dcmjsWrapper2.dataset)
