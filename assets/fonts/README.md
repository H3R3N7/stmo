# 字体说明

| 文件 | 用途 | 来源 | 许可 |
| --- | --- | --- | --- |
| `google-sans-flex-latin-variable.woff2` | 拉丁字母、数字、符号 | Google Sans Flex（latin 子集，wght 300–800） | SIL Open Font License 1.1，见 `OFL.txt` |

中文不随站点分发字体，直接使用各平台的系统字体：

| 平台 | 中文字体 |
| --- | --- |
| macOS / iOS | 苹方 PingFang SC |
| Windows | 微软雅黑 Microsoft YaHei |
| Android / Linux | Noto Sans CJK / 思源黑体 |

`--font-sans` 的顺序是：Google Sans Flex → 系统中文 → `system-ui` → 通用 sans-serif。
Google Sans Flex 通过 `unicode-range` 只覆盖拉丁区段，因此同一行里英文和数字用它，汉字自动落到系统字体，不需要额外的 `lang` 切换。
