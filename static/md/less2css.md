# less2css且添加浏览器前缀等处理
less自动生成css，再把css转兼容多浏览器样式

## 环境准备
工具：vscode、nodejs
## 搭建步骤
1. 安装vscode插件：easy less。
<br>
（它会使less文件保存时自动生成同名css文件。）
<br>
2. 全局-g安装postcss-cli。
<br>
（需要添加postcss.config.js文件到项目根目录。）
<br>
3. 项目里安装依赖插件 autoprefixer、cssnano、cssnext。
<br>
autoprefixer，自动补齐浏览器前缀等兼容样式，需要添加.browserslistrc文件到项目根目录。
<br>
cssnano，css压缩。
<br>
cssnext，使用最新的css。
<br>

## 使用
1. 项目里新建 .less文件，如**test.less**，vscode打开，编写样式。
2. 写完内容，保存下，vscode帮我们自动保存了一份同名编译出来的css文件，这里是**test.css**。
3. 命令行打开进入到当前目录，执行**postcss test.css -o test.css**，将会跑postcss的配置项，对test.css进行补充前缀、压缩代码等处理。
<br>

---

附件
1. postcss.config.js文件，用来指定postcss使用的插件的文件。
```js
module.exports = {
  plugins: [
    require('autoprefixer'), // 前缀
    require('cssnano'), // 压缩
    require('cssnext') // 最新
  ]
}
```
2. .browserslistrc文件，补齐浏览器前缀的范围，哪一版的安卓、ios、IE环境要兼容……若无此文件，不做任何兼容样式处理。
```
> 1%
last 2 versions
not ie <= 8
```
---
## 进阶：使用nodejs实现*批量打包*当前目录下的css文件
<br>
有nodejs环境下，项目目录里**npm init -y**生成package.json
<br>
package.json里scripts添加**"hello": "node autocss.js"**
<br>
创建autocss.js，以后直接**npm run hello / yarn hello**即可打包代码里指定的某目录里的全部css文件。
<br>


autocss.js参考：

```js
const fs  = require('fs')
const path = require("path");
const { execFileSync } = require('child_process');

// 目录
// console.log('当前项目路径')
// console.log(__dirname)
const basePath = "src/css";
// 读取文件夹目录并筛选出css文件
fs.readdir(basePath, function(err, files){
  const dirs = [];
  const reg = /(\.css)$/
  const fnReg = str => {
    return reg.test(str)
  }
  (function iterator(i){
    if(i === files.length) {
      writeDate(dirs)
      execBat()
      return ;
    }
    fs.stat(path.join(basePath, files[i]), function (err, data) {     
      if (data.isFile()) {
        if (fnReg(files[i])) {
          dirs.push(files[i]);
        }
      }
      iterator(i + 1);
    });   
  })(0);
});

// 写入bat文件
function writeDate (arr) {
  let str = '@echo off\n';
  let basePathClone = basePath.replace(/\//g, '\\');
  str += `cd ${basePathClone} && `
  arr.forEach(element => {
    str += `postcss ${element} -o ${element} && `
  });
  str = str.substr(0, str.length - 4) + '\n';
  fs.writeFileSync('postcss.bat', str);
}

// 执行bat文件，进行postcss处理
function execBat () {
  const child = execFileSync('postcss.bat', ['--version'], {});
}
```

实际项目中的postcss.config.js（依赖安装报错就yarn delete xxx，yarn add xxx 下载最新的）：
```js
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    // to edit target browsers: use "browserslist" field in package.json
    // 'autoprefixer': {}, // 由于cssnext和cssnano都具有autoprefixer,事实上只需要一个，所以把默认的autoprefixer删除掉，然后把cssnano中的autoprefixer设置为false。
    'postcss-aspect-ratio-mini': {},
    'postcss-write-svg': {
      utf8: false
    },
    'postcss-cssnext': {},
    'postcss-px-to-viewport': {
      viewportWidth: 750, // (Number) The width of the viewport.
      // viewportHeight: 1334, // (Number) The height of the viewport.
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) Expected units. // vmin
      selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
      mediaQuery: false // (Boolean) Allow px to be converted in media queries.
    },
    'postcss-viewport-units': {
      // 过滤 after before
      filterRule: rule => rule.selector.indexOf('::after') === -1 && rule.selector.indexOf('::before') === -1 && rule.selector.indexOf(':after') === -1 && rule.selector.indexOf(':before') === -1 && rule.nodes.findIndex(i => i.prop === 'content') === -1
    },
    'cssnano': {
      // preset: "advanced",
      // autoprefixer: false,
      // "postcss-zindex": false,
      // zindex: false
      'cssnano-preset-advanced': {
        zindex: false,
        autoprefixer: false
      }
    }
  }
}
```
---
参考文档
- [Postcss](https://github.com/postcss/postcss/blob/master/README-cn.md)
- [autoprefixer](https://github.com/postcss/autoprefixer)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [nodejs](http://nodejs.cn/api/child_process.html)
