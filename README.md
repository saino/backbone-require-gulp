# KBaoAPP : 快宝app-寿险

## 使用说明
>
### 第一次使用操作
1. 安装 node.js。（由于前端的一些工具是构建在node.js 之上，请确保 已经安装了node.js 和 npm。没有可以去 <http://nodejs.org/download/> 下载）
2. 安装 gulp工具。运行命令：npm install webpack -g && npm install gulp -g
3. 安装 npm相关的包。运行命令：npm install
4. 至此，我们所有的工具、及 包都安装成功，以后不需要进行第1、2步了。可以运行下面相应的命令。

>
### 常用操作及其命令
* 安装npm相应包 : npm install
* 编译项目 : gulp release 或者 npm run release
* 开发项目 : gulp develop 或者 npm run develop 


## 项目结构
>
### src : 是前端源代码根目录
* scss ：scss格式的样式。
* www/css ：css静态资源目录(css,images)。
* www/index.html ：首页文件。
* www/js: js源代码和库文件
>
### dist : 压缩，合并后的代码，发布到生产环境中的代码；运行 gulp release 命令会自动生成，无需手动更改此文件夹。

>
### node_modules : 存放node.js依赖包(工具相关)，通过在 package.json 中配置依赖，运行 npm install 自动下载相应包，无需手动更改此文件夹。

## 文件说明
>
* package.json ：node 模块的配置文件， 通常用来 配置 node.js依赖包，所有有node.js插件依赖在此文件配置。
* gulpfile.js ：gulp task 文件，定义了 如何用 gulp 开发和打包requirejs模块的 任务。
* require-config.js:requirejs中的模块依赖和名称定义




