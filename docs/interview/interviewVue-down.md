---
title: 前端面试题手册——Vue（下）
postTime: 2023-06-24
categories: 面试
tags:
- 前端
---

## Vue路由

### vue-router有多少种模式

- hash模式：兼容所有浏览器，包括不支持 HTML5 History Api 的浏览器，例如http://www.baidu.com/#/index，hash值为#/index， hash的改变会触发hashchange事件，我们可以通过监听hashchange事件来完成操作实现前端路由。

```
// 监听hash变化，点击浏览器的前进后退会触发
window.addEventListener('hashchange', function(event){ 
    let newURL = event.newURL; // hash 改变后的新 url
    let oldURL = event.oldURL; // hash 改变前的旧 url
},false)
```

> 分析：当 URL 改变时，页面不会重新加载。 hash（#）是URL 的锚点，代表的是网页中的一个位置，单单改变#后的部分，浏览器只会滚动到相应位置，不会重新加载网页，也就是说 #是用来指导浏览器动作的，对服务器端完全无用，HTTP请求中也不会不包括#；同时每一次改变#后的部分，都会在浏览器的访问历史中增加一个记录，使用”后退”按钮，就可以回到上一个位置；所以说Hash模式通过锚点值的改变，根据不同的值，渲染指定DOM位置的不同数据

- history模式：能支持 HTML5 History Api 的浏览器，依赖HTML5 History API来实现前端路由。没有#的特殊符号，例如http://www.baidu.com/index，路由地址跟正常的url一样，不过第一次访问或者刷新页面都会向服务器请求，如果没有请求到对应的资源就会返回404，所以路由地址匹配不到任何静态资源，则应该返回同一个index.html 页面，需要在nginx中配置。

```
location / {
    try_files  $uri $uri/ @router index index.html;
}
location @router {
    rewrite ^.*$ /index.html last;
}
```

> 分析：利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。pushState()方法可以改变URL地址且不会发送请求，replaceState()方法可以读取历史记录栈，还可以对浏览器记录进行修改。 这两个方法应用于浏览器的历史记录栈，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。只是当它们执行修改时，虽然改变了当前的 URL，但浏览器不会立即向后端发送请求。

- abstract模式：支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。

### hash和history模式实现vue-router跳转api的区别

| **api** | **hash**                | **history**                 |
| ------- | ----------------------- | --------------------------- |
| push    | window.location.assign  | window.history.pushState    |
| replace | window.location.replace | window.history.replaceState |
| go      | window.history.go       | window.history.go           |
| back    | window.history.go(-1)   | window.history.go(-1)       |
| forward | window.history.go(1)    | window.history.go(1)        |

### 了解过动态路由吗

|         -          | 传参| 获取参数  | url| 参数问题  |
|:------------------:|--------------------------------------------------|-----------------------|----------------------------------------|-------|
| query  | this.$router.push({path: '/index',query:{id:id}}) | this.$route.query.id  | 127.0.0.1/#/index?id=1 | 不消失 |
| params | this.$router.push({name: 'index',params:{id:id} }） | this.$route.params.id | 127.0.0.1/#/index           | 消失  |

### route和router的区别

1、router是VueRouter的一个对象，通过Vue.use(VueRouter)和Vue构造函数得到一个router的实例对象，这个对象中是一个全局的对象，他包含了所有的路由，包含了许多关键的对象和属性。

![图片说明](https://uploadfiles.nowcoder.com/images/20211125/450310663_1637815290796/B986CD45CF885C06E7AE5774B27CAAD8)
2、route是一个跳转的路由对象，每一个路由都会有一个$route对象，是一个局部的对象，可以获取对应的name，path，params，query等

![图片说明](https://uploadfiles.nowcoder.com/images/20211125/450310663_1637815313031/A1F2AD1ABDD4A683F8D8F6B9B88E48A4)

> 从这两者不同的结构可以看出两者的区别，他们的一些属性是不同的
>
> $route.path 字符串，等于当前路由对象的路径，会被解析为绝对路径，如/home/index
>
> $route.params 对象，含路有种的动态片段和全匹配片段的键值对，不会拼接到路由的url后面
>
> $route.query 对象，包含路由中查询参数的键值对。会拼接到路由url后面
>
> $route.router 路由规则所属的路由器
>
> $route.matchd 数组，包含当前匹配的路径中所包含的所有片段所对象的配置参数对象
>
> $route.name 当前路由的名字，如果没有使用具体路径，则名字为空

### Vue-Router 的懒加载是如何实现的

- 这是一个普通的路由配置

```
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component:HelloWorld
        }
    ]
})
```

- vue异步组件实现懒加载

```
import Vue from 'vue'
import Router from 'vue-router'
/* 此处省去之前导入的HelloWorld模块 */
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      //此处对原代码进行修改
      component: resolve=>(require(["@/components/HelloWorld"],resolve))
    }
  ]
})
```

- import方法

```
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      //此处对原代码进行修改
      component: ()=>import("@/components/HelloWorld")
    }
  ]
})
```

**（拓展）组件懒加载**

- 这是一个普通的组件

```
<template>
  <div>
    <One></One>
  </div>
</template>

//JavaScript代码
import One from './one'
export default {
  components:{
    "One":One
  },
  data () {
    return {
      msg: 'This is a component'
    }
  }
}

```

- 异步方法

```
<template>
  <div>
    <One></One>
  </div>
</template>

//JavaScript代码
export default {
  components:{
  //原代码修改
    "One":resolve=>(['./one'],resolve)
  },
  data () {
    return {
      msg: 'This is a component'
    }
  }
}

```

- import方法

```
<template>
  <div>
    <One></One>
  </div>
</template>

//JavaScript代码
export default {
  components:{
    //原代码修改
    "One": ()=>import("./one");
  },
  data () {
    return {
      msg: 'This is a component'
    }
  }
}

```

### 路由导航守卫有哪些

- 全局守卫：beforeEach、beforeResolve、afterEach
- 路由独享守卫：beforeEnter
- 组件内的守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

<table> 
 <tbody>
  <tr> 
   <th>路由守卫</th> 
   <th>名称</th> 
   <th>作用</th> 
  </tr> 
  <tr> 
   <td rowspan="3">全局守卫</td> 
   <td>beforeEach（to，from，next）</td> 
   <td>路由跳转前触发，常用于登录验证。</td> 
  </tr> 
  <tr> 
   <td>beforeResolve（to，from，next）</td> 
   <td>在 beforeEach 和 组件内 beforeRouteEnter 之后，afterEach 之前调用。</td> 
  </tr> 
  <tr> 
   <td>afterEach（to，from）</td> 
   <td>发生在 beforeEach 和 beforeResolve 之后，beforeRouteEnter 之前。路由在触发后执行。</td> 
  </tr> 
  <tr> 
   <td>路由独享守卫</td> 
   <td>beforeEnter</td> 
   <td>在 beforeEach 之后执行，和它功能一样 ，不怎么常用</td> 
  </tr> 
  <tr> 
   <td rowspan="3">组件内的守卫</td> 
   <td>beforeRouteEnter</td> 
   <td>路由进入之前调用。不能获取组件 this 实例 ，因为路由在进入组件之前，组件实例还没有被创建。</td> 
  </tr> 
  <tr> 
   <td>beforeRouteUpdate</td> 
   <td>在当前路由改变时，并且该组件被复用时调用，可以通过 this 访问实例。当前路由 query 变更时，该守卫会被调用。</td> 
  </tr> 
  <tr> 
   <td>beforeRouteLeave</td> 
   <td>导航离开该组件的对应路由时调用，可以访问组件实例 this。</td> 
  </tr> 
 </tbody>
</table>


 **导航守卫的三个参数**

to：即将要进入的目标 路由对象。

from：当前导航正要离开的路由对象。

next：函数，必须调用，不然路由跳转不过去。

- `next()`：进入下一个路由。
- `next(false)`：中断当前的导航。
- `next('/')`或`next({ path: '/' })` : 跳转到其他路由，当前导航被中断，进行新的一个导航。

**触发钩子的完整顺序**

- 路由导航、[keep]()-alive、和组件生命周期钩子结合起来的，触发顺序，假设是从 a 组件离开，第一次进入 b 组件
    - 触发进入其他路由。
    - 调用要离开路由的组件守卫`beforeRouteLeave`
    - 调用局前置守卫：`beforeEach`
    - 在重用的组件里调用 `beforeRouteUpdate`
    - 调用路由独享守卫 `beforeEnter`。
    - 解析异步路由组件。
    - 在将要进入的路由组件中调用`beforeRouteEnter`
    - 调用全局解析守卫 `beforeResolve`
    - 导航被确认。
    - 调用全局后置钩子的 `afterEach` 钩子。
    - 触发DOM更新(`mounted`)。
    - 执行`beforeRouteEnter` 守卫中传给 next 的回调函数

### 说说你对router-link的了解

`<router-link>`是Vue-Router的内置组件，在具有路由功能的应用中作为声明式的导航使用。

`<router-link>`有8个props，其作用是：

| props              | 作用                                                                                         |
| ------------------ |--------------------------------------------------------------------------------------------|
| to                 | 必填，表示目标路由的链接。`<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>` |
| replace            | 默认值为false，若设置的话，当点击时，会调用`router.replace()`                                                 |
| append             | 设置 append 属性后，则在当前 (相对) 路径前添加基路径。                                                          |
| tag                | 让`<router-link>`渲染成tag设置的标签，如`tag:'li'`,渲染结果为`<li>foo</li>`                                  |
| active-class       | 默认值为router-link-active,设置链接激活时使用的 CSS 类名。                                                  |
| exact-active-class | 默认值为router-link-exact-active,设置链接被精确匹配的时候应该激活的 class。                                      |
| exact              | 是否精确匹配，默认为false。                                                                           |
| event              | 声明可以用来触发导航的事件。                                                                             |

## Vuex（重点）

###  vuex 的个人理解

vuex 是专门为 vue 提供的全局状态管理系统，用于多个组件中数据共享、数据缓存等。（无法持久化、内部核心原理是通过创造一个全局实例 new Vue）

主要包括以下几个模块：

- State：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
- Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
- Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
- Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
- Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。、

![图片说明](https://uploadfiles.nowcoder.com/images/20211122/450310663_1637588462901/FBACDE11D130071FC8D7ADB78F5BFA26)

### Vuex中action和mutation的区别

- action 提交的是 mutation，而不是直接变更状态。mutation 可以直接变更状态。
- action 可以包含任意异步操作。mutation 只能是同步操作。
- 提交方式不同，action 是用 `this.store.dispatch('ACTION_NAME',data)`来提交。mutation 是用 `this.store.commit('SET_NUMBER',10)`来提交。
- 接收参数不同，mutation 第一个参数是 state，而 action 第一个参数是 context

### Redux 和 Vuex的区别

**（1）Redux 和 Vuex区别**

- Vuex改进了Redux中的Action和Reducer函数，以mutations变化函数取代Reducer，无需switch，只需在对应的mutation函数里改变state值即可
- Vuex由于Vue自动重新渲染的特性，无需订阅重新渲染函数，只要生成新的State即可
- Vuex数据流的顺序是∶View调用store.commit提交对应的请求到Store中对应的mutation函数->store改变（vue检测到数据变化自动渲染）

通俗点理解就是，vuex 弱化 dispatch，通过commit进行 store状态的一次更变;取消了action概念，不必传入特定的 action形式进行指定变更;弱化reducer，基于commit参数直接对数据进行转变，使得框架更加简易;

**（2）共同思想**

- 单—的数据源
- 变化可以预测

本质上：redux与vuex都是对mvvm思想的服务，将数据从视图中抽离的一种方案; 形式上：vuex借鉴了redux，将store作为全局的数据中心，进行mode管理;

### 为什么要使用 Vuex 或者 Redux

由于传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致代码无法维护。

所以需要把组件的共享状态抽取出来，以一个全局单例模式管理。在这种模式下，组件树构成了一个巨大的"视图"，不管在树的哪个位置，任何组件都能获取状态或者触发行为。

另外，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，代码将会变得更结构化且易维护。

### 为什么 Vuex 的 mutation 中不能做异步操作？

- Vuex中所有的状态更新的唯一途径都是mutation，异步操作通过 Action 来提交 mutation实现，这样可以方便地跟踪每一个状态的变化，从而能够实现一些工具帮助更好地了解我们的应用。
- 每个mutation执行完成后都会对应到一个新的状态变更，这样devtools就可以打个快照存下来，然后就可以实现 time-travel 了。如果mutation支持异步操作，就没有办法知道状态是何时更新的，无法很好的进行状态的追踪，给调试带来困难。

### Vuex 页面刷新数据丢失怎么解决？

需要做 vuex 数据持久化 一般使用本地存储的方案来保存数据 可以自己设计存储方案 也可以使用第三方插件

推荐使用 vuex-persist 插件，它就是为 Vuex 持久化存储而生的一个插件。不需要你手动存取 storage ，而是直接将状态保存至 cookie 或者 localStorage 中。（Redux同理）

### Vuex 中 action 通常是异步的，那么如何知道 action 什么时候结束呢？

在 action 函数中返回 Promise，然后再提交时候用 then 处理。

### 在模块中，getter 和 mutation 和 action 中怎么访问全局的 state 和 getter？

- 在 getter 中可以通过第三个参数 rootState 访问到全局的 state,可以通过第四个参数 rootGetters 访问到全局的 getter。
- 在 mutation 中不可以访问全局的 satat 和 getter，只能访问到局部的 state。
- 在 action 中第一个参数 context 中的 `context.rootState`访问到全局的 state，`context.rootGetters`访问到全局的 getter。

## Vue指令

### 平时有用过哪些指令

- 主要有`v-show`、`v-if`、`v-else-if`、`v-else`、`v-for`、`v-on`、`v-bind`、`v-model`、`v-once`、`v-slot`、`v-html`、`v-text`。

### v-if、v-show、v-html 的原理

- v-if 会调用 addIfCondition 方法，生成 vnode 的时候会忽略对应节点，render 的时候就不会渲染；
- v-show 会生成 vnode，render 的时候也会渲染成真实节点，只是在 render 过程中会在节点的属性中修改 show 属性值，也就是常说的 display；
- v-html 会先移除节点下的所有节点，调用 html 方法，通过 addProp 添加 innerHTML 属性，归根结底还是设置 innerHTML 为 v-html 的值。

### v-if 和 v-show 的区别

| Vue指令  | v-if                                                         | v-show                                              |
| -------- | ------------------------------------------------------------ | --------------------------------------------------- |
| 共同点   | 动态显示DOM元素                                              | 动态设置DOM元素                                     |
| 手段     | 动态的向DOM树内添加或者删除DOM元素                           | 设置DOM元素的display样式属性控制显示和隐藏          |
| 编译过程 | 有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件 | 简单的基于CSS切换                                   |
| 编译条件 | 如果初始条件为假，则不进行操作；只有在条件第一次变为真时才开始局部编译 | 在任何条件下都会被编译，然后被缓存，而且DOM元素保留 |
| 性能消耗 | v-if有更高的切换消耗                                         | v-show有更高的初始渲染消耗                          |
| 使用场景 | v-if适合条件不太可能改变，也就是不需要频繁切换条件的场景     | v-show适合频繁切换的场景                            |

### v-if和v-for中key的作用

vue 中 key 值的作用可以分为两种情况来考虑，

- 第一种情况是 v-if 中使用 key。由于 Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。因此当使用 v-if 来实现元素切换的时候，如果切换前后含有相同类型的元素，那么这个元素就会被复用。如果是相同的 input 元素，那么切换前后用户的输入不会被清除掉，这样是不符合需求的。因此可以通过使用 key 来唯一的标识一个元素，这个情况下，使用 key 的元素不会被复用。这个时候 key 的作用是用来标识一个独立的元素。
- 第二种情况是 v-for 中使用 key。用 v-for 更新已渲染过的元素列表时，它默认使用“就地复用”的策略。如果数据项的顺序发生了改变，Vue 不会移动 DOM 元素来匹配数据项的顺序，而是简单复用此处的每个元素。因此通过为每个列表项提供一个 key 值，来以便 Vue 跟踪元素的身份，从而高效的实现复用。这个时候 key 的作用是为了高效的更新渲染虚拟 DOM。

> 题外话：当然，在开发过程并非一定要使用key，如果只是为了简单展示数据，其实也可以index来标识，视情况而定就好啦。

### v-for 与 v-if 的优先级

1、v-for优先于v-if被解析；

2、如果同时出现，每次渲染都会先执行循环再判断条件，无论如何循环都不可避免，浪费了性能；

3、要避免出现这种情况，则在外层嵌套template，在这一层进行v-if判断，然后在内部进行v-for循环；

4、如果条件出现在循环内部，可通过计算属性提前过滤掉那些不需要显示的项。

### 为什么不建议用index作为key?

使用index 作为 key和没写基本上没区别，因为不管数组的顺序怎么颠倒，index 都是 0, 1, 2...这样排列，导致 Vue 会复用错误的旧子节点，做很多额外的工作。

### 为什么避免 v-if 和 v-for 同时使用

vue2.x 中v-for优先级高于v-if，vue3.x 相反。所以2.x 版本中在一个元素上同时使用 v-if 和 v-for 时，v-for 会优先作用，造成性能浪费；3.x 版本中 v-if 总是优先于 v-for 生效，导致v-if访问不了v-for中的变量。

解析：

一般我们在两种常见的情况下会倾向于这样做：

- 为了过滤一个列表中的项目 (比如 v-for="user in users" v-if="user.isActive")。在这种情形下，请将 users 替换为一个计算属性 (比如 activeUsers)，让其返回过滤后的列表。
- 为了避免渲染本应该被隐藏的列表 (比如 v-for="user in users" v-if="shouldShowUsers")。这种情形下，请将 v-if 移动至容器元素上 (比如 ul、ol)。

当 Vue 处理指令时，v-for 比 v-if 具有更高的优先级，所以这个模板：

```
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

将会经过如下运算：

```
this.users.map(function (user) {
  if (user.isActive) {
    return user.name
  }
})
```

因此哪怕我们只渲染出一小部分用户的元素，也得在每次重渲染的时候遍历整个列表，不论活跃用户是否发生了变化。

通过将其更换为在如下的一个计算属性上遍历：

```
computed: {
  activeUsers: function () {
    return this.users.filter(function (user) {
      return user.isActive
    })
  }
}
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

我们将会获得如下好处：

- 过滤后的列表只会在 users 数组发生相关变化时才被重新运算，过滤更高效。
- 使用 v-for="user in activeUsers" 之后，我们在渲染的时候只遍历活跃用户，渲染更高效。
- 解耦渲染层的逻辑，可维护性 (对逻辑的更改和扩展) 更强。

为了获得同样的好处，我们也可以把：

```
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

更新为：

```
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

通过将 v-if 移动到容器元素，我们不会再对列表中的每个用户检查 shouldShowUsers。取而代之的是，我们只检查它一次，且不会在 shouldShowUsers 为否的时候运算 v-for。

反例：

```
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>

<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

正确例子

```
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>

<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

### v-on可以绑定多个方法吗

```
<p v-on="{click:one,mousemove:two}">v-on绑定多个方法</p>//这里绑定一个点击事件和鼠标移动事件
```

## Vue属性

### methods watch和compute的区别

|      -       | computed                                                   | watch                                        | methods                            |
| :----------: | ---------------------------------------------------------- | -------------------------------------------- | ---------------------------------- |
|   作用机制   | 自动调用，完成我们希望完成的作用                           | 自动调用，完成我们希望完成的作用             | 主动调用                           |
|     性质     | 计算属性，事实上和data对象里的数据属性是相同的             | 类似于监听机制跟事件机制                     | 定义的是函数，使用时跟函数调用一样 |
|     缓存     | 支持缓存，只有依赖的数据发生了变化，才会重新计算           | 不支持缓存，数据变化时，它就会触发相应的操作 | 无                                 |
| 是否支持异步 | 不支持异步，当 Computed 中有异步操作时，无法监听数据的变化 | 支持异步监听                                 | 支持异步处理                       |
|     场景     | 一个数据受多个数据影响                                     | 一个数据影响多个数据                         | 提供可调用的函数                   |

- computed和methods关于缓存的一个小细节
  - 在computed中定义一个计算属性，并且返回new Date()，可以发现多次返回的时间是相同的。这是因为new Date()不是依赖型数据（不是放在data对象下的实例数据），所以computed只提供了缓存的值，而没有重新计算。这也是整理这方面的知识过程发现的一个小细节。
- watch和computed处理场景的对比

**watch**

![图片说明](https://uploadfiles.nowcoder.com/images/20211125/450310663_1637815826668/EDE822BF9C7370A70FF4516FB69BAD49)

**computed**

![图片说明](https://uploadfiles.nowcoder.com/images/20211125/450310663_1637815841308/BE8A0A4A38C5798B5E89FB203690EF81)

## 虚拟DOM（重点/加分项）

### 讲一下Virtual DOM

由于在浏览器中操作 DOM 是很昂贵的。频繁操作 DOM，会产生一定性能问题。这就是虚拟 Dom 的产生原因。Vue2 的 Virtual DOM 借鉴了开源库 snabbdom 的实现。Virtual DOM 本质就是用一个原生的 JS 对象去描述一个 DOM 节点，是对真实 DOM 的一层抽象。

**优点：**

- 保证性能下限：框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，他的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，既保证性能的下限。
- 无需手动操作 DOM：我们不需手动去操作 DOM，只需要写好 View-Model 的 代码逻辑，框架会根据虚拟 DOM 和数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率。
- 跨平台：虚拟 DOM 本质上是 JavaScript 对象，而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器端渲染、weex 开发等等。

**缺点：**

- 无法进行极致优化：虽然虚拟 DOM + 合理的优化，足以应对大部分应用的性能需要，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。
- 首次渲染大量 DOM 时，由于多了一层 DOM 计算，会比 innerHTML 插入慢。

### 了解diff算法吗

- 首先，对比节点本身，判断是否为同一节点，如果不为相同节点，则删除该节点重新创建节点进行替换
- 如果为相同节点，进行patchVnode，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的children没有子节点，将旧的子节点移除)
- 比较如果都有子节点，则进行updateChildren，判断如何对这些新老节点的子节点进行操作（diff核心）。
- 匹配时，找到相同的子节点，递归比较子节点

> 拓展

patchVnode函数做了哪些操作

- 找到对应的`真实DOM`，称为`el`
- 判断`newVnode`和`oldVnode`是否指向同一个对象，如果是，那么直接`return`
- 如果他们都有文本节点并且不相等，那么将`el`的文本节点设置为`newVnode`的文本节点。
- 如果`oldVnode`有子节点而`newVnode`没有，则删除`el`的子节点
- 如果`oldVnode`没有子节点而`newVnode`有，则将`newVnode`的子节点真实化之后添加到`el`
- 如果两者都有子节点，则执行`updateChildren`函数比较子节点，这一步很重要

updateChildren方法

![图片说明](https://uploadfiles.nowcoder.com/images/20211125/450310663_1637815927899/46111CA32D8132A7379223F6525D3177)

> 另外，如果一开始oldL在newNode的指针找不到时，新列表的第一个节点b去旧列表进行遍历比较，这里会有两种情况，`找到相同节点`和`没找到相同节点`
>
> 找到的情况，在旧节点中找到相同节点b，将节点b移动到首位，然后重新开始进行双端的步骤对比。如果在旧节点找不到，则在头部直接添加新节点，并将newL指针指向下一位，再继续进行对比。

## 拓展

### （其他）Vue 3.0

### Vue3.0有什么更新

**（1）监测机制的改变**

- 3.0 将带来基于代理 Proxy的 observer 实现，提供全语言覆盖的反应性跟踪。
- 消除了 Vue 2 当中基于 Object.defineProperty 的实现所存在的很多限制：

**（2）只能监测属性，不能监测对象**

- 检测属性的添加和删除；
- 检测数组索引和长度的变更；
- 支持 Map、Set、WeakMap 和 WeakSet。

**（3）模板**

- 作用域插槽，2.x 的机制导致作用域插槽变了，父组件会重新渲染，而 3.0 把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升了渲染的性能。
- 同时，对于 render 函数的方面，vue3.0 也会进行一系列更改来方便习惯直接使用 api 来生成 vdom 。

**（4）对象式的组件声明方式**

- vue2.x 中的组件是通过声明的方式传入一系列 option，和 TypeScript 的结合需要通过一些装饰器的方式来做，虽然能实现功能，但是比较麻烦。
- 3.0 修改了组件的声明方式，改成了类式的写法，这样使得和 TypeScript 的结合变得很容易

**（5）其它方面的更改**

- 支持自定义渲染器，从而使得 weex 可以通过自定义渲染器的方式来扩展，而不是直接 fork 源码来改的方式。
- 支持 Fragment（多个根节点）和 Protal（在 dom 其他部分渲染组建内容）组件，针对一些特殊的场景做了处理。
- 基于 tree shaking 优化，提供了更多的内置功能。

### Vue3.0 为什么要用 proxy？

在 Vue2 中， 0bject.defineProperty 会改变原始数据，而 Proxy 是创建对象的虚拟表示，并提供 set 、get 和 deleteProperty 等处理器，这些处理器可在访问或修改原始对象上的属性时进行拦截，有以下特点∶

- 不需用使用 `Vue.$set` 或 `Vue.$delete` 触发响应式。
- 全方位的数组变化检测，消除了Vue2 无效的边界情况。
- 支持 Map，Set，WeakMap 和 WeakSet。

Proxy 实现的响应式原理与 Vue2的实现原理相同，实现方式大同小异∶

- get 收集依赖
- Set、delete 等触发依赖
- 对于集合类型，就是对集合对象的方法做一层包装：原方法执行后执行依赖相关的收集或触发逻辑。

### 了解过Vue插槽吗，有几种？

slot 又名插槽，是 Vue 的内容分发机制，组件内部的模板引擎使用 slot 元素作为承载分发内容的出口。插槽 slot 是子组件的一个模板标签元素，而这一个标签元素是否显示，以及怎么显示是由父组件决定的。slot 又分三类，默认插槽，具名插槽和作用域插槽。

- 默认插槽：又名匿名插槽，当 slot 没有指定 name 属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽，作为找不到匹配的内容片段时的备用插槽。
- 具名插槽：带有具体名字的插槽，也就是带有 name 属性的 slot，一个组件可以出现多个具名插槽。
- 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。

> 实现原理：当子组件 vm 实例化时，获取到父组件传入的 slot 标签的内容，存放在 `vm.slot`中，默认插槽为 `vm.slot.default`，具名插槽为 `vm.slot.xxx`，xxx 为插槽名，当组件执行渲染函数时候，遇到 slot 标签，使用`$slot`中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。

### （其他）对 React 和 Vue 的理解，它们的异同

**相似之处：**

- 都将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库；
- 都有自己的构建工具，能让你得到一个根据最佳实践设置的项目模板；
- 都使用了Virtual DOM（虚拟DOM）提高重绘性能；
- 都有props的概念，允许组件间的数据传递；
- 都鼓励组件化应用，将应用分拆成一个个功能明确的模块，提高复用性。

**不同之处 ：**

**1）数据流**

Vue默认支持数据双向绑定，而React一直提倡单向数据流

**2）虚拟DOM**

Vue2.x开始引入"Virtual DOM"，消除了和React在这方面的差异，但是在具体的细节还是有各自的特点。

- Vue宣称可以更快地计算出Virtual DOM的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。
- 对于React而言，每当应用的状态被改变时，全部子组件都会重新渲染。当然，这可以通过 PureComponent/shouldComponentUpdate这个生命周期方法来进行控制，但Vue将此视为默认的优化。

**3）组件化**

React与Vue最大的不同是模板的编写。

- Vue鼓励写近似常规HTML的模板。写起来很接近标准 HTML元素，只是多了一些属性。
- React推荐你所有的模板通用JavaScript的语法扩展——JSX书写。

具体来讲：React中render函数是支持闭包特性的，所以import的组件在render中可以直接调用。但是在Vue中，由于模板中使用的数据都必须挂在 this 上进行一次中转，所以 import 一个组件完了之后，还需要在 components 中再声明下。

**4）监听数据变化的实现原理不同**

- Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能
- React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的vDOM的重新渲染。这是因为 Vue 使用的是可变数据，而React更强调数据的不可变。

**5）高阶组件**

react可以通过高阶组件（HOC）来扩展，而Vue需要通过mixins来扩展。

高阶组件就是高阶函数，而React的组件本身就是纯粹的函数，所以高阶函数对React来说易如反掌。相反Vue.js使用HTML模板创建视图组件，这时模板无法有效的编译，因此Vue不能采用HOC来实现。

**6）构建工具**

两者都有自己的构建工具：

- React ==> Create React APP
- Vue ==> vue-cli

**7）跨平台**

- React ==> React Native
- Vue ==> Weex

### 有做过哪些性能优化？

- 对象层级不要过深，否则性能就会差。
- 不需要响应式的数据不要放在 data 中（可以使用 Object.freeze() 冻结数据）
- v-if 和 v-show 区分使用场景
- computed 和 watch 区分场景使用
- 大数据列表和表格性能优化——虚拟列表 / 虚拟表格
- 防止内部泄露，组件销毁后把全局变量和时间销毁
- 服务端渲染
- 图片懒加载
- 路由懒加载
- 适当采用 [keep]()-alive 缓存组件
- 开启 gzip 压缩
- 防抖、节流的运用

### 服务端渲染了解过吗？

- 服务端渲染（SSR），`也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端`。
- SSR 有着更好的 SEO、并且首屏加载速度更快等优点。不过它也有一些缺点，比如我们的开发条件会受到限制，服务器端渲染只支持 `beforeCreate`和 `created`两个钩子，当我们需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境。还有就是服务器会有更大的负载需求。

大致流程就是将 Source（源码）通过 webpack 打包出两个 bundle，其中 Server Bundle 是给服务端用的，服务端通过渲染器 bundleRenderer 将 bundle 生成 html 给浏览器用；另一个 Client Bundle 是给浏览器用的，别忘了服务端只是生成前期首屏页面所需的 html ，后期的交互和数据处理还是需要能支持浏览器脚本的 Client Bundle 来完成。
![图片说明](https://uploadfiles.nowcoder.com/images/20211125/450310663_1637816033667/40DF413592EA16F57C3332AEE124FBD6)
一个小栗子

```
// 第 1 步：创建一个 Vue 实例
const Vue = require('vue')
const app = new Vue({
  template: `<div>Hello World</div>`
})
// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer()
// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
  // => <div data-server-rendered="true">Hello World</div>
})
```

上面例子利用 `vue-server-renderer` npm 包将一个vue示例最后渲染出了一段 html。将这段html发送给客户端就轻松的实现了服务器渲染了。

```
const server = require('express')()
server.get('*', (req, res) => {
  // ... 生成 html
  res.end(html)
})
server.listen(8080)
```

### 服务端渲染和客户端渲染的区别

<table> 
 <tbody>
  <tr> 
      <th>-</th>
   <th>客户端渲染</th> 
   <th>服务端渲染</th> 
  </tr> 
  <tr> 
   <td>html的生成原理</td> 
   <td>由js生成html</td> 
   <td>由后台语言通过一些模板引擎生成</td> 
  </tr> 
  <tr> 
   <td rowspan="5">优点</td> 
   <td>前端做视图和交互</td> 
   <td>响应快，用户体验好</td> 
  </tr> 
  <tr> 
   <td>后端提供接口，数据</td> 
   <td>搜索引擎友好，有seo优化</td> 
  </tr> 
  <tr> 
   <td>前后端分离</td> 
   <td>nodejs层服务器渲染，前端性能优化更顺手</td> 
  </tr> 
  <tr> 
   <td>前端做路由</td> 
   <td>可操作空间更大</td> 
  </tr> 
  <tr> 
   <td>服务器计算压力变轻</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>缺点</td> 
   <td>用户等待时间变长，尤其是请求数多且有一定先后顺序的时候</td> 
   <td>增加服务器计算压力；如果不是增加node中间层，前后端分工不明，不能很好的并行并发</td> 
  </tr> 
  <tr> 
   <td rowspan="3">耗时比较</td> 
   <td>数据请求：客户端在不同网络环境进行数据请求，外网http请求开销大，导致时间差</td> 
   <td>数据请求：服务端在内网请求，数据响应速度快</td> 
  </tr> 
  <tr> 
   <td>步骤：客户端需要等待js代码下载，加载完成在请求数据，渲染</td> 
   <td>步骤：服务端是先请求数据再渲染可视化部分，即服务端不需要等待js代码下载，并会返回一个已经有内容的页面</td> 
  </tr> 
  <tr> 
   <td>渲染内容：客户端渲染，是经历一个从无到有完整的渲染步骤</td> 
   <td>渲染内容：服务端先渲染可视化部分，客户端再做二次渲染</td> 
  </tr> 
  <tr> 
   <td>适合场景</td> 
   <td>单页面应用，如Vue</td> 
   <td>用户体验比较高的比如首屏加载，重复较多的公共页面可以使用服务器渲染，减少ajax请求，提高用户体验</td> 
  </tr> 
 </tbody>
</table>


### 讲讲图片懒加载

- 图片懒加载大概思路，渲染时设置一个节点的自定义属性，比如说 `data-src`,然后值为图片 url 地址，图片的 src 属性指向懒加载的封面，监听 scroll 事件，通过 `getClientBoundingRect`API 获得图片相对视口的位置，当图片距离视口底部一定时，替换 url 地址。达成目标；
- 当浏览器支持 `Intersection Observer`API 时，可以使用该构造函数创建一个观察者，观察所有待懒加载的图片资源；
- 现在浏览器原生支持图片和 iframe 懒加载，使用 `loading="lazying"`，不过不太可控，而且浏览器兼容性并不好。

```
<img v-lazy="/static/img/01.png"/>
```

### gzip 压缩了解多少

gizp压缩是一种http请求优化方式，通过减少文件体积来提高加载速度。html、js、css文件甚至json数据都可以用它压缩，可以减小60%以上的体积。前端配置gzip压缩，并且服务端使用nginx开启gzip，用来减小网络传输的流量大小。

牛富贵：命令行执行：`npm i compression-webpack-plugin -D`

牛富贵：在webpack的dev开发配置文件中加入如下代码:

```
const CompressionWebpackPlugin = require('compression-webpack-plugin')
plugins: [
   new CompressionWebpackPlugin()
]
```

启用gzip压缩打包之后，会自动生成gz包。目前大部分主流浏览器客户端都是支持gzip的，不支持gzip格式文件的会默认访问源文件的，故不要配置清除源文件。配置好之后，打开浏览器访问线上，F12查看控制台，如果该文件资源的响应头里显示有Content-Encoding: gzip，表示浏览器支持并且启用了Gzip压缩的资源。

### 实现一个axios拦截器

- 新建 request.js 文件,导入 axios

```
新建 request.js 文件,导入 axios
```

- 创建一个 axios 的实例

```
const request = axios.create({
  baseURL: xxx,
  // baseURL: '项目基地址'
  timeout: 5000 // 设置 5 秒延时关闭请求
}) 
```

- 设置请求拦截器

```
// request.interceptors.request.use() // 请求拦截器
request.interceptors.request.use(config => {

  config.headers.Authorization = `Bearer ${token}` // 设置请求头携带 token
  return config 
}, error => {
  console.log(error) // 发生错误打印
  return error
})
```

- 设置响应拦截器

```
// request.interceptors.response.use() // 响应拦截器
request.interceptors.response.use(config => {
  return config // 成功直接返回
}, error => {
  if (error.response.status === 401) { //如果发生错误,查看错误码是多少 401 为权限不够,token 过期
    alert('token 请求超时!请重新登录!')
    // 进行操作,如删除 vuex 中过期用户数据等一系列操作
    router.push('/login') // 强行返回到登录页
  }
  return error
})
```

- 导出 axios 实例

```
export default request
```

### 如何中断axios请求

官方提供了两种方法

- 使用 `CancelToken.source` 工厂方法创建 cancel token

```
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
     // 处理错误
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');
```

- 通过传递一个 executor 函数到 `CancelToken` 的构造函数来创建 cancel token

```
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
});

// cancel the request
cancel();
```

### Vue渲染大量数据时应该怎么优化

对于长列表，通常分两种情况来优化。

- 一是静态列表：如果这个列表仅仅用于数据的展示，不会有任何数据变化，那么就不需要作响应式处理。但由于 vue中data 是响应式的，所以我们可以利用 `Object.freeze` 将其冻结起来。

```
export default {
  data: () => {
    return {
      users: [
        /* a long static list */
      ]
    };
  },
  async create() {
    const users = await axios.get("/users");
    //数据冻结
    this.users = Object.freeze(users);
  }
};
```

> Object.freeze() 方法可以冻结一个对象，冻结指的是不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性。该方法返回被冻结的对象。

```
//举个栗子
let arr = [0];
Object.freeze(a); // 数组中数据不能被修改了.

arr[0] = 1; // fails silently
arr.push(2); // fails silently
```

- 二是虚拟滚动：对于大数据的长列表，如果一次性全部渲染，显然是非常消耗性能的，所以可以采用虚拟滚动技术，只渲染被展示出来的部分

1、假设有 1 万条记录需要同时渲染，我们屏幕的`可见区域`的高度为 `500px`,而列表项的高度为 `50px`，则此时我们在屏幕中最多只能看到 10 个列表项，那么在首次渲染的时候，我们只需加载 10 条即可。

![图片说明](https://uploadfiles.nowcoder.com/images/20211125/450310663_1637816277039/53ACFB9BB61D6B850355A77B1588245E)

2、当滚动发生时，我们可以通过计算当前滚动值得知此时在屏幕`可见区域`应该显示的列表项。

3、假设滚动发生，滚动条距顶部的位置为 `150px`,则我们可得知在可见区域内的列表项为第 4 项至第 13 项。

4、实现

虚拟列表的实现，实际上就是在首屏加载的时候，只加载`可视区域`内需要的列表项，当滚动发生时，动态通过计算获得`可视区域`内的列表项，并将`非可视区域`内存在的列表项删除。
![图片说明](https://uploadfiles.nowcoder.com/images/20211125/450310663_1637816301915/E75BC01B7A0210A63B85D3F1B71DFC82)

5、页面结构

```
//可视化区域容器
<div class="list-container">
    //真实数据容器，以便生成滚动条
    <div class="list-phantom"></div>
    //渲染区域
    <div class="list">
      <!-- item(1) -->
      <!-- item(2) -->
      <!-- ...... -->
      <!-- item(3) -->
    </div>
</div>
```

6、接着，监听 `list-container`的 `scroll`事件，获取滚动位置 `scrollTop`

![图片说明](https://uploadfiles.nowcoder.com/images/20211125/450310663_1637816374514/7F2FC0003979A152B28730E1D4702FDC)

推算出：

- 列表总高度 `listHeight` = listData.length * itemSize
- 可显示的列表项数 `visibleCount` = Math.ceil(screenHeight / itemSize)
- 数据的起始索引 `startIndex` = Math.floor(scrollTop / itemSize)
- 数据的结束索引 `endIndex` = startIndex + visibleCount
- 列表显示数据为 `visibleData` = listData.slice(startIndex,endIndex)
- 偏移量 `startOffset` = scrollTop - (scrollTop % itemSize);

7、完整版
```vue
<template>
  <div ref="list" class="list-container" @scroll="scrollEvent($event)">
    <div class="list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="list" :style="{ transform: getTransform }">
      <div ref="items"
        class="list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{ height: itemSize + 'px',lineHeight: itemSize + 'px' }"
      >{{ item.value }}</div>
    </div>
  </div>
</template>
```
```vue
export default {
  name:'VirtualList',
  props: {
    //所有列表数据
    listData:{
      type:Array,
      default:()=>[]
    },
    //每项高度
    itemSize: {
      type: Number,
      default:200
    }
  },
  computed:{
    //列表总高度
    listHeight(){
      return this.listData.length * this.itemSize;
    },
    //可显示的列表项数
    visibleCount(){
      return Math.ceil(this.screenHeight / this.itemSize)
    },
    //偏移量对应的 style
    getTransform(){
      return `translate3d(0,${this.startOffset}px,0)`;
    },
    //获取真实显示列表数据
    visibleData(){
      return this.listData.slice(this.start, Math.min(this.end,this.listData.length));
    }
  },
  mounted() {
    this.screenHeight = this.$el.clientHeight;
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  data() {
    return {
      //可视区域高度
      screenHeight:0,
      //偏移量
      startOffset:0,
      //起始索引
      start:0,
      //结束索引
      end:null,
    };
  },
  methods: {
    scrollEvent() {
      //当前滚动位置
      let scrollTop = this.$refs.list.scrollTop;
      //此时的开始索引
      this.start = Math.floor(scrollTop / this.itemSize);
      //此时的结束索引
      this.end = this.start + this.visibleCount;
      //此时的偏移量
      this.startOffset = scrollTop - (scrollTop % this.itemSize);
    }
  }
};
```