import * as echarts from 'echarts';
import 'echarts-extension-amap';

const $echarts = echarts;

import utils from './utils.js'
import config from './config.js'

export default {
	/**
	 * 创建图表标题
	 * @param {Object} title
	 */
	createChartTitle: (title) => {
		return {
			show: true,
			text: title,
			textStyle: {
				color: "#ddd",
				fontWeight: 'normal'
			},
			x: 'center',
			y: '5vh'
		}
	},
	/**
	 * 创建图表背景
	 * @param {Object} title
	 */
	createChartGaid: (left, right, top, bottom) => {
		return {
			left: left ? left : '30vh',
			right: right ? right : '10vh',
			top: top ? top : '10vh',
			bottom: bottom ? bottom : '40vh'
		}
	},
	/**
	 * 创建图表背景
	 * @param {Object} title
	 */
	createChartBaseOption: function (title, left, right, top, bottom, categorys) {
		return {
			title: this.createChartTitle(title),
			tooltip: {
				show: true,
				trigger: 'axis'
			},
			grid: this.createChartGaid(left, right, top, bottom),
			xAxis: {
				type: 'category',
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				axisLabel: {
					color: this.getChartXTextColor()
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				boundaryGap: false,
				data: categorys
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					color: this.getChartYTextColor(),
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				splitLine: {
					lineStyle: {
						color: this.getChartYColor(),
						type: 'dashed'
					},
				}
			}
		}
	},
	/**
	 * 获取x轴颜色
	 * @param {Object} title
	 */
	getChartXColor: () => {
		return '#ffffff88'
	},
	/**
	 * 获取x轴文本颜色
	 * @param {Object} title
	 */
	getChartXTextColor: () => {
		return '#ffffff88'
	},
	/**
	 * 获取y轴颜色
	 * @param {Object} title
	 */
	getChartYColor: () => {
		return '#ffffff88'
	},
	/**
	 * 获取y轴文本颜色
	 * @param {Object} title
	 */
	getChartYTextColor: () => {
		return '#ffffff88'
	},


	initMapChart: function (title, ele, chinaGeoCoordMap, chinaDatas) {
		let lines = [];
		let points = [];
		let points1 = [];
		let lines1 = [];

		for (let i = 0; i < chinaDatas.length; i++) {
			let dataItem = chinaDatas[i];
			let fromCoord = chinaGeoCoordMap[dataItem[0].name];
			let toCoord = [116.436561, 39.897346];
			if (!fromCoord || !toCoord) return
			if (i % 2 == 0) {
				lines.push([{
					coord: toCoord,
				},
				{
					coord: fromCoord,
					value: dataItem[0].value,
				},
				]);
				points.push([fromCoord[0], fromCoord[1], 11]);
			} else {
				lines1.push([{
					coord: fromCoord,
				},
				{
					coord: toCoord,
					value: dataItem[0].value,
				},
				]);
				points1.push([fromCoord[0], fromCoord[1], 11]);
			}


			for (let j = 0; j < chinaDatas.length; j++) {
				if (i == j || j % 5 == 0 || j % 5 == 1 || j % 5 == 4) {
					continue;
				}
				let toCoord = chinaGeoCoordMap[chinaDatas[j][0].name];
				lines.push([{
					coord: toCoord,
				},
				{
					coord: fromCoord,
					value: dataItem[0].value,
				}]);
			}
		}

		let option = {
			title: this.createChartTitle(title),
			amap: {
				rotateEnable: true,
				pitchEnable: true,
				pitch: 0,
				// rotation: -45,
				// 3D模式，无论你使用的是1.x版本还是2.x版本，都建议开启此项以获得更好的渲染体验
				// viewMode: '3D',
				// 高德地图支持的初始化地图配置
				// 高德地图初始中心经纬度
				center: [105.436561, 33.998546],
				// 高德地图初始缩放级别
				zoom: 4,
				// 是否开启resize
				resizeEnable: true,
				// 自定义地图样式主题
				mapStyle: 'amap://styles/darkblue',
				// 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
				renderOnMoving: true,
				// 设置 ECharts 图层是否可交互 默认为 true
				// 设置为 false 可实现高德地图自身图层交互
				// 此配置项从 v1.9.0 起开始支持
				echartsLayerInteractive: true,
				// 是否启用大数据模式 默认为 false
				// 此配置项从 v1.9.0 起开始支持
				largeMode: false
				// 说明：如果想要添加卫星、路网等图层
				// 暂时先不要使用layers配置，因为存在Bug
				// 建议使用amap.add的方式，使用方式参见最下方代码
			},
			series: [{
				type: 'lines',
				zlevel: 2,
				coordinateSystem: 'amap',
				effect: {
					show: true,
					period: 4, //箭头指向速度，值越小速度越快
					trailLength: 0.01, //特效尾迹长度[0,1]值越大，尾迹越长重
					symbol: 'arrow', //箭头图标
					symbolSize: 5, //图标大小
					// color: function(pama){debugger
					// 	// '#FFE269'
					// 	return config.colors[pama.dataIndex%config.colors.length];
					// },
					color: "#FF5722"
				},
				lineStyle: {
					color: function (pama) {
						return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: config.colors[pama.dataIndex % config.colors.length] + '22'//'rgb(255,226,105,0)',
						},
						{
							offset: 0.5,
							color: config.colors[pama.dataIndex % config.colors.length] + '08'//'rgb(255,226,105,0.5)',
						},
						{
							offset: 1,
							color: config.colors[pama.dataIndex % config.colors.length] + 'ff'//'rgb(255,226,105,1)',
						},
						])
					},
					width: 1, //尾迹线条宽度
					opacity: 1, //尾迹线条透明度
					curveness: 0.3, //尾迹线条曲直度
				},
				data: lines,
			}, {
				type: 'lines',
				zlevel: 2,
				coordinateSystem: 'amap',
				effect: {
					show: true,
					period: 4, //箭头指向速度，值越小速度越快
					trailLength: 0.01, //特效尾迹长度[0,1]值越大，尾迹越长重
					symbol: 'arrow', //箭头图标
					symbolSize: 5, //图标大小
				},
				lineStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#00CAFF66',
					},
					{
						offset: 0.5,
						color: '#00CAFFaa',
					},
					{
						offset: 1,
						color: '#00CAFFff',
					},
					]),
					width: 1, //尾迹线条宽度
					opacity: 1, //尾迹线条透明度
					curveness: .3 //尾迹线条曲直度
				},
				data: lines1
			}, {
				type: 'effectScatter',
				zlevel: 5,
				// 使用百度地图坐标系
				coordinateSystem: 'amap',
				//设置图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
				// symbol: 'image://http://localhost:3000/src/assets/video.png',
				symbol: 'circle',
				// //标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10
				symbolSize: [20, 20],
				itemStyle: {
					color: '#FF5252', //标志颜色
				},
				// 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
				data: [
					[116.436561, 39.897346, 11]
				],
				rippleEffect: {
					scale: 6,
					brushType: "stroke"
				},
				// hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果。
			}, {
				type: 'effectScatter',
				zlevel: 3,
				// 使用百度地图坐标系
				coordinateSystem: 'amap',
				//设置图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
				// symbol: 'image://http://localhost:3000/src/assets/video.png',
				symbol: 'circle',
				// //标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10
				symbolSize: [10, 10],
				itemStyle: {
					// color: '#fac858', //标志颜色
					color: function (pama) {
						return config.colors[pama.dataIndex % config.colors.length];
					}
				},
				// 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
				data: points,
				rippleEffect: {
					scale: 6,
					brushType: "stroke"
				},
				// hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果。
			}, {
				type: 'effectScatter',
				zlevel: 3,
				// 使用百度地图坐标系
				coordinateSystem: 'amap',
				//设置图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
				// symbol: 'image://http://localhost:3000/src/assets/video.png',
				symbol: 'circle',
				// //标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10
				symbolSize: [10, 10],
				itemStyle: {
					// color: '#00CAFF', //标志颜色
					color: function (pama) {
						return config.colors[pama.dataIndex % config.colors.length];
					}
				},
				// 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
				data: points1,
				rippleEffect: {
					scale: 6,
					brushType: "stroke"
				},
				// hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果。
			}]
		}

		// 使用刚指定的配置项和数据显示图表。

		let mapchart = $echarts.init(document.getElementById(ele));
		mapchart.setOption(option);

		// 获取 ECharts 高德地图组件
		var amapComponent = mapchart.getModel().getComponent('amap');
		// 获取高德地图实例，使用高德地图自带的控件(需要在高德地图js API script标签手动引入)
		var amap = amapComponent.getAMap();
		// 添加控件
		amap.addControl(new AMap.Scale());
		amap.addControl(new AMap.ToolBar());
		amap.addControl(new AMap.ControlBar());
		// 禁用 ECharts 图层交互，从而使高德地图图层可以点击交互
		amapComponent.setEChartsLayerInteractive(false);

		return mapchart;
	},
	initPieChart: function (option, category, values, title) {
		let datas = [];
		category.forEach((item, index) => {
			datas.push({
				value: values[index],
				name: item
			});
		});
		let option_ = {
			color: config.colors,
			title: title ? this.createChartTitle(title) : null,
			grid: {
				top: title ? '10%' : '0%'
			},
			xAxis: {
				show: false
			},
			yAxis: {
				show: false
			},
			legend: {
				right: '0',
				y: 'center',
				data: category,
				orient: 'vertical',
				textStyle: {
					color: '#fff'
				},
				itemGap: 10
			},
			series: [{
				name: '告警级别分布',
				type: 'pie',
				center: ['40%', title ? '55%' : '50%'],
				radius: ['75%', '55%'],
				avoidLabelOverlap: true,
				itemStyle: {
					borderRadius: 15,
					borderColor: 'rgba(200,200,200,0.3)',
					borderWidth: 0,
					shadowColor: 'rgba(200, 200, 200, 0.5)',
					shadowBlur: 5
				},
				label: {
					show: true,
					color: '#fff',
					position: 'outside',
					fontSize: 14,
					textBorderWidth: 0,
					// textShadowBlur:0
				},
				labelLine: {
					show: true,
					length: 20,
					length2: 25,
					lineStyle: {
						width: 2
					}
				},
				data: datas
			}]
		};
		for (let key in option_) {
			option[key] = option_[key];
		}
	},
	initPieFullChart: function (option, category, values, title) {
		let datas = [];
		category.forEach((item, index) => {
			datas.push({
				value: values[index],
				name: item
			});
		});
		let option_ = {
			color: config.colors,
			title: title ? this.createChartTitle(title) : null,
			grid: {
				top: title ? '10%' : '0%'
			},
			xAxis: {
				show: false
			},
			yAxis: {
				show: false
			},
			legend: {
				right: 0,
				top: 0,
				y: 'center',
				data: category,
				orient: 'horizontal',
				textStyle: {
					color: '#fff'
				},
				itemGap: 10
			},
			series: [{
				name: '告警级别分布',
				type: 'pie',
				top: 30,
				center: ['50%', title ? '55%' : '50%'],
				// radius: ['85%', '15%'],
				avoidLabelOverlap: true,
				selectedOffset: 10,
				roseType: 'area',
				itemStyle: {
					borderRadius: 10,
					borderColor: 'rgba(200,200,200,0.3)',
					borderWidth: 0,
					shadowColor: 'rgba(200, 200, 200, 0.5)',
					shadowBlur: 5
				},
				label: {
					show: true,
					color: '#fff',
					position: 'outside',
					fontSize: '1.2rem',
					textBorderWidth: 0,
					// textShadowBlur:0
				},
				labelLine: {
					show: true,
					length: 10,
					length2: 10,
					lineStyle: {
						width: 1
					}
				},
				data: datas
			}]
		};
		for (let key in option_) {
			option[key] = option_[key];
		}
	},
	initBarChart: function (option, category, values, color, title) {
		// let title_ = utils.createChartTitle(title);
		let option_ = {
			backgroundColor: '#000000',
			title: title ? this.createChartTitle(title) : null,
			grid: this.createChartGaid('30vh', '10vh', title ? '35vh' : "15vh", "20vh"),
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
			},
			xAxis: {
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				axisLabel: {
					color: this.getChartXTextColor()
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: category,
				type: 'category',
			},
			yAxis: {
				axisLabel: {
					color: this.getChartYTextColor(),
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				splitLine: {
					lineStyle: {
						color: this.getChartYColor(),
						type: 'dashed'
					},
				},
				name: '',
			},
			series: [{
				name: "数据",
				data: values,
				type: 'bar',
				barWidth: '20vh',
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: color + 'ff',
					},
					{
						offset: 1,
						color: color + 'bb',
					}
					]),
					borderRadius: [10, 10, 0, 0]
				},
				label: {
					show: true,
					position: 'top',
					fontSize: "1.2rem",
					color: '#fff'
				}
			}]
		};
		for (let key in option_) {
			option[key] = option_[key];
		}
	},
	initLineChart: function (option, category, values, color, title) {
		let option_ = {
			backgroundColor: '#000000',
			title: title ? this.createChartTitle(title) : null,
			grid: this.createChartGaid('40vw', null, "15vh", "20vh"),
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
			},
			xAxis: {
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				axisLabel: {
					color: this.getChartXTextColor()
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				smooth: true,
				data: category,
				boundaryGap: false,
				type: 'category',
			},
			yAxis: {
				axisLabel: {
					color: this.getChartYTextColor(),
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				splitLine: {
					lineStyle: {
						color: this.getChartYColor(),
						type: 'dashed'
					},
				},
				name: '',
			},
			series: [{
				name: "数据",
				data: values,
				type: 'line',
				itemStyle: {
					color: color, //改变折线点的颜色
					lineStyle: {
						width: 1,
						color: color // 线条颜色
					}
				},
				lineStyle: {
					width: 1,
					color: color
				},
				areaStyle: {
					//折线图颜色半透明
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
							offset: 0,
							color: color + 'ff' // 0% 处的颜色
						}, {
							offset: 1,
							color: color + '00' // 0% 处的颜色
						}],
						global: false // 缺省为 false
					}
				},
				label: {
					show: true,
					color: '#ddd',
					position: 'top'
				}
			}]
		};
		for (let key in option_) {
			option[key] = option_[key];
		}
	},
	initRadarChart: function (option, category, values) {
		var indicator = [];
		category.forEach((item, index) => {
			indicator.push({
				name: item,
				min: 0,
				max: 100
			});
		});
		let option_ = {
			hoverAnimation: true,
			tooltip: {
				trigger: 'item',
			},
			radar: {
				axisNameGap: 6, // 图中工艺等字距离图的距离
				radius: '85%',
				center: ['50%', '55%'],
				axisName: {
					color: '#fff',
					fontSize: 14,
				},
				indicator: indicator,
				axisLine: {
					//指向外圈文本的分隔线样式
					lineStyle: {
						color: 'rgba(245, 166, 35, 0.3)',
					},
				},
				splitLine: {
					lineStyle: {
						color: 'rgba(245, 166, 35, 0.3)', // 分隔线颜色
						width: 1, // 分隔线线宽
					},
				},
				splitArea: {
					// 坐标轴在 grid 区域中的分隔区域，默认不显示。
					show: true,
					areaStyle: {
						// 分隔区域的样式设置。
						color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
					}
				}
			},
			series: [{
				type: 'radar',
				z: 1,
				data: [{
					value: values,
				}],
				name: '',
				symbol: 'circle',
				symbolSize: 5,
				areaStyle: {
					color: 'rgba(245, 166, 35, 0.2)',
				},
				itemStyle: {
					color: 'rgba(245, 166, 35, 1)',
					borderColor: 'rgba(245, 166, 35, 0.3)',
					borderWidth: 10,
				},
				lineStyle: {
					type: 'dashed',
					color: 'rgba(245, 166, 35, 1)',
					width: 1,
				},
			}],
		};
		for (let key in option_) {
			option[key] = option_[key];
		}
	},
	initPictorialBar: function (option, category, values, color) {

		let option_ = {
			backgroundColor: '#000000',
			grid: this.createChartGaid('40vh', '10vh', "20vh", "20vh"),
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
			},
			xAxis: {
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				axisLabel: {
					color: this.getChartXTextColor()
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: category,
				type: 'category',
			},
			yAxis: {
				axisLabel: {
					color: this.getChartYTextColor(),
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				splitLine: {
					lineStyle: {
						color: this.getChartYColor(),
						type: 'dashed'
					},
				},
				name: '',
			},

			series: [{
				type: 'pictorialBar',
				itemStyle: {
					color: color,
				},
				symbolRepeat: 'fixed',
				symbolMargin: 4,
				symbol: 'roundRect',
				symbolClip: true,
				symbolSize: [20, 8],
				symbolPosition: 'start',
				symbolOffset: [0, -1],
				barBorderRadius: 20,
				data: values,
				z: 0,
				zlevel: 8,
				label: {
					show: true,
					position: 'top',
				}
			}]
		};
		for (let key in option_) {
			option[key] = option_[key];
		}
	}
}
