import _ from 'lodash'
import modFactory from '@/lib/mod/factory'

// 加载mod
function loadMod(block) {
  return modFactory.create(block)
}

// md.bind
function parseBlock(block) {
  // 进来表明该模块发生变化 应重置所有状态
  // var token = block.token
  // var content = token.content
  // var text = token.text
  // var line = text.split('\n')[0]
  // var isWikiBlock = token.tag === 'pre' && /^```@([\w_\/]+)/.test(line)
  // block.isWikiBlock = isWikiBlock
  // if (!isWikiBlock) {
  //   // block.blockUrl = undefined;
  //   block.isTemplate = false
  //   block.modName = undefined
  //   block.cmdName = undefined
  //   block.modParams = undefined
  //   block.wikimod = undefined
  // } else {
  //   var wikiCmdRE = /^```@([\w_\/]+)/
  //   var wikiModNameRE = /^([\w_]+)/
  //   var cmdName = line.match(wikiCmdRE)[1]
  //   var modName = cmdName.match(wikiModNameRE)[1]
  //   var modParams
  //   try {
  //     modParams = angular.fromJson(content.trim())
  //   } catch (e) {
  //     modParams = app.objects.mdconf.mdToJson(content) || content
  //   }
  //   // console.log(modParams);
  //   if (block.cmdName != cmdName) {
  //     block.wikimod = undefined
  //   }
  //   block.modName = modName
  //   block.cmdName = cmdName
  //   block.modParams = modParams
  //   block.isTemplate = modName === 'template'
  //   if (typeof block.modParams === 'string' && !block.modParams.trim()) {
  //     block.modParams = undefined
  //   }
  // }
}

var _block = {}
// app.mixin(_block, toolbase)

// _block.applyModParams = function(modParams) {
//   var self = this
//   var editor = self.md.editor || {}

//   if (!editor || !self.isWikiBlock) {
//     return
//   }

//   var from = self.token.start
//   var to = self.token.end
//   modParams = modParams || self.modParams

//   // console.log(modParams);
//   if (typeof modParams === 'object') {
//     // modParams = angular.toJson(modParams, 4);
//     // modParams = app.objects.mdconf.jsonToMd(modParams)
//   }

//   editor.replaceRange(
//     modParams + '\n',
//     { line: from + 1, ch: 0 },
//     { line: to - 1, ch: 0 }
//   )
// }

// 渲染block
// _block.render = function(success, error) {
//   var self = this
//   // 普通md渲染
//   if (!self.isWikiBlock) {
//     if (
//       self.isChange &&
//       self.htmlContent != self.token.htmlContent &&
//       self.$render
//     ) {
//       self.htmlContent = self.token.htmlContent
//       // console.log(block.htmlContent, block);
//       // self.$render(self.htmlContent);
//       self.dispatchEvent('render', self.htmlContent)
//     }
//     success && success()
//     return
//   }

//   // 强制渲染
//   if (
//     self.$render &&
//     self.cmdName &&
//     self.wikimod &&
//     self.cmdName == self.wikimod.cmdName &&
//     self.wikimod.mod &&
//     self.wikimod.mod.forceRender
//   ) {
//     self.wikimod.mod.forceRender(self)
//   }

//   if (self.wikimod && !self.isChange) {
//     success && success()
//     return
//   }

//   // console.log(self);
//   function _render(mod) {
//     if (!self.$render) {
//       return
//     }

//     // 获取模板html
//     function _getModHtml() {
//       var htmlContent = undefined
//       if (typeof mod === 'function') {
//         htmlContent = mod(self)
//       } else if (typeof mod === 'object') {
//         htmlContent = mod.render(self)
//       } else {
//         htmlContent = mod
//       }

//       return htmlContent
//     }

//     var htmlContent = _getModHtml()

//     // text 改变不一定重新渲染  htmlContent改变则重新渲染
//     if (self.htmlContent != htmlContent) {
//       self.htmlContent = htmlContent
//       // 预览模式渲染魔板块 此外排除魔板块
//       if (
//         self.mode == 'preview' ||
//         !self.isTemplate ||
//         self.blockList != undefined
//       ) {
//         // template 与 template_block 唯一区别是blockList
//         // self.$render(_getModHtml);
//         self.dispatchEvent('render', _getModHtml)
//       }
//     } else {
//     }
//     success && success()
//   }

//   if (self.cmdName && self.wikimod && self.cmdName == self.wikimod.cmdName) {
//     _render(self.wikimod.mod)
//   } else {
//     loadMod(
//       self,
//       function(mod, cmdName) {
//         if (self.cmdName != cmdName) {
//           return
//         }

//         self.wikimod = { cmdName: cmdName, mod: mod }
//         _render(self.wikimod.mod)
//       },
//       function() {
//         console.log('加载模块' + block.cmdName + '失败')
//         error && error()
//       }
//     )
//   }
// }

// 设置块token
_block.setToken = function(token) {
  var self = this

  self.token = token

  if (self.text != token.text) {
    self.text = token.text
    self.isChange = true
    parseBlock(self)
  } else {
    self.isChange = false
  }
}

function blockFactory(block, md) {
  // block = block || angular.copy(_block)

  block.md = md
  block.mdName = md.mdName
  block.mode = md.mode

  return block
}

export default blockFactory
