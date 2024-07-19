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
// let pixelArr = []
// for (let i = 0; i < 25; i++) {
//     for (let k = 0; k < 25; k++) {
//         pixelArr.push(i * k)
//     }
// }
// var dcmjsWrapper = new DcmJsWrapper();
// dcmjsWrapper.setPixel(Uint16Array.from(pixelArr), 25);
// dcmjsWrapper.upsertTag("005104B7", { vr: VR_ENUM.LT, Value: ["005104B7"] });
// dcmjsWrapper.upsertTag("005104B9", { vr: VR_ENUM.LT, Value: "005104B9" });
// dcmjsWrapper.upsertTag("005104BB", { vr: VR_ENUM.ST, Value: ["005104BB"] });
// dcmjsWrapper.upsertTag("005104BD", { vr: VR_ENUM.ST, Value: "005104BD" });
// dcmjsWrapper.upsertTag("00510555", { vr: VR_ENUM.LT, Value: ["00510555"] });
// dcmjsWrapper.upsertTag("00510557", { vr: VR_ENUM.LT, Value: "00510557" });
// dcmjsWrapper.upsertTag("00510559", { vr: VR_ENUM.ST, Value: ["00510559"] });
// dcmjsWrapper.upsertTag("0051055B", { vr: VR_ENUM.ST, Value: "0051055B" });
// console.log(dcmjsWrapper.getTag("00510559"))
// console.log(dcmjsWrapper.getTag("0051055B"))
// var dcmjsWrapper2 = dcmjsWrapper.copy();
// dcmjsWrapper2.upsertTag("005104B7", { vr: VR_ENUM.LT, Value: ["005104B7-2"] });
// dcmjsWrapper2.upsertTag("005104B9", { vr: VR_ENUM.LT, Value: "005104B9-2" });
// dcmjsWrapper2.upsertTag("005104BB", { vr: VR_ENUM.ST, Value: ["005104BB-2"] });
// dcmjsWrapper2.upsertTag("005104BD", { vr: VR_ENUM.ST, Value: "005104BD-2" });
// dcmjsWrapper2.upsertTag("00510555", { vr: VR_ENUM.LT, Value: ["00510555-2"] });
// dcmjsWrapper2.upsertTag("00510557", { vr: VR_ENUM.LT, Value: "00510557-2" });
// dcmjsWrapper2.upsertTag("00510559", { vr: VR_ENUM.ST, Value: ["00510559-2"] });
// dcmjsWrapper2.upsertTag("0051055B", { vr: VR_ENUM.ST, Value: "0051055B-2" });
// console.log(dcmjsWrapper2.getTag("00510559"))
// console.log(dcmjsWrapper2.getTag("0051055B"))
// DcmUtils.saveAsDcm(dcmjsWrapper2, path.join(__dirname, "./"), new Date().valueOf().toString());
