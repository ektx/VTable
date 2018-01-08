# VTable

vue.js 表格效果

## 使用

```html
<!DOCTYPE html>
<html>
<head>
	<title>简单表格</title>
	<!-- 1.表格样式 -->
	<link rel="stylesheet" type="text/css" href="src/VTable.css">
	...
</head>
<body>
    <!-- 3.表格内容 -->
	<div id="show-table">
		<!-- 5.使用 VTable 组件生成表格 -->
		<v-table 
			:header="tableHeader" 
			:data="tableData"
		></v-table>
	</div>
  
    <!-- 2.VTable html 引用模板: src/template.html -->
    <script type="text/x-template" id="v-table-mod">
    ...
    </script>
  
    <script>
    // 4.实例化
    var table = new Vue({
        el: '#show-table',
        data: {
            // 表格中间内容
            tableData: {},
            // 表格的头信息,具体参考 demo
            tableHeader: {}
        },
        mounted: function () {
            var _ = this;

            // 加载数据
            $.ajax({
                url: 'mock/table.json',
                type: 'get'
            })
            .done(function(data) {
                // 赋值给表格
                _.tableData = data
            })
            .fail(function(err) {
                // 请求数据错误时
                console.error(err)
            })
        }
    })
    </script>
</body>
</html>
```

1. 引用样式表

2. 添加组件模板（可以通过 ajax 加，参考 VTable.html）

3. 添加你要的生成的元素

4. 实例化对象，添加表格头等相关信息

5. 添加组件引用 VTable

   ​

## 参数

#### 主体说明

| 参数     | 说明          |
| ------ | ----------- |
| header | 表格头信息（必填）   |
| data   | 表格主体信息（必填）  |
| left   | 表格左侧信息（非必填） |
|        |             |

```html
<v-table 
    :header="tableHeader" 
    :data="tableData"
    left="tableLeft"
></v-table>
```

#### 头部说明

| 参数       | 说明                      |
| -------- | ----------------------- |
| text     | 显示内容                    |
| width    | 列宽，没有children时添加        |
| children | 子表信息                    |
| type     | leftAside 侧边专用，用于突出侧边区域 |

```javascript
// 表格头
var header = [
    {
        "text": "",
        "width": 400,
        "type": "leftAside"
    },
    {
        "text": "2017",
        "children": [
            {
                "text": "Q1",
                "children": [
                    {
                        "text": "1月",
                        "width": 100
                    },
                    {
                        "text": "2月",
                        "width": 100
                    },
                    {
                        "text": "3月",
                        "width": 100
                    }
                ]
            }
          ]
    }
  ]
```

