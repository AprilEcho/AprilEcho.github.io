---
title: 阶段三练习笔记
postTime: 2022-04-11
categories: 
- 前端笔记
tags:
- Vue
- Vant
---



::: slot abstract

**阶段三练习**

项目要求掌握`Vue`框架的使用和`Vant`组件的使用

利用UI图实现三个页面，同时实现移动端的适配方案

利用Vuex实现账号信息的全局状态

:::



## 1. 项目初始化

### 1.1 项目安装

```
vue init webpack act_project
```

- Project name： 项目名称 ，默认为初始化建项目的名称`my-vue-demo`，不需要直接回车
- Project description： 项目描述，默认为A Vue.js project，不需要直接回车
- Author： 作者，如果有配置git的作者，自动会读取。直接回车
- Install vue-router?  是否安装vue的路由插件，需要安装，选择Y
- Use ESLint to lint your code?  是否用ESLint来限制你的代码错误和风格。不需要输入n，需要选择y，如果是大型团队开发，最好是进行配置
- setup unit tests with Karma + Mocha?  是否需要安装单元测试工具，不需要输入n，需要选择y
- Setup e2e tests with Nightwatch?  是否安装e2e来进行用户行为模拟测试，不需要输入n，需要选择y

初始化完成之后会出现以下信息，表示操作成功。

```
# Project initialization finished!
# ========================
```

### 1.2 项目目录

![mulu.png](https://github.com/AprilEcho/img-warehouse/blob/master/%E9%98%B6%E6%AE%B5%E4%B8%89/mulu.png?raw=true)

### 1.3 项目运行

```
npm run dev
```

## 2. 项目设计

### 2.1 导航栏和底部标签栏封装

考虑三个页面会用到导航栏和底部标签栏，因此将它们设计为公共组件

#### 2.1.1 导航栏设计

借助Vant中导航栏组件

```vue
<van-nav-bar
  title="积分商城"
   left-arrow
   @click-left="onClickLeft"
>
  <template #right>
    <van-icon name="contact" size="18" />
  </template>
</van-nav-bar>
```

- 左侧导航栏返回功能

```javascript
    onClickLeft () {
      this.$router.push('/')
    }
```

#### 2.1.2 底部标签栏

借助Vant中标签栏组件，遍历`van-tabbar-item`列表，标签栏支持路由模式，用于搭配 `vue-router` 使用。路由模式下会匹配页面路径和标签的 `to` 属性，并自动选中对应的标签，这里我们需要通过名称匹配，因为我们要根据地址栏的路由信息来动态改变`active`的值。

```vue
    <van-tabbar v-model="active" class="van-tab">
      <van-tabbar-item v-for="(item,index) in tabLists" :key="index" replace :to="item.go" :name="item.go">
        <span class="tab-text">{{item.info}}</span>
        <template #icon="props" class="tab-img">
          <img :src="props.active ? item.active : item.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
```

### 2.2 任务页设计

#### 2.2.1 每日任务和限时任务设计

由于`每日任务`和`限时任务`模块从布局来看具有相似之处，可以设计成公共组件，每个任务小模块采用`flex`布局，分为左侧图片，中间任务内容，右侧任务进度三部分，其中任务内容通过`flex:1`占据剩余内容，数据通过父组件遍历传入子组件中。

#### 2.2.2 实现效果

![rw.png](https://github.com/AprilEcho/img-warehouse/blob/master/%E9%98%B6%E6%AE%B5%E4%B8%89/rw.png?raw=true)

### 2.3 商城页设计

Vant组件提供了`Tab 标签页`，不过与UI图的设计效果相差较大，所以就自己实现一个标签页，实现过程也比较简单，通过获取当前tab的索引值动态设置内容模块的显示与隐藏。

#### 2.3.1 商品信息模块

每个商品信息模块的设计基本一致，所以在此处可以将它们封装成一个公共组件，通过分析得出商品模块左上角提示框颜色是由提示信息决定，此外当商品库存为0时，需要给商品图片添加一个蒙版。设计思路：第一，定义一个标识符来确认当前商品是否开放，因而来动态添加和移除类；第二，当库存为0时，将设计好的蒙版显示出来。

关键代码如下：

```vue
  <div class="item-box">
    <div :class="[item.flag===true ? 'top-2' : item.flag==='loot' ? '' : 'top-1']">
        <span class="top-text">{{item.toptitle}}</span>
    </div>
    <div class="item-img">
        <img :src="item.img"/>
        <div class="loot-all" v-show="item.flag==='loot'"><div>已抢光</div></div>
    </div>
    <div class="item-tip">{{item.title}}</div>
    <div class="item-integral">
        <div class="left-integral">{{item.leftIntegral}}</div>
        <div class="right-integral">{{item.rightIntegral}}<div class="red-line"></div></div>
    </div>
    <div class="item-bottom">
        <div class="left-bottom">库存：{{item.lastcount}}</div>
        <div class="right-bottom">限购0/3</div>
    </div>
</div>
```

#### 2.3.2 实现效果

![shop-page-tj.png](https://github.com/AprilEcho/img-warehouse/blob/master/%E9%98%B6%E6%AE%B5%E4%B8%89/shop-page-tj.png?raw=true)



![shop-page-zb.png](https://github.com/AprilEcho/img-warehouse/blob/master/%E9%98%B6%E6%AE%B5%E4%B8%89/shop-page-zb.png?raw=true)

### 2.4 个人中心设计

#### 2.4.1 用户登录设计

点击`登录`按钮弹出登录对话框，登录对话框包括手机和账号登录两种方式，为了在`任务`以及`商城`模块能够展示登录的个人信息，选择Vuex进行全局状态管理。除此之外，我们知道Vuex并不能实现持久化，当我们页面刷新之后，数据会消失，可以借助`vuex-persistedstate`插件进行配置以实现数据持久化。

关键代码如下：

```javascript
const store = new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    getUserInfo (state, playload) {
      state.userInfo = playload
    }
  },
  plugins: [createPersistedState({
      //使用session缓存数据
    storage: window.sessionStorage,
    reducer (val) {
      return {
        // 只存储state中的userData
        userInfo: val.userInfo
      }
    }
  })]
})
```

#### 2.4.2 实现效果

![me-page-zh.png](https://github.com/AprilEcho/img-warehouse/blob/master/%E9%98%B6%E6%AE%B5%E4%B8%89/me-page-zh.png?raw=true)

![me-page.png](https://github.com/AprilEcho/img-warehouse/blob/master/%E9%98%B6%E6%AE%B5%E4%B8%89/me-page.png?raw=true)

## 3. 项目坑点/难点

### 3.1 接口请求

项目使用axios发送和接收请求，axios 使用 post 发送数据时，默认是把` json `放到请求体中提交到后端。也就是说，` Content-Type `变成 `application/json;charset=utf-8 `，但实际请求头多为` Content-Type: application/x-www-form-urlencoded ` ，请求头的不同容易导致请求数据获取不到。因此在阶段三项目中我们可以先修改axios中请求头类型，并将参数转换为query参数（用qs.stringify()方式）

### 3.2 Vuex 持久化

Vuex本身不具备持久化的功能，所以想实现持久化需要我们手动设置，由于手动实现比较麻烦，所以我们可以直接使用插件`vuex-persistedstate`，只需简单的配置即可解决

- 安装vuex-persistedstate，注意与Vuex的版本匹配

```
npm install vuex-persistedstate -s
```

- 实例化`store`时配置`vuex-persistedstate`插件：

默认是采用`localstorage`进行缓存

```
const store = new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {}
  },
  plugins: [createPersistedState()]
})
```

采用`sessionstorage`进行缓存

```
const store = new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {},
  plugins: [createPersistedState({
      //使用session缓存数据
    storage: window.sessionStorage,
    reducer (val) {
      return {
        // 只存储state中的userData
        userInfo: val.userInfo
      }
    }
  })]
})
```

### 3.3 路由跳转底部标签栏没有正确匹配

当`任务`或`商城`模块点击头部登录按钮时，会跳转到`我的`模块页面，但底部标签栏`我的`图标没有高亮，究其原因是在设计之初只是在第一次渲染页面的时候将路由信息传给标签栏，当非标签栏引发的跳转时不会改变标签栏中`active`的值。了解问题所在之后，我们可以在底部标签栏模块中监听路由的变化，进而修改`active`的值。

关键代码如下：

```
  watch: {
    $route (to, from) {
      this.active = to.path
    }
  }
```

### 3.4 移动端适配（vw适配）

#### 3.4.1 配置过程

安装依赖

```
npm install postcss-px-to-viewport --save-dev
```

在根目录新建一个文件` .postcssrc.js`，配置如下信息：

```
module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-px-to-viewport":{
            viewportWidth: 750,//视窗的宽度，对应的是我们设计稿的宽度
            viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
            unitPrecision: 3,//指定`px`转换为视窗单位值的小数位数，默认是5(很多时候无法整除)
            viewportUnit: 'vw',//指定需要转换成的视窗单位，建议使用vw
            selectorBlackList: ['.ignore','.hairlines'],//指定不转换为视窗单位的类 
            minPixelValue: 1,// 小于或等于`1px`不转换为视窗单位
            mediaQuery: true,// 允许在媒体查询中转换`px`，默认false
            exclude:/(\/|\\)(node_modules)(\/|\\)/, //如果是regexp, 忽略全部匹配文件;如果是数组array, 忽略指定文件.
            landscape:true,
            landscapeUnit:'vw',
            landscapeWidth:1434
        }
  }
}
```

### 3.5 进入对话框原输入内容不清空

当我们进入登录对话框的时候，输入相关内容，点击关闭按钮之后通过控制台知道我们所设计的组件没有真正意义上的卸载，当我们想要删除输入的内容，其实只需要在关闭按钮的事件将输入框的内容清空即可。

### 3.6 滚动条引起的内容区域无法完全显示

内容区域超过可见区域会出现滚动条，标签栏是固定在底部，内容区域被遮挡的区域也就是底部标签栏，在设计内容区域时减掉标签栏的高度即可，也就是当前内容的可见区域为 屏幕高度 - 底部标签栏高度。
