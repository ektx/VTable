
// 注册组件
Vue.component('VTable', {
	// 名称有冲突时，你可以修改这个 #v-table-mod 和修改模板
	template: '#v-table-mod',
	props: {
		// 表格头
		header: {
			type: Array,
			default: []
		},
		// 表格数据
		data: {
			type: Array,
			default: []
		},
		// 表格侧边
		left: {
			type: Object,
			default: {
				data: [],
				width: []
			}
		}
	},
	data: function() {
		return {
			headBox: null,
			headColWidth: [],
			headTableW: 0,
			headerFormat: [],

			body: this.data,
			bodyBox: null,
			bodyColWidth: [],
			bodyTextAlign: [],
			bodyTableW: 0,
			bodyFormat: [],


			leftBox: null,
			asideDeep: 0,
			leftAsidwW: 0,
			leftFormat: [],

			mouseoverEleTagName: null
		}
	},
	watch: {
		header: function(newVal, oldVal) {
			this.formatTableHeaderData(newVal, 0, 'headerFormat')
		},

		data: {
			handler: function (newVal, oldVal) {
				this.formatBody(newVal)
			},
			deep: true
		},

		'left.data': function (newVal, oldVal) {
			this.formatAside(newVal)
		}
	},
	methods: {
		// 滚动条功能
		scrollEvt: function(evt) {

			if (evt.target.tagName === this.mouseoverEleTagName) {

				var left = evt.target.scrollLeft;
				var top = evt.target.scrollTop;

				if (evt.target.tagName === 'ASIDE') {
					this.bodyBox.querySelector('.v-table-inner').scrollTop = top
				} else {
					this.headBox.scrollLeft = left
					this.leftBox.scrollTop = top
				}

				this.$emit('scroll', {
					top: top,
					left: left
				})
			}
		},

		/*
			格式化表格数据
			------------------------------------
			@json  [object] 数据
			@level [number] 层级
			@type  [string] 格式化的对象
		*/
		formatTableHeaderData: function(json, level, type, parent) {
			var _ = this
			var maxLevel = 0

			this.headerFormat = []
			// 清列宽
			this.headColWidth = []
			this.bodyColWidth = []
			// 清宽度
			this.headTableW = 0
			this.bodyTableW = 0
			// 清字体对齐
			this.bodyTextAlign = []

			// 给父级追加合并
			var loopParent = function(myParent, my) {

				myParent.colspan += my.colspan - 1

				if (myParent._parent)
					loopParent(myParent._parent, myParent)

			}

			var loop = function (json, level, type, parent) {

				if(!_[type][level]) {
					_[type][level] = []
				}

				json.forEach(function(val, i) {
					var colspan = 1
					var rowspan = 1
					var hasChild = false
					var parentData = {}

					if ('children' in val) {
						hasChild = true
						colspan = val.children.length
					} 

					parentData = {
						text: val.text,
						colspan: colspan,
						rowspan: rowspan,
						_level: level,
						_parent: parent,
						_children: hasChild
					}

					if (hasChild) {

						loop(val.children, level + 1, type, parentData)
					}

					// 格式数据
					_[type][level].push(parentData)

					if ('width' in val && !val.children) {
						_.headColWidth.push(val.width)
						_.headTableW += val.width

						if (!val.type && val.type !== 'leftAside') {

							_.bodyColWidth.push( val.width )
							_.bodyTableW += val.width

							_.bodyTextAlign.push( val.textAlign ? val.textAlign : 'left' )
						}
					}

					if (level > maxLevel) {
						maxLevel = level
					}
				})
			}

			loop(json, level, type, parent)

			this.headerFormat.forEach(function(val, i) {

				val.forEach(function(vArr, vI) {
					if (vArr._parent) {
						if (vArr._level > 0 && vArr.colspan > 1) {
							loopParent(vArr._parent, vArr)
						}
					}

					if (vArr.colspan == 1 && !vArr._children) {
						vArr.rowspan = maxLevel - vArr._level + 1
						
					}
				})
			})

			// 更新 dom
			this.$nextTick(function() {
				this.updateTable()
			})
		},

		/*
			格式化侧边的数据
		*/
		formatAside: function(arr) {

			var _ = this

			var loopAsideArr = function(arr, level, parent) {

				arr.forEach(function(val, i) {

					var hasChild = false
					var myChildren = 0

					if ('children' in val) {
						hasChild = true
						myChildren = val.children.length
					}
					
					// 判断行是否为数组
					if (!_.leftFormat[ _.asideDeep ]) {
						_.leftFormat[ _.asideDeep ] = []
					}

					_.leftFormat[ _.asideDeep ][level] = {
						text: val.text,
						colspan: 1,
						rowspan: hasChild ? myChildren : 1,
						_parent: parent ? parent : null,
						_children: hasChild,
						_level: level
					}

					if (hasChild) {
						// 给父级追加合并
						var loopParent = function(_p) {

							if (_p && _p.rowspan) {
								_p.rowspan += myChildren - 1

								loopParent(_p._parent)
							}

						}

						if (level > 0 && parent) {
							loopParent(parent)
						}

						loopAsideArr( val.children, level + 1 , _.leftFormat[ _.asideDeep ][level])

					} else {
						_.asideDeep ++
					}
				})
			}

			loopAsideArr( arr, 0 )

			var asideThSize = _.left.width.length

			_.leftFormat = _.leftFormat.map(function(val) {
				return val.filter(function(_val) {
					var result = []

					if (_val) {

						if (_val._level > 0 && !_val._children && _val._level < asideThSize) {
							_val.colspan = asideThSize - _val._level
						}

						return _val
					}

				})
			})

			// 清 0
			_.leftAsidwW = 0
			// 重新计算
			_.left.width.forEach(function(val) {
				_.leftAsidwW += val
			})

		},

		formatBody: function(arr) {
			var _ = this
			var holderExpand = '_NEED_'
			_.bodyFormat = []
			arr.forEach(function(val, i) {

				var innerArr = []
				if (holderExpand === '_NEED_') {

					val.forEach(function(inner, inxdex) {
						var isObj = inner instanceof Object
						var type = 'text'
						var expandVal = ''

						if (isObj && 'type' in inner) {
							type = inner.type

							if (type === 'expand') {
								holderExpand = inner.expand ? '_NEED_' : '_NOT_'
								expandVal = inner.expand
							}
						}

						innerArr.push({
							text: isObj ? inner.text : inner,
							colspan: isObj ? inner.cols : 1,
							rowspan: 1,
							type: type,
							expand: expandVal
						})
					})
				} else {
					holderExpand = '_NEED_'
				}

				_.bodyFormat.push(innerArr)
				
			})

		},

		/*
			更新表格布局
			--------------------------------
		*/
		updateTable: function() {
			this.headBox = this.$el.querySelector('.v-table-header')
			this.bodyBox = this.$el.querySelector('.v-table-body')

			this.leftBox = this.$el.querySelector('.vtable-fixed-left-mod')

			this.bodyBox.style.top = this.headBox.scrollHeight + 'px'
		},

		/*
			鼠标滚动对象
		*/
		mouseoverEvt: function(evt) {
			this.mouseoverEleTagName = evt.target.tagName
		},

		/*
			添加行
		*/
		insert: function (index, data) {

			var data = [{
				text: data,
				colspan: this.headColWidth.length,
				rowspan: 1
			}]

			this.bodyFormat.splice(index + 1, 0, data)
		},

		/* 移除 */
		remove: function (index) {
			this.bodyFormat.splice(index, 1)
		},

		toggleRowData: function (trIndex, tdIndex) {
			var that = this.data[trIndex][tdIndex]
			
			that.expand = !that.expand
			
			this.formatBody(this.data)

			this.$emit('toggle', {
				status: that.expand,
				statusMes: that.expand ? '展开' : '收缩',
				tr: {
					index: trIndex,
					data: this.data[trIndex]
				},
				td: {
					index: tdIndex,
					data: that
				}
			})
		}	
	},
	created: function() {

		this.formatTableHeaderData(this.header, 0, 'headerFormat')

		if (this.left) {
			this.formatAside(this.left.data)
		}

	}
})