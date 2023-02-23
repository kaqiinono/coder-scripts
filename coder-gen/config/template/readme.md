# 开始

```shell
npm run start 启动项目
npm run build 打包
npm run publish 发布
```

打包会自动生成.jcode目录，目录下会生成需要打包的组件及其属性信息，属性信息主要用于低码平台进行组件配置。 打包脚本已经自动排除了react、react-dom、@jd/jmtd组件，使用时请在具体项目中引入

# 项目中如何使用

两种方式进行使用，以模版项目@jd/demo举例(包名在package.json的name中维护，请注意唯一性和组件命名规范)

* 方式一

```shell
npm install @jd/jmtd
```

```js
import { Demo } from '@jd/jmtd'

function APP(){
  return <Demo />
}
```

* 方式二
  用于页面开发平台动态导入组件
```html
<script src='http://unpkg.jd.com/@jd%2fdemo/dist/main.js'></script>

function APP(){
// Share 组件库 demo包名 Demo组件名称
const Demo = window.Share.demo.Demo
return <Demo />
}
```

# .jcode配置文件

* .jcode/main.js
  * 文件入口，配置需要导出的组件
  * 系统会根据src/index文件中的引入关系自动输出导出组件，也可以自行配置
```js
import Demo from '../src/App.js';

export { Demo };
```
* .jcode/propTypes.json
  * 组件属性配置，用于在其他页面平台进行属性解析
  * 打包时系统会自动创建属性配置文件，前提是有在组件中定义Demo.defaultProps
```json
{
  "Demo": [
    {
      "_name": "size",
      "_type": "string",
      "defaultValue": "large"
    },
    {
      "_name": "title",
      "_type": "string",
      "defaultValue": "meinuo test"
    }
  ]
}
```
* Demo 组件名称
* _name/name 组件属性名称
* _type/type 属性类型 string array object number
* defaultValue 属性默认值


# 利用jcoder命令打包其他项目
```shell
jcoder build --share --library Jmtd --entry src/jmtd.min.js
```


