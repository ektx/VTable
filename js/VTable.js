
// 注册
Vue.component('VTable', {
	template: '#v-table-mod',
	props: ['header', 'left', 'data'],
	data: function() {
		return {
			headBox: null,
			bodyBox: null,
			rowWidth: [],
			tableW: 0,
			tableFormat: [],
			headerFormat: [],

			leftBox: null,
			leftFormat: [],
			asideDeep: 0,
			leftAsidwW: 0,

			mouseoverEleTagName: null
		}
	},
	watch: {
		data: function(newVal, oldVal) {

			this.$nextTick(function() {
				this.updateTable()
			})
		},

		header: function(newVal, oldVal) {
			
			this.formatTableHeaderData(newVal, 0, 'headerFormat')
			console.log(this.header)
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
			var _ = this;

			if(!_[type][level]) {
				_[type][level] = []
			}

			json.forEach(function(val, i) {
				var colspan = 1
				var rowspan = 1

				if ('children' in val) {
					_.formatTableHeaderData(val.children, level + 1, type, parent)
					
					colspan = val.children.length
				} 
				

				// 格式数据
				_[type][level].push({
					text: val.text,
					colspan: colspan,
					rowspan: rowspan,
					_level: level,
					_parent: parent
				})

				if ('width' in val) {
					_.rowWidth.push(val.width)
					_.tableW += val.width
				}
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
							_val.colspan = asideThSize - _val._level + 1
						}

						return _val
					}

				})
			})

			_.left.width.forEach(function(val) {
				_.leftAsidwW += val
			})

		},

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
		}	
	},
	created: function() {

		console.log('表格头', this.header)
		this.formatTableHeaderData(this.header, 0, 'headerFormat')
		console.log(this.headerFormat)


		console.log('表格左侧', this.left)
		this.formatAside(this.left.data)
		console.log(this.leftFormat)

		console.log('表格数据', this.data)

		// if (this.data) {
		// 	// 
		// }



	},
	mounted: function() {

		
		
	}
})