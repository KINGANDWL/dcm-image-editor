/**
 * VR 枚举
 */
export enum VR_ENUM {
    /**
     * CS - Code String; 代码字符串; 开头结尾可以有没有意义的空格的字符串，比如“CD123_4”; 大写字母，0-9，空格以及下划线字符; 最多 16 
     */
    CS = "CS",
    /**
     * SH - Short String; 短字符串; 短字符串，比如:电话号码，ID等; 最多 16 个字符
     */
    SH = "SH",
    /**
     * LO - Long String; 长字符串; 一个字符串，可能在开头、结尾填有空 格。比如“Introduction to DICOM”; 最多 64 个字符
     */
    LO = "LO",
    /**
     * ST  - Short Text; 短文本; 可能包含一个或多个段落的字符串; 最多 1024 个字符
     */
    ST = "ST",
    /**
     * LT  - Long Text; 长文本; 可能包含一个或多个锻炼的字符串，与LO相同，但可以更长; 最多 10240 个字符
     */
    LT = "LT",
    /**
     * UT - Unlimited Text; 无限制文本; 包含一个或多个段落的字符串，与 LT 类似; 最多(2的32次方–2)个字符(4294967294)
     */
    UT = "UT",
    /**
     * AE - Application Entity; 应用实体; 标识一个设备的名称的字符串，开头和 结尾可以有无意义的字符。比如 “MyPC01”; 最多 16 个字符
     */
    AE = "AE",
    /**
     * PN - Person Name; 病人姓名; 有插入符号(^)作为姓名分隔符的病人姓名。比如“SMITH^JOHN” “Morrison- Jones^Susan^^^Ph.D， Chief Executive Officer”; 最多 64 个字符
     */
    PN = "PN",
    /**
     * UI - Unique Identifier (UID)； 唯一标识符； 一个用作唯一标识各类项目的包含 UID 的字符串。比如“1.2.840.10008.1.1”； 0-9 和半角句号(.); 最多64 个字符
     */
    UI = "UI",
    /**
     * DA - Date; 日期; 格式为 YYYYMMDD 的字符串；YYYY 代表年；MM 代表月；DD 代表日。比 如“20050822”表示 2005 年 8 月 22 日; 0-9; 8个字符
     */
    DA = "DA",
    /**
     * TM - Time； 时间； 格式为 HHMMSS 的字符串。FRAC； HH 表示小时(范围“00”-“23”)； MM 表示分钟(范围“00”-“59”)； 而 FRAC 包含秒的小数部分，即百万分 之一秒。比如“183200.00” 表示下午 6:32； 0-9 和半角句号(.)； 最多 16 个字符
     */
    TM = "TM",
    /**
     * DT - Date Time; 日期时间; 格式为 YYYYMMDDHHMMSS. FFFFFF，串联的日期时间字符串。字符串的各部分从左至右是:年 YYYY；月 MM；日 DD；小时 HH；分钟 MM；秒 SS；秒的小数 FFFFFF。比如 20050812183000.00”表示 2005 年 8 月 12 日下午 18 点 30 分 00 秒; 0-9，加号，减号和半角句号; 最多 26 个字符
     */
    DT = "DT",
    /**
     * AS - Age String； 年龄字符串； 符合以下格式的字符串:nnnD， nnnW， nnnM， nnnY；其中 nnn 对于 D 来说表示天数，对于W来说表示周数，对于M 来说表示月数，对于 Y 来说表示岁数。 比如“018M”表示他的年龄是 18 个月； 0–9， D， W，M， Y； 4 个字符
     */
    AS = "AS",
    /**
     * IS - Integer String; 整型字符串; 表示一个整型数字的字符串。比如“-1234567”; 0-9，加号(+)，减号(-); 最多 12 个字符
     */
    IS = "IS",
    /**
     * DS - Decimal String 小数字符串; 表示定点小数和浮点小数。 比如“12345.67”，“-5.0e3”; 0-9，加号(+)，减号(-)， 最多 16 个字符 E，e 和半角句号(.); 最多 16 个字符
     */
    DS = "DS",
    /**
     * SS - Signed Short; 有符号短型; 符号型二进制整数，长度 16 比特; 2 个字符
     */
    SS = "SS",
    /**
     * US - Unsigned Short 无符号短型; 无符号二进制整数，长度 16 比特; 2 个字符
     */
    US = "US",
    /**
     * SL - Signed Long; 有符号长型; 有符号二进制整数，长度 32 比特; 4 个字符
     */
    SL = "SL",
    /**
     * UL - Unsigned Long 无符号长型; 无符号二进制整数，长度 32 比特; 4 个字符
     */
    UL = "UL",
    /**
     * AT - Attribute Tag; 属性标签; 16 比特无符号整数的有序对，数据元素的标签; 4 个字符
     */
    AT = "AT",
    /**
     * FL - Floating Single 单精度浮点; 单精度二进制浮点数字; 4 个字符
     */
    FL = "FL",
    /**
     * FD - Floating Point Double; 双精度二进制浮点数字; 双精度二进制浮点数字; 8 个字符
     */
    FD = "FD",
    /**
     * OB - Other Byte String; 其他字节字符串; 字节的字符串（“其他”表示没有在VR中定义的内容）
     */
    OB = "OB",
    /**
     * OW - Other Word String; 其他单词字符串; 16 比特(2 字节)单词字符串
     */
    OW = "OW",
    /**
     * OF - Other Float String; 其他浮点字符串; 32 比特(4 个字节)浮点单词字符串
     */
    OF = "OF",
    /**
     * SQ - Sequence Items; 条目序列; 条目的序列
     */
    SQ = "SQ",
    /**
     * UN – Unknown; 未知; 字节的字符串，其中内容的编码方式是未知的
     */
    UN = "UN",
}
