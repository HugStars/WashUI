<template>
    <h1>按钮</h1>
    <h2>基本</h2>
    <p>按钮的 <code>type</code> 分别由 <code>default</code> 、 <code>primary</code> 、 <code>info</code> 、
        <code>success</code> 、 <code>error</code> 、 <code>warn</code> 、 <code>help</code> 7 种属性组成
    </p>
    <c-card>
        <c-button>default</c-button>
        <c-button type="primary">primary</c-button>
        <c-button type="info">info</c-button>
        <c-button type="success">success</c-button>
        <c-button type="error">error</c-button>
        <c-button type="warn">warn</c-button>
        <c-button type="help">help</c-button>
    </c-card>

    <h2>尺寸</h2>
    <p>尺寸由 4 种属性组成 ： <code>mini</code> 、 <code>small</code> 、 <code>medium</code> 、 <code>large</code></p>
    <c-card>
        <c-button size="mini">mini</c-button>
        <c-button size="small">small</c-button>
        <c-button size="medium">medium</c-button>
        <c-button size="large">large</c-button>
    </c-card>

    <h2>宽高</h2>
    <p>当组件的 4 个尺寸都不符合需求时，可以通过 `w` 和 `h` 来设置组件的宽高</p>
    <p>当设置了宽时，元素内容过长溢出时会默认显示省略号</p>
    <c-card>
        <c-button w="200px">自定义宽</c-button>
        <c-button h="50px">自定义高</c-button>
        <c-button w="200px" h="50px">自定义宽时文本默认溢出隐藏</c-button>
    </c-card>

    <h2>颜色</h2>
    <p>当组件的 4 个尺寸都不符合需求时，可以通过 <code>w</code> 和 <code>h</code> 来设置组件的宽高</p>
    <c-card>
        <c-button color="#A9F">自定义颜色</c-button>
        <c-button color="#90AD58">自定义颜色</c-button>
        <c-button color="rgb(10 216 120)">自定义颜色</c-button>
        <c-button color="rgb(20,134,231)">自定义颜色</c-button>
    </c-card>

    <h2>更多属性</h2>
    <ul>
        <li>圆角 ： <code>round</code> 、 <code>circle</code></li>
        <li>透明 ： <code>transparent</code> 、 <code>fade</code></li>
        <li>虚线 ： <code>dotted</code> 、 <code>dashed</code></li>
        <li>文本 ： <code>text</code></li>
        <li>禁用 ： <code>disabled</code></li>
    </ul>
    <c-card>
        <c-button round>round</c-button>
        <c-button circle>circle</c-button>
        <c-button transparent>transparent</c-button>
        <c-button fade>fade</c-button>
        <c-button dotted>dotted</c-button>
        <c-button dashed>dashed</c-button>
        <c-button text>text</c-button>
        <c-button disabled>disabled</c-button>
    </c-card>
    <div style="height: 100px;"></div>
</template>