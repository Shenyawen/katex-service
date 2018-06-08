'use strict'

'use strict'

import _ from 'lodash'
import katex from 'katex'

const images = {
  geqslant: require('./images/symbol_largerandequal.svg'),
  leqslant: require('./images/symbol_smallerandequal.svg'),
  cdots: require('./images/cdots.svg'),
  green: {
    geqslant: require('./images/geqslant-green.svg'),
    leqslant: require('./images/leqslant-green.svg'),
    cdots: require('./images/cdots-green.svg')
  }
}

const MATCHINGRULE = /(\d*(\\dfrac|\\sqrt){+)+({?[0-9a-zA-Z\\pi]*\^*[+-]?}?(\\sqrt|\\dfrac)*)*/g
const LEQSLANT = /<span class="mrel amsrm">⩽<\/span>/g
const GEQSLANT = /<span class="mrel amsrm">⩾<\/span>/g
const CDOTS = /<span class="minner">⋯<\/span>/g

/* 基于katex自定义处理katex码 */
function handleKatex (katexStr) {
  if (!katexStr) return ''
  let rawString = katexStr.replace(/probimg|explimg/g, 'img')
  rawString.replace(/\$([^$]*)\$/gm, (match, text) => {
    const matchingResultArr = text.match(MATCHINGRULE)
    const result = `$${text}$`
    if (matchingResultArr && matchingResultArr.length) {
      const replacedStr = (`<div class="katex-higher">${result}</div>`).hexEncode()
      rawString = rawString.hexEncode().replace(new RegExp(result.hexEncode(), 'g'), replacedStr).hexDecode()
    } else {
      const replacedStr = `<span class="katex-flat">${result}</span>`.hexEncode()
      rawString = rawString.hexEncode().replace(new RegExp(result.hexEncode(), 'g'), replacedStr).hexDecode()
    }
  })
  return rawString.replace(/\$([^$]*)\$/gm, (match, tex) => katex.renderToString(tex, { displayMode: true }))
}

/**
 * 分析已有的HTML结构且将大于等于号/小于等于号替换成对应图片
 * @author Sumous
 * @createdate 2018-06-07
 * 处理兼容已知兼容问题
*/
function katexReplaceImage (htmlStr, isGreen) {
  const leqslantImg = isGreen ? images.green.leqslant : images.leqslant
  const geqslantImg = isGreen ? images.green.geqslant : images.geqslant
  const cdotsImg = isGreen ? images.green.cdots : images.cdots
  const replaceMap = {
    leqslant: {
      reg: LEQSLANT,
      val: `<i style="background-image:url(${leqslantImg});" class="katex-spec-symbol leqslant"></i>`
    },
    geqslant: {
      reg: GEQSLANT,
      val: `<i style="background-image:url(${geqslantImg});" class="katex-spec-symbol geqslant"></i>`,
    },
    cdots: {
      reg: CDOTS,
      val: `<i style="background-image:url(${cdotsImg});" class="katex-spec-symbol"></i>`
    }
  }
  return _.reduce(replaceMap, (prev, value) => prev.replace(value.reg, value.val), htmlStr)
}

/* 扩展String */
String.prototype.hexEncode = function hexEncode() {
  let hex;
  let i;
  let result = '';
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += (`000${hex}`).slice(-4);
  }
  return result;
};

String.prototype.hexDecode = function hexDecode() {
  let j;
  const hexes = this.match(/.{1,4}/g) || [];
  let back = '';
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }
  return back;
};

module.exports = function parseTex(katexStr, isGreen) {
  const htmlStr = handleKatex(katexStr)
  return katexReplaceImage(htmlStr, isGreen)
}