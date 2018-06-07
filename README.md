### 安装(install)
```javascript
npm install katex-service -S
```
### 使用(use)
```javascript
import parseTex from 'katext-service'
parseTex(katexStr, isGreen)
```
### 描述(desc)
参数
```javascript
@{ param } katexStr : 带有katex码的特殊字符串
@{ param } isGreen : 是否渲染绿色公式
```
具体逻辑
1.替换image标签：probimg/explimg 最终都会被替换成 img
2.用katex处理内部被$包裹的字符
3.用图片代替存在渲染兼容问题的公式，已知大于等于号、小于等于号、省略号等等

扩展
```javascript
---- /* 字符表示下拉选择题的题干 空 部分 */ 
____ /* 字符表示填空题的题干 空 部分 */ 

/* 题目类型 */
export const problemsType = {
  SINGLECHOICE: 'single_choice', // 单项选择
  SINGLEBLANK: 'single_blank', // 单项填空
  MULTIBLANK: 'multi_blank', // 多项填空
  HYBRID: 'hybrid', // 混合
  EXAM: 'exam' // 举一反三
};
```
![](https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=976993248,398000594&fm=27&gp=0.jpg)
