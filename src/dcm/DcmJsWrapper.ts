import { VR_ENUM } from './VR.enum';
import * as fs_extra from 'fs-extra';
import * as DcmJs from 'dcmjs';
import { DcmPixelArray } from '../utils/UtilTypes';

export type DcmBuffer = Buffer;


export interface DicomElement {
    vr: VR_ENUM,
    Value: any
}


export class DcmJsWrapper {
    private static DcmTemplate = {
        meta() {
            return {
                '00020001': { vr: VR_ENUM.OB, Value: [Uint8Array.from([0, 1]).buffer] },
                '00020002': { vr: VR_ENUM.UI, Value: ['1.2.276.0.7230010.3.1.0.1'] },
                '00020003': { vr: VR_ENUM.UI, Value: ['1.2.276.0.7230010.3.1.4.4042681065.1160.1529291001.400'] },
                '00020010': { vr: VR_ENUM.UI, Value: ['1.2.840.10008.1.2.1'] },
                '00020012': { vr: VR_ENUM.UI, Value: ['1.2.276.0.7230010.3.0.3.6.2'] },
                '00020013': { vr: VR_ENUM.SH, Value: ['OFFIS_DCMTK_362'] }
            }
        },
        dict() {
            return {
                '00080008': { vr: VR_ENUM.CS, Value: ['ORIGINAL', 'PRIMARY'] },
                '00080060': { vr: VR_ENUM.CS, Value: ['OT'] },
                '00080080': { vr: VR_ENUM.LO, Value: [''] },
                '00100010': { vr: VR_ENUM.PN, Value: ['none'] },
                '00200011': { vr: VR_ENUM.IS, Value: [1] },
                '00200013': { vr: VR_ENUM.IS, Value: [1] },
                '00280002': { vr: VR_ENUM.US, Value: [1] },
                '00280004': { vr: VR_ENUM.CS, Value: ['MONOCHROME2'] },
                '00280006': { vr: VR_ENUM.US, Value: [0] },
                '00280008': { vr: VR_ENUM.IS, Value: [1] },
                '00280010': { vr: VR_ENUM.US, Value: [0] }, //高度
                '00280011': { vr: VR_ENUM.US, Value: [0] }, //宽度
                '00280100': { vr: VR_ENUM.US, Value: [16] },
                '00280101': { vr: VR_ENUM.US, Value: [16] },
                '00280102': { vr: VR_ENUM.US, Value: [15] },
                '00280103': { vr: VR_ENUM.US, Value: [0] },
                '00281052': { vr: VR_ENUM.DS, Value: [0] },
                '00281053': { vr: VR_ENUM.DS, Value: [1] },
                '7FE00010': { //像素值
                    vr: VR_ENUM.OB, Value: [
                        Uint8Array.from([]).buffer
                    ]
                }
            }
        }
    }

    private _dictionary: { meta: { [tag: string]: DicomElement }, dict: { [tag: string]: DicomElement }, write: () => DcmBuffer }

    /**
     * 创建dcm包装器 （三种构造方式：无参构造默认创建空白dcm； 文件buffer读取文件； 路径读取路径dcm）
     * @param dcmFileBuffer_or_filePath 
     */
    constructor(dcmFileBuffer_or_filePath?: Uint8Array | string) {
        if (dcmFileBuffer_or_filePath == undefined) {
            this._dictionary = new DcmJs.data.DicomDict(
                DcmJsWrapper.DcmTemplate.meta()
            )
            this._dictionary.dict = DcmJsWrapper.DcmTemplate.dict();
        } else {
            if (typeof (dcmFileBuffer_or_filePath) == "string") {
                let arrayBuffer = fs_extra.readFileSync(dcmFileBuffer_or_filePath);
                this._dictionary = DcmJs.data.DicomMessage.readFile(arrayBuffer.buffer, { ignoreErrors: true });
            } else {
                this._dictionary = DcmJs.data.DicomMessage.readFile(dcmFileBuffer_or_filePath.buffer, { ignoreErrors: true });
            }
        }
    }


    get dictionary() {
        return this._dictionary;
    }
    
    private _dictionary_dict: any = null;
    get _dataset(): { [property: string]: any } {
        // 避免多次创建对象
        if (this._dictionary_dict == null) {
            this._dictionary_dict = DcmJs.data.DicomMetaDictionary.naturalizeDataset(this._dictionary.dict);;
        }
        return this._dictionary_dict;
    }
    private _dictionary_meta: any = null;
    get _metaset(): { [property: string]: any } {
        // 避免多次创建对象
        if (this._dictionary_meta == null) {
            this._dictionary_meta = DcmJs.data.DicomMetaDictionary.naturalizeDataset(this._dictionary.meta);
        }
        return this._dictionary_meta;
    }
    
    get dataset() {
        return DcmJs.data.DicomMetaDictionary.naturalizeDataset(this._dictionary.dict);
    }
    get metaset() {
        return DcmJs.data.DicomMetaDictionary.naturalizeDataset(this._dictionary.meta);
    }


    /**
     * 获取分辨率大小
     */
    getDcmSize(): { Rows: number, Columns: number } {
        return {
            Rows: this._dictionary.dict["00280010"].Value[0],
            Columns: this._dictionary.dict["00280011"].Value[0],
        }
    }
    /**
     * 获取分辨率大小
     */
    getDcmResolution(): { Rows: number, Columns: number } {
        return this.getDcmSize();
    }



    /**
     * 读取标签
     * @param tagName 标签名（00310010）
     */
    getTag(tagName: string): DicomElement | null {
        return this._dictionary.dict[tagName];
    }

    /**
     * 更新或插入标签; 当tagName小于 00310000 时容易碰到插入失败情况，要求组号必须为奇数且id号不允许为0000
     * @param tagName 标签名
     * @param element 元素
     */
    upsertTag(tagName: string, element: DicomElement) {
        //@ts-ignore
        this._dictionary.upsertTag(tagName, element.vr, element.Value);
    }

    /**
     * 获取dcm的16位图像像素大小（个数）。dcm本质上是16位图像，但是存储方式是8位存储格式
     */
    getPixelLength() {
        return (this._dictionary.dict["7FE00010"].Value[0] as ArrayBuffer).byteLength / 2
    }
    /**
     * 获取16位像素数组
     */
    getPixelUint16Array(): DcmPixelArray {
        return new Uint16Array(this._dictionary.dict["7FE00010"].Value[0] as ArrayBuffer);
    }
    /**
     * 获取8位像素数组
     */
    getPixelUint8Array(): Uint8Array {
        return new Uint8Array(this._dictionary.dict["7FE00010"].Value[0] as ArrayBuffer);
    }



    /**
     * 重置像素（16位）信息，如果不指定Rows，则以原先的大小进行覆盖；若指定Rows与Columns，像素不足填充0像素，像素超出则裁剪移除像素
     * @param arr buffer
     * @param Rows 分辨率行
     * @param Columns 分辨率列
     */
    setPixel(arr: Uint8Array | Uint16Array | { buffer: ArrayBufferLike }, Rows?: number, Columns?: number): void {
        let size = { Rows: 0, Columns: 0 }
        let buffer: Uint8Array = new Uint8Array(arr.buffer); //8位存储

        if (buffer.length % 2 != 0) {
            // 无论是任何情况，buffer转8位之后像素一定是偶数
            throw new Error("buffer lost some pixel");
        }

        if (!isNaN(Rows) && !isNaN(Columns)) {
            // 强制图像大小，像素不足填充0，像素多余则删除
            size = { Rows: Rows, Columns: Columns }

        } else if (!isNaN(Rows)) {
            // 自动调整图像到Rows，像素不足填充0，像素多余则删除
            // 宁可多余进行填充也不要丢失像素，因此使用ceil
            size = { Rows: Rows, Columns: Math.ceil(buffer.length / 2 / Rows) }

        } else if (!isNaN(Columns)) {
            size = { Rows: Math.ceil(buffer.length / 2 / Columns), Columns: Columns }

        } else {
            //用默认大小（原dcm大小）
            size = this.getDcmSize();
        }


        let count = size.Columns * size.Rows;
        let len = count - (buffer.length / 2);
        if (len > 0) {
            //分辨率大于像素，则填充0
            let pixelArr = new Array(len * 2);
            pixelArr.fill(0, 0, len * 2)
            buffer = Buffer.concat([buffer, Uint8Array.from(pixelArr)])
        } else if (len < 0) {
            //分辨率小于像素，则删除
            buffer = buffer.slice(0, count * 2)
        }


        // Rows (0028,0010), Columns (0028,0011)
        this.upsertTag("00280010", {
            vr: VR_ENUM.US,
            Value: [size.Rows]
        })
        this.upsertTag("00280011", {
            vr: VR_ENUM.US,
            Value: [size.Columns]
        })
        this.upsertTag("7FE00010", { vr: VR_ENUM.OB, Value: [buffer.buffer] })
    }

}