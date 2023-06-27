---
title: Performance（工具&api）
postTime: 2023-6-26
categories:
  - 前端笔记
tags:
  - 性能优化
---

## 前言

`Performance`  一个在前端开发领域中，无法被忽视的存在，如果我们的开发是一个满足需求就可以的产品，那么可能就用不到它；但是如果我们想对我们的这个产品，做一个极致的优化，那么  `Performance`  是一个很好的选择，也是一个不容忽视的选择。

## Performance 工具 和 api 的优缺点

### `Performance 工具`  优点：

- 可视化图形界面
- 每毫秒做的事情
- 文件的执行加载的顺序
- 每毫秒界面展示的效果
- 每个方法执行的顺序和时间（由下至上）
- 倒置的事件火焰图（由下至上）
- 数据总结

### `Performance 工具`  缺点：

- 无法查看某一个区间之内的运行时间
- 无法查看  `js`  堆的大小使用情况及限制
- 无法查看页面是刷新还是加载，重定向次数
- 无法查看什么时间开始做的性能测试
- 可以在资源缓存已满的时候进行回调处理
- 设置浏览器应在其性能条目缓冲区中保存的最大性能条目对象数

### `Performance api`  优点：

- 完全弥补了  `Performance 工具`  的缺点，还可以让我们通过数据的方式去知道具体的时间

### `Performance api`  缺点：

- 无法像  `Performance 工具`  那样图形化的去查看数据信息

大致的介绍了一下工具和 api 的优缺点，其实很明显的可以看出来，它们是相辅相成的，其实在一般的工具当中，我们会使用其中的某一个去进行性能的优化，但是对于一个想要进行真正的，彻底性的性能优化，还是需要两者之间的配合，去进行更高效、更系统、更全面的优化。

## Performance 工具

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cf1f82f767344d6836a48f15579a6cf~tplv-k3u1fbpfcp-zoom-1.image)

这就是  `Performance 工具`  的界面。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35340953dede41a6aa7bebf2be7445ec~tplv-k3u1fbpfcp-zoom-1.image)

- 上下箭头，就是用来上传和下载每一次性能检测报告的；
- `no recordings`  就是每一次的检测报告，可以根据每一次的检测报告，去进行性能优化的对比；
- `Screenshots`  是用来查看在每个时间段界面的变化；
- `Memory`  存储调用栈的大小，在不同时间段的不同大小；

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa35f91690ba43a7a09bf92750ed42f9~tplv-k3u1fbpfcp-zoom-1.image)

- `Disable Javascript samples`  禁用  `javascript`  调用栈，在后面讲解  `Main`  部分进行详解；
- `Enable advanced paint instrumentation (slow)`  记录渲染事件的细节；
- `Network`  用来修改检测在不同的网络环境下，界面的渲染；
- `CPU`  用来查看电脑的性能问题；

到这里呢，简单的介绍了一下上面几个按钮真正的意义，下面结合可视化的图表在配上面这些按钮进行性能的检测：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc2e1c78a6e14dcfae361551597745a2~tplv-k3u1fbpfcp-zoom-1.image)

这个性能检测是对掘金网站 --> 我的主页做的性能优化检测截图

### 第一部分：概览

这里最主要是整体的界面渲染的时候，每个时间段执行的事件顺序，通过上图，我们就能知道我们每个时间段（精确到毫秒）都做了什么，当鼠标放上去的时候，我们还可以大图的形式去查看我们每个时间段界面的渲染情况：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c448442f92804119af65e263980d945b~tplv-k3u1fbpfcp-zoom-1.image)

当在这里通过点击滑动到某一位置松开的时候，可以查看某一个区间直接的一个渲染情况

### 第二部分：Network

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1400e5f577a473ea6117ec45a8555a6~tplv-k3u1fbpfcp-zoom-1.image)

`Network`  这里我们可以看出来，我们资源加载的一个顺序情况，什么时间加载了什么资源，通过这里，我们更直观的可以知道，**资源是并行加载的**

### 第三部分：Frames

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54ba13ab59ee42b0b625853a9a72ee94~tplv-k3u1fbpfcp-zoom-1.image)

`Frames`  这里，其实就是查看我们在什么时间，界面发生了改变，它和第一部分的区别就是在界面没有改变的时候，它是不做记录的，但是概览部分是会做记录的

### 第四部分： Interactions

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e027945e3e87466c872fc59c9e17f3a7~tplv-k3u1fbpfcp-zoom-1.image)

在我看过的文章里，很少看到会有这部分，是因为在不适用一些交互动作的时候，是不会有这部分的功能的，从这里我们看到了掘金使用了一些动画的动作

### 第五部分：Timings

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c8286aa37044b21be12a190cf388d4d~tplv-k3u1fbpfcp-zoom-1.image)

这张图不是掘金官网的，因为在项目打包后，就没有对应的事件调用，所以在线上经过打包的网站，是看不到这部分的

### 第六部分：Main

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b6b36a8f87e49728f3b691a6fb43e3a~tplv-k3u1fbpfcp-zoom-1.image)

这里就是  `Performance 工具`  当中比较核心的一部分，俗称  **火焰图** , 这里是一个由下而上的事件执行图，你可以简单的理解成上面这是一个汇总

### 第七部分：Raster

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6e4f73c35464068bc4cc50e3359ea8b~tplv-k3u1fbpfcp-zoom-1.image)

通过这里，我们知道掘金官网，在前端部分一共使用了几条线程

```
复制代码
这里有一个知识点，这里是指浏览器渲染的线程，而不是js的线程，特此声明一下，怕被有的同学拿js单线程来喷我😹
```

### 第八部分： GPU

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1144a4ea85284773aeb54d798607ee1e~tplv-k3u1fbpfcp-zoom-1.image)

这里我们可以很清楚的看出来，网站在什么时间有  `GPU`  加速

### 第九部分：taskSchedulerForegroundBlockingWorker

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c72339e1fa144badb556bf4dfc3bd05e~tplv-k3u1fbpfcp-zoom-1.image)

任务计划程序前台阻止工作程序，这里我用的很少，也是第一次见，等的我明确一下这里是做什么的，在进行更新，如果有知道的朋友，也可以评论告诉我，我及时进行改进

### 第十部分：Memory

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1032b308e5924b1099f6ba3d0802fa39~tplv-k3u1fbpfcp-zoom-1.image)

上面有提到  `Memory`  选项，在勾选后，就会显示该事件折线图，通过该图，可以看出我们在不同的时间段，不同事件的执行情况

### 第十一部分：性能检测详情

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0adcd676ad834206a0c4b1121f2e45fc~tplv-k3u1fbpfcp-zoom-1.image)

上面有 4 个标签：`Summary（性能摘要）` 、 `Bottom-Up（事件列表，由下至上，对应 Main 火焰图）` 、 `Call Tree（每个事件的子项信息）` 、 `Event log（事件日志）`

接下来，我们依次详解

#### Summary（性能摘要）

其实我们一看就明白，它是一个用来统计在我们检测性能的时间范围内，都做了哪些事情：

- `Loading` ：加载时间
- `Scripting` ：js 计算时间
- `Rendering` ：渲染时间
- `Painting` ：绘制时间
- `Other` ：其他时间
- `Idle` ：浏览器闲置时间

#### Bottom-Up（事件列表）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd6dd0743f004dd7b372d84777c6988e~tplv-k3u1fbpfcp-zoom-1.image)

这里和  `Main`  里面看见的，其实是一个对应着的关系，从这里，我们可以看见所有的事件列表，还有每个事件的  `Self Time（自己调用的时间）` 、 `Total Time（总调用时间，包括子项调用时间）` 、 `Activity（行为，包括调用该事件的位置）`

#### Call Tree（事件子项信息）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11c14465e31142cabc3d9161213ebbf4~tplv-k3u1fbpfcp-zoom-1.image)

其实这里和  `Bottom-Up`  部分是一样的，就不做太多的说明了，大家看一下就知道了

#### Event Log（事件日志）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d550949f6294382897ff1c29b5e09bc~tplv-k3u1fbpfcp-zoom-1.image)

这里比前面的  `Bottom-Up`  和  `Call Tree`  相比，多了一个  `Start Time`  属性，这个属性其实就是开始的时间，从什么时间开始执行的什么事件

到这里，有关  `Performance 工具`  的介绍，就到了这里了，如果有什么解释不清楚的，或者有问题的地方，还请大家评论指出，我做及时的更正

下面，给大家介绍  `Performance Api`

## Performance API

`Performance`  用来获取当前页面的性能信息，它和  `Performance 工具`  的区别在上面我们已经写出来了，就不在这里啰嗦了

```
复制代码
注意：除了以下指出的情况外，该接口及其成员在 Web Worker 中可用。
此外，还需注意，performance 的创建和衡量都是同一环境下的。
即，如果你在主线程（或者其他 worker）中创建了一个 performance，那么它在另外的 worker 线程中是不可用的；反之亦然。
```

接下来，我们先介绍一下  `Performance API`  的属性：

---

### `Performance.navigation（操作相关）`

该属性是一个对象，有两个属性值，分别是  `redirectCount（重定向次数）` 、 `type（操作的类型）`：

#### `redirectCount`

该属性值为几，就说明了当前页面重定向了多少次；

#### `type`

`type(0)`：当前页面是通过点击链接，书签和表单提交，或者脚本操作，或者在 url 中直接输入地址;

`type(1)`：点击刷新页面按钮或者通过 Location.reload()方法显示的页面；

`type(2)`：页面通过历史记录和前进后退访问时；

`type(255)`：任何其他方式

---

### `Performance.timing（延迟相关）`

当前页面中与时间相关的信息：

#### `navigationStart`

从同一个浏览器的上一个页面卸载  `unload`  结束时的时间戳（精确到毫秒）

#### `unloadEventStart`

`unload`  事件执行时的时间戳。如果没有上一个页面，或者如果先前的页面或所需的重定向之一不是同一个来源, 这个值会返回 0

#### `unloadEventEnd`

`unload`  事件执行完的时间戳。如果没有上一个页面，或者如果先前的页面或所需的重定向之一不是同一个来源, 这个值会返回 0

#### `redirectStart`

第一个 HTTP 重定向开始时得时间戳。如果没有上一个页面，或者如果先前的页面或所需的重定向之一不是同一个来源, 这个值会返回 0

#### `redirectEnd`

最后一个 HTTP 重定向完成时（也就是说是 HTTP 响应的最后一个字节直接被收到的时间）的时间戳

#### `fetchStart`

表征了浏览器准备好使用 HTTP 请求来获取(fetch)文档的时间戳。这个时间点会在检查任何应用缓存之前

#### `domainLookupStart`

表征了域名查询开始的时间戳。如果使用了持续连接，或者这个信息存储到了缓存或者本地资源上，这个值将和  `PerformanceTiming.fetchStart`  一致

#### `domainLookupEnd`

表征了域名查询结束的时间戳。如果使用了持续连接，或者这个信息存储到了缓存或者本地资源上，这个值将和  `PerformanceTiming.fetchStart`  一致

#### `connectStart`

返回 HTTP 请求开始向服务器发送时的时间戳。如果使用持久连接，则返回值等同于  `fetchStart`  属性的值

#### `connectEnd`

返回浏览器与服务器之间的连接建立时的时间戳。如果建立的是持久连接，则返回值等同于  `fetchStart`  属性的值。连接建立指的是所有握手和认证过程全部结束

#### `secureConnectionStart`

返回浏览器与服务器开始安全链接的握手时的时间戳。如果当前网页不要求安全连接，则返回 0

#### `requestStart`

返回浏览器向服务器发出 HTTP 请求时（或开始读取本地缓存时）的时间戳

#### `responseStart`

返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的时间戳。如果传输层在开始请求之后失败并且连接被重开，该属性将会被数制成新的请求的相对应的发起时间

#### `responseEnd`

返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时（如果在此之前 HTTP 连接已经关闭，则返回关闭时）的时间戳

#### `domLoading`

返回当前网页 DOM 结构开始解析时（即  `Document.readyState`  属性变为  `loading` 、相应的  `readystatechange`  事件触发时）的时间戳

#### `domInteractive`

返回当前网页 DOM 结构结束解析、开始加载内嵌资源时（即  `Document.readyState`  属性变为  `interactive` 、相应的  `readystatechange`  事件触发时）的时间戳

#### `domContentLoadedEventStart`

返回当解析器发送  `DOMContentLoaded`  事件，即所有需要被执行的脚本已经被解析时的时间戳

#### `domContentLoadedEventEnd`

返回当所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间戳

#### `domComplete`

返回当前文档解析完成，即  `Document.readyState`  变为  `complete`  且相对应的  `readystatechange`  被触发时的时间戳

#### `loadEventStart`

返回该页面下，`load`  事件被发送时的时间戳。如果这个事件还未被发送，它的值将会是 0

#### `loadEventEnd`

返回当  `load`  事件结束，即加载事件完成时的时间戳。如果这个事件还未被发送，或者尚未完成，它的值将会是 0

---

### `Performance.memory（js堆相关）`

js 堆有关的信息：

#### `jsHeapSizeLimit`

js 堆大小限制

#### `totalJSHeapSize`

js 堆总大小

#### `usedJSHeapSize`

使用了 js 堆的大小

---

### `Performance.timeOrigin（性能检测开始时间）`

这个属性返回的是性能测量开始时的时间的高精度时间戳，`number`  类型

`Performance`  还有一个事件：

---

### `Performance.onresourcetimingbufferfull（性能缓存区已满时回调）`

这个事件当浏览器的资源时间性能缓冲区已满时会触发

下面介绍一下  `Performance`  对象的方法：

---

### `Performance.clearMarks()`

将给定的 mark 从浏览器的性能输入缓冲区中移除

---

### `Performance.clearMeasures()`

将给定的 measure 从浏览器的性能输入缓冲区中

---

### `Performance.clearResourceTimings()`

从浏览器的性能数据缓冲区中移除所有  `entryType`  是  `resource`  的  `performance entries`

---

### `Performance.getEntries(PerformanceEntryFilterOptions)`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a286aadfa94141f7b3cd3c8a62137ef5~tplv-k3u1fbpfcp-zoom-1.image)

#### `PerformanceEntryFilterOptions`  参数

可选参数，该参数是一个对象，可接受三个属性：

- `name`： `performance entry`  的名字
- `entryType`：`entry`  类型. 合法的  `entry`  类型可以从  `PerformanceEntry.entryType`  方法获取
- `initiatorType`：初始化资源的类型，例如：`xmlhttprequest` 、 `other` 、 `script`

#### `Performance.getEntries`  返回值

`Performance.getEntries(PerformanceEntryFilterOptions)`  返回值数组成员按  `PerformanceEntry.startTime`  时间顺序排列

如果没有符合  `filter`  条件的对象，那么返回空数组. 如果不带任何参数，返回全部  `entries`

由于返回值是一个数组，所以我们接下来讲解一下每一个数组项的每一个属性的意思：

- `connectEnd`：连接结束时间
- `connectStart`：连接开始时间
- `decodedBodySize`：解码的主体大小
- `domComplete`：`dom`  渲染完成时间
- `domContentLoadedEventEnd`：`dom`  内容加载事件结束时间
- `domContentLoadedEventStart`：`dom`  内容加载事件开始时间
- `domInteractive`：`dom`  交互时间
- `domainLookupEnd`：域查找结束时间
- `domainLookupStart`：域查找开始时间
- `duration`：事件耗时
- `encodedBodySize`：编码主体大小
- `entryType`：资源输入类型
- `fetchStart`：获取资源开始时间
- `initiatorType`：发起人类型
- `loadEventEnd`：加载事件结束时间
- `loadEventStart`：加载事件开始时间
- `name`：这里一般就是当前请求的  `url`  的地址
- `nextHopProtocol`：下一个跳转协议
- `redirectCount`：重定向次数
- `redirectEnd`：重定向开始时间，如果没有重定向，值为 0
- `redirectStart`：重定向结束时间，如果没有重定向，值为 0
- `requestStart`：请求开始时间
- `responseEnd`：响应结束时间
- `responseStart`：响应开始时间
- `secureConnectionStart`：安全连接开始时间
- `serverTiming`：服务器时间
- `startTime`：开始时间
- `transferSize`：传递大小
- `type`：该事件的类型
- `unloadEventEnd`：卸载事件结束时间
- `unloadEventStart`：卸载事件开始时间
- `workerStart`：`worker`  开始时间

---

### `Performance.mark(name)`

根据给出  `name`  值，在浏览器的性能输入缓冲区中创建一个相关的时间戳

---

### `Performance.measure(name, startMark, endMark)`

这里接收三个参数：

- `name`：测量的名字
- `startMark`：测量的开始标志名字（也可以是  `PerformanceTiming`  属性的名称）
- `endMark`：测量的结束标志名字（也可以是  `PerformanceTiming`  属性的名称）

---

### `Performance.getEntriesByName(name, type)`

这里接收两个参数：

- `name`：测量的名字
- `type`：测量的类型（`frame, navigation` 、`resource` 、 `mark` 、`measure` 、`paint`）

---

### `Performance.getEntriesByType(type)`

接收一个参数，`type`  同上面  `Performance.getEntriesByName(name, type)`  的  `type`

---

### `Performance.now()`

返回一个表示从性能测量时刻开始经过的毫秒数

---

### `Performance.setResourceTimingBufferSize(maxSize)`

设置浏览器应在其性能条目缓冲区中保存的最大性能条目对象数

---

### `Performance.toJSON()`

返回  `Performance`  对象的  `JSON`  对象

---

`Performance API`  的介绍也差不多了，浏览器的兼容性也是很不错的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da52eb73e9c64d9b8994a9329dd82e35~tplv-k3u1fbpfcp-zoom-1.image)

基本上在我们项目当中去做性能检测是没有问题的，毕竟我们是肯定不能把有关性能检测的代码打包到项目当中

### `Performance API 的简单使用`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5c820b7ff7c4a6593e860934f4aad04~tplv-k3u1fbpfcp-zoom-1.image)

这是我写的一个小 demo ，大致的意思：

就是我们在定时器执行前，添加了个标记  `measure-start`；

在定时器执行后，又添加了个标记  `measure-end`；

测量一下两个标记之间的开始时间和持续时间  `measure-list`；

最后清除所有  `marks`  的标志位和  `measures`  的标志位；

从这个小 demo 我们就能看出来它的实用性和方便性，从这里我们就可以看出来，`Performance API`  可以横跨很多个方法，去检测它的调用时间，而  `Performance 工具`  就没有办法做到这一点

这就是我所说的相辅相成的关键点所在
