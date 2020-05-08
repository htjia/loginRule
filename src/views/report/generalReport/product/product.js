import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { productReject, productEverydayTrend, rejectRatioSort, rejectStabilitySort } from '@/api/report/product'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      activeTime: '0',
      factoryType: '3',
      factoryOptions: [
        {
          id: '3',
          name: '3#'
        }
      ],
      beginDate: this.getYesterdayFormatDate(),
      endDate: this.getYesterdayFormatDate(),
      listLoading: false,
      num: 0.12,
      castVisible: false,
      isYesterday: true,
      productTrendDataLoading: true,
      list: [{}, {}, {}],
      productTrendData: [],
      productRejectStability: [],
      productTrendOptions: {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var result = params[0].name + '<br>'
            params.forEach(function(item) {
              result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>'
              if (item.seriesName === '报废率') {
                result += item.seriesName + ' : ' + '<span style="color:#fff">' + item.data + ' %</span><br>'
              } else {
                result += item.seriesName + ' : ' + '<span style="color:#fff">' + item.data + '</span>'
              }
            })
            return result
          },
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['报废率', '生产总数']
        },
        dataZoom: [
          {
            start: 0, // 默认为0
            end: 100,
            type: 'slider', // slider 表示有滑动块的，inside表示内置的
            show: true, // 如果为false 则不显示
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 12, // 组件高度
            left: 60, // 左边的距离
            right: 65, // 右边的距离
            bottom: 0, // 右边的距离
            fillerColor: '#d3d3d3', // 选中范围的填充颜色。
            backgroundColor: '#f9f9f9', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            filterMode: 'filter'
          }
        ],
        xAxis: [
          {
            name: '时间',
            nameLocation: 'start',
            nameGap: 35,
            type: 'category',
            data: [],
            axisPointer: {
              type: 'line'
            },
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            },
            boundaryGap: false, // x 轴从0开始
            axisLabel: {
              margin: 40,
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '报废率',
            min: 0,
            max: 100,
            interval: 25,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisLabel: {
              formatter: '{value} %'
            }
          },
          {
            type: 'value',
            name: '生产总数',
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        grid: {
          x: 40,
          y: 27,
          x2: 65,
          y2: 38,
          bottom: 40,
          top: 40,
          left: 60
        },
        series: [
          {
            name: '报废率',
            cursor: 'default',
            type: 'line',
            hoverAnimation: false,
            symbolSize: 8, // 折线点的大小
            data: []
          },
          {
            name: '生产总数',
            cursor: 'default',
            type: 'line',
            hoverAnimation: false,
            symbolSize: 8, // 折线点的大小
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      topOptions: {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var result = params[0].name + '<br>'
            params.forEach(function(item) {
              result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>'
              if (item.seriesName === '报废率') {
                result += item.seriesName + ' : ' + '<span style="color:#fff">' + item.data.value + ' %</span><br>'
              } else {
                result += item.seriesName + ' : ' + '<span style="color:#fff">' + item.data.value + '</span>'
              }
            })
            return result
          },
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['报废率', '生产总数'],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10 // 设置高度
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisLabel: {
              // margin: 15,
              // interval: 0
              // rotate: -30
              // formatter: function(value) {
              //   return value.split('').join('\n')
              // }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '报废率',
            min: 0,
            max: 100,
            interval: 25,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %'
            },
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            }
          },
          {
            type: 'value',
            name: '生产总数',
            // min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: '#666'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#666'
              }
            }
          }
        ],
        grid: {
          x: 40,
          y: 27,
          x2: 65,
          y2: 23,
          top: 30
        },
        series: [
          {
            barMaxWidth: '18',
            barGap: '60%',
            barMinHeight: 5,
            name: '报废率',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top',
                fontSize: 8,
                formatter: function(value) {
                  return value.data.value + '%'
                }
              }
            },
            data: []
          },
          {
            barMaxWidth: '18',
            barGap: '60%',
            barMinHeight: 5,
            name: '生产总数',
            type: 'bar',
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: 'top',
                fontSize: 8,
                formatter: function(value) {
                  if (value.data.value === null) {
                    return value.data.value
                  } else if ((Math.round(value.data.value) / 10000) > 0.1) {
                    return (Math.round(value.data.value) / 10000).toFixed(2) + '万'
                  } else {
                    return value.data.value
                  }
                }
              }
            },
            data: []
          }
        ]
      },
      btmOptions: {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var result = params[0].name + '<br>'
            params.forEach(function(item) {
              result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>'
              if (item.seriesName === '报废率') {
                result += item.seriesName + ' : ' + '<span style="color:#fff">' + item.data.value + ' %</span><br>'
              } else {
                result += item.seriesName + ' : ' + '<span style="color:#fff">' + item.data.value + '</span>'
              }
            })
            return result
          },
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['报废率', '生产总数'],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10 // 设置高度
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisLabel: {
              // margin: 15,
              // interval: 0,
              // rotate: -30
              // formatter: function(value) {
              //   return value.split('').join('\n')
              // }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '报废率',
            min: 0,
            max: 100,
            interval: 25,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %'
            },
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            }
          },
          {
            type: 'value',
            name: '生产总数',
            // min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            }
          }
        ],
        grid: {
          x: 40,
          y: 27,
          x2: 65,
          y2: 23,
          top: 30
        },
        series: [
          {
            barMaxWidth: '18',
            barGap: '60%',
            barMinHeight: 5,
            name: '报废率',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top',
                fontSize: 8,
                formatter: function(value) {
                  return value.data.value + '%'
                }
              }
            },
            data: []
          },
          {
            barMaxWidth: '18',
            barGap: '60%',
            barMinHeight: 5,
            name: '生产总数',
            type: 'bar',
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: 'top',
                fontSize: 8,
                formatter: function(value) {
                  if (value.data.value === null) {
                    return value.data.value
                  } else if ((Math.round(value.data.value) / 10000) > 0.1) {
                    return (Math.round(value.data.value) / 10000).toFixed(2) + '万'
                  } else {
                    return value.data.value
                  }
                }
              }
            },
            data: []
          }
        ]
      },
      stabilityOptions: {
        color: ['#009494'],
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{a}: {c}'
        },
        grid: {
          x: 40,
          y: 27,
          x2: 40,
          y2: 23,
          top: 30
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisLabel: {
              // rotate: -30
            }
          }
        ],
        yAxis: [
          {
            name: '标准方差',
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            }
          }
        ],
        series: [
          {
            name: '标准方差',
            cursor: 'default',
            type: 'bar',
            barMaxWidth: '15',
            barMinHeight: 5,
            data: [101, 100, 99, 98, 97, 96, 95, 94, 93, 92]
          }
        ]
      },
      stabilityOptionsBtm: {
        color: ['#009494'],
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{a}: {c}'
        },
        grid: {
          x: 25,
          y: 27,
          x2: 40,
          y2: 23,
          top: 30
        },
        xAxis: [
          {
            type: 'category',
            data: ['产品1#', '产品2#', '产品3#', '产品4#', '产品5#', '产品6#', '产品7#', '产品8#', '产品9#', '产品10#'],
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisLabel: {
              // rotate: -30
            }
          }
        ],
        yAxis: [
          {
            name: '标准方差',
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            }
          }
        ],
        series: [
          {
            name: '标准方差',
            cursor: 'default',
            type: 'bar',
            barMaxWidth: '15',
            barMinHeight: 5,
            data: [101, 100, 99, 98, 97, 96, 95, 94, 93, 92]
          }
        ]
      },
      minRejectRatioName: '',
      minRejectRatioNameArr: [],
      minRejectRatioRejectNum: '',
      minRejectRatioRejectRatio: '',
      maxRejectRatioName: '',
      maxRejectRatioNameArr: [],
      maxRejectRatioRejectNum: '',
      maxRejectRatioRejectRatio: '',
      maxProductName: '',
      maxProductNameArr: [],
      maxProductRejectNum: '',
      maxProductRejectRatio: '',
      minProductName: '',
      minProductNameArr: [],
      minProductRejectNum: '',
      minProductRejectRatio: '',
      mostStableName: '',
      mostStableNameArr: [],
      productRejectRatio: [],
      mostStableRejectStdDev: '',
      mostStableRejectRatio: '',
      mostUnStableName: '',
      mostUnStableNameArr: [],
      mostUnStableRejectStdDev: '',
      mostUnStableRejectRatio: '',
      totaldaNum: '',
      totalRejectNum: '',
      totalRejectRatio: '',
      daNumTerm: '',
      rejectNumTerm: '',
      rejectRatioTerm: '',
      beginTime: '',
      endTime: '',
      minRejectRatioProductId: '',
      maxRejectRatioProductId: '',
      maxProductId: '',
      minProductId: '',
      mostStableProductId: '',
      dialogTitle: ''
    }
  },
  watch: {
  },
  beforeRouteEnter(to, from, next) {
    const back = sessionStorage.getItem('back')
    const bt = sessionStorage.getItem('bt')
    const et = sessionStorage.getItem('et')
    if (back === '1' && bt !== null && et !== null && (from.path.indexOf('productTrend') > -1 || from.path.indexOf('productDetail') > -1 || from.path.indexOf('productList') > -1 || from.path.indexOf('cockpit') > -1)) {
      sessionStorage.setItem('back', 2)
    }
    next()
  },
  created() {
    if (this.$route.query.bt) {
      this.beginDate = parseInt(this.$route.query.bt)
      this.endDate = parseInt(this.$route.query.et)
    }
    const back = sessionStorage.getItem('back')
    if (back === '2') {
      sessionStorage.removeItem('back')
      this.beginDate = parseInt(sessionStorage.getItem('bt'))
      this.endDate = parseInt(sessionStorage.getItem('et'))
    } else {
      sessionStorage.setItem('bt', this.beginDate)
      sessionStorage.setItem('et', this.endDate)
    }
    this.productRejectFun()
    this.rejectRatioSortFun()
    this.rejectStabilitySortFun()
  },
  mounted() {
  },
  methods: {
    checkTime() {
      if (this.endDate !== null && this.endDate !== '' && this.beginDate !== null && this.beginDate !== '') {
        const begin = Date.parse(new Date(new Date(this.beginDate).getFullYear(), new Date(this.beginDate).getMonth(), new Date(this.beginDate).getDate(), 0, 0, 0))
        const end = Date.parse(new Date(new Date(this.endDate).getFullYear(), new Date(this.endDate).getMonth(), new Date(this.endDate).getDate(), 0, 0, 0))
        if (end - begin < 0) {
          this.beginDate = this.getYesterdayFormatDate()
          this.$message.error('开始日期不能大于结束日期')
        }
        sessionStorage.setItem('bt', this.beginDate)
        sessionStorage.setItem('et', this.endDate)
      }
    },
    // 获取昨天日期
    getYesterdayFormatDate() {
      var today = new Date()
      var yesterday = today.setTime(today.getTime() - 24 * 60 * 60 * 1000)
      return yesterday
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 选择工厂
    factoryChangeSelect(data) {
      console.log(data)
    },
    // 搜索按钮
    searchBySelected() {
      if (this.formatDate(this.getYesterdayFormatDate()) === this.formatDate(this.beginDate)) {
        this.isYesterday = true
      } else {
        this.isYesterday = false
      }
      this.productRejectFun()
      this.rejectRatioSortFun()
      this.rejectStabilitySortFun()
    },
    formatNum(str) {
      var newStr = ''
      var count = 0
      for (var i = str.length - 1; i >= 0; i--) {
        if (count % 3 === 0 && count !== 0) {
          newStr = str.charAt(i) + ',' + newStr
        } else {
          newStr = str.charAt(i) + newStr
        }
        count++
      }
      str = newStr
      return str
    },
    // 产品总览
    productRejectFun() {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      productReject(params).then(res => {
        this.productEverydayTrendFun()
        this.beginTime = res.data.beginTime
        this.endTime = res.data.endTime
        if (res.data.totalRejectInfo !== null) {
          this.totaldaNum = this.formatNum(res.data.totalRejectInfo.daNum.toString())
          this.totalRejectNum = this.formatNum(res.data.totalRejectInfo.rejectNum.toString())
          this.totalRejectRatio = res.data.totalRejectInfo.rejectRatio
          this.daNumTerm = res.data.totalRejectInfo.daNumTerm
          this.rejectNumTerm = res.data.totalRejectInfo.rejectNumTerm
          this.rejectRatioTerm = res.data.totalRejectInfo.rejectRatioTerm
          this.minRejectRatioName = res.data.minRejectRatio.productName
          this.minRejectRatioNameArr = res.data.minRejectRatio.productName.split(',')
          this.minRejectRatioRejectNum = res.data.minRejectRatio.rejectRatio
          this.minRejectRatioProductId = res.data.minRejectRatio.productId
          this.minRejectRatioRejectRatio = this.formatNum(res.data.minRejectRatio.rejectNum.toString())
          this.maxRejectRatioName = res.data.maxRejectRatio.productName
          this.maxRejectRatioNameArr = res.data.maxRejectRatio.productName.split(',')
          this.maxRejectRatioProductId = res.data.maxRejectRatio.productId
          this.maxRejectRatioRejectNum = res.data.maxRejectRatio.rejectRatio
          this.maxRejectRatioRejectRatio = this.formatNum(res.data.maxRejectRatio.rejectNum.toString())
          this.maxProductName = res.data.maxProduct.productName
          this.maxProductNameArr = res.data.maxProduct.productName.split(',')
          this.maxProductRejectRatio = res.data.maxProduct.rejectRatio
          this.maxProductId = res.data.maxProduct.productId
          this.maxProductRejectNum = this.formatNum(res.data.maxProduct.rejectNum.toString())
          this.minProductName = res.data.minProduct.productName
          this.minProductNameArr = res.data.minProduct.productName.split(',')
          this.minProductId = res.data.minProduct.productId
          this.minProductRejectRatio = res.data.minProduct.rejectRatio
          this.minProductRejectNum = this.formatNum(res.data.minProduct.rejectNum.toString())
          this.mostStableName = res.data.mostStable.productName
          this.mostStableNameArr = res.data.mostStable.productName.split(',')
          this.mostStableRejectRatio = res.data.mostStable.rejectRatio
          this.mostStableProductId = res.data.mostStable.productId
          this.mostStableRejectStdDev = res.data.mostStable.stdDev
          this.mostUnStableName = res.data.mostUnstable.productName
          this.mostUnStableNameArr = res.data.mostUnstable.productName.split(',')
          this.mostUnStableRejectRatio = res.data.mostUnstable.rejectRatio
          this.mostUnStableProductId = res.data.mostUnstable.productId
          this.mostUnStableRejectStdDev = res.data.mostUnstable.stdDev
        } else {
          this.totaldaNum = 0
          this.totalRejectNum = 0
          this.totalRejectRatio = 0
          this.daNumTerm = 0
          this.rejectNumTerm = 0
          this.rejectRatioTerm = 0
          this.minRejectRatioName = ''
          this.minRejectRatioNameArr = []
          this.minRejectRatioRejectNum = 0
          this.minRejectRatioProductId = ''
          this.minRejectRatioRejectRatio = 0
          this.maxRejectRatioName = ''
          this.maxRejectRatioNameArr = []
          this.maxRejectRatioProductId = ''
          this.maxRejectRatioRejectNum = 0
          this.maxRejectRatioRejectRatio = 0
          this.maxProductName = ''
          this.maxProductNameArr = []
          this.maxProductRejectRatio = 0
          this.maxProductId = ''
          this.maxProductRejectNum = 0
          this.minProductName = ''
          this.minProductNameArr = []
          this.minProductId = ''
          this.minProductRejectRatio = 0
          this.minProductRejectNum = 0
          this.mostStableName = ''
          this.mostStableNameArr = []
          this.mostStableRejectRatio = 0
          this.mostStableProductId = ''
          this.mostStableRejectStdDev = 0
          this.mostUnStableName = ''
          this.mostUnStableNameArr = []
          this.mostUnStableRejectRatio = 0
          this.mostUnStableProductId = ''
          this.mostUnStableRejectStdDev = 0
        }
      })
    },
    productEverydayTrendFun() {
      this.productTrendDataLoading = true
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        pageNum: 1,
        pageSize: 10000
      }
      productEverydayTrend(params).then(res => {
        this.productTrendDataLoading = false
        this.productTrendData = res.data.list
        var xAxisData = []
        var rejectArray = []
        var daNumArray = []
        for (const item of res.data.list) {
          xAxisData.push(item.everyday.substr(5, 5))
          rejectArray.push(item.rejectRatio)
          daNumArray.push(item.daNum)
        }
        this.productTrendOptions.xAxis[0].data = xAxisData
        this.productTrendOptions.series[0].data = rejectArray
        this.productTrendOptions.series[1].data = daNumArray
        if (res.data.list.length > 30) {
          this.productTrendOptions.dataZoom[0].start = 100 - Math.floor(30 / res.data.list.length * 100)
          this.productTrendOptions.dataZoom[0].show = true
          this.productTrendOptions.xAxis[0].axisLabel.margin = 10
        } else {
          this.productTrendOptions.dataZoom[0].show = false
          this.productTrendOptions.xAxis[0].axisLabel.margin = 20
        }
      })
    },
    rejectRatioSortFun() {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      rejectRatioSort(params).then(res => {
        var xAxisData = []
        var xAxisDataBtm = []
        var rejectArray = []
        var rejectArrayBtm = []
        var daNumArray = []
        var daNumArrayBtm = []
        this.productRejectRatio = res.data.productRejectRatioASC
        for (const item of res.data.productRejectRatioASC) {
          // xAxisData.push(item.everyday.substr(5, 5))
          xAxisData.push(item.productName)
          rejectArray.push({
            value: item.rejectRatio,
            eqptId: item.productId
          })
          daNumArray.push({
            value: item.daNum,
            eqptId: item.productId
          })
        }
        for (const item of res.data.productRejectRatioDESC) {
          // xAxisData.push(item.everyday.substr(5, 5))
          xAxisDataBtm.push(item.productName)
          rejectArrayBtm.push({
            value: item.rejectRatio,
            eqptId: item.productId
          })
          daNumArrayBtm.push({
            value: item.daNum,
            eqptId: item.productId
          })
        }
        this.topOptions.xAxis[0].data = xAxisData
        this.topOptions.series[0].data = rejectArray
        this.topOptions.series[1].data = daNumArray
        this.btmOptions.xAxis[0].data = xAxisDataBtm
        this.btmOptions.series[0].data = rejectArrayBtm
        this.btmOptions.series[1].data = daNumArrayBtm
      })
    },
    rejectStabilitySortFun() {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      rejectStabilitySort(params).then(res => {
        console.log(res)
        var xAxisData = []
        var xAxisDataBtm = []
        var daNumArray = []
        var daNumArrayBtm = []
        this.productRejectStability = res.data.productRejectStabilityASC
        for (const item of res.data.productRejectStabilityASC) {
          xAxisData.push(item.productName)
          daNumArray.push(item.stdDev)
        }
        for (const item of res.data.productRejectStabilityDESC) {
          // xAxisData.push(item.everyday.substr(5, 5))
          xAxisDataBtm.push(item.productName)
          daNumArrayBtm.push(item.stdDev)
        }
        this.stabilityOptions.xAxis[0].data = xAxisData
        this.stabilityOptions.series[0].data = daNumArray
        this.stabilityOptionsBtm.xAxis[0].data = xAxisDataBtm
        this.stabilityOptionsBtm.series[0].data = daNumArrayBtm
      })
    },
    viewAll() {
      console.log('查看全部')
    },
    // 产品趋势源数据
    viewTendencyAll() {
      this.$router.push({ path: '/routine/productTrend', query: { bt: this.beginDate, et: this.endDate }})
    },
    // tabs
    handleClick() {
      this.productRejectFun()
      this.rejectRatioSortFun()
      this.rejectStabilitySortFun()
    },
    // 从产品总览到详情
    jumpToDetail(id) {
      this.$router.push({ path: '/routine/productDetail', query: { id: id, bt: this.beginDate, et: this.endDate }})
    },
    // 点击前后10产品柱子到详情
    barClick(data) {
      this.$router.push({ path: '/routine/productDetail', query: { id: data, bt: this.beginDate, et: this.endDate }})
    },
    // 查看全部list
    viewAllProductList(sort) {
      this.$router.push({
        path: '/routine/productList',
        query: {
          bt: this.formatDate(this.beginDate),
          et: this.formatDate(this.endDate),
          btp: this.beginDate,
          etp: this.endDate,
          s: sort
        }
      })
    }
  }
}
