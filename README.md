# 小狼毫（Rime）输入法样式——紧凑胶囊系列

## 主题颜色

rime 输入法使用的主题，整体呈一个紧凑的胶囊形状，分亮色暗色两种
有如下若干种颜色

- 紧凑胶囊红
- 紧凑胶囊黄
- 紧凑胶囊紫
- 紧凑胶囊橙
- 紧凑胶囊绿
- 紧凑胶囊蓝

## 示例图片

以下是主题的示例图片：

<img src="assets/compact-capsule-examples.png" alt="紧凑胶囊" style="max-width: 50%; margin-left: 25%">

## 使用方法

进入 dist 文件夹

1. 复制 patch_weasel.custom.yaml 中“patch:”里的内容
2. 粘贴到“用户文件夹”里 weasel.custom.yaml 的“patch:”下即可
3. patch_default.custom.yaml 同理，其作用是改用 CapsLock 键切换中英文、候选词数量改为 6

## 配置细节

1. 实际上候选词框的背景有不透明度，数值为 90%
2. 会把候选词框改为水平方向
3. 会修改文字和候选词框边距使之像胶囊
4. 会修改候选词框圆角半径
5. 会把行内现实预编辑区设为 true
