import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { oneEqptReject, onedownReson, eqptOee, everydayReject, everydayDown } from '@/api/report/equipmentDetail'
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
      beginDate: '',
      endDate: '',
      pageSize: 15,
      pageNum: 1,
      downPageNum: 1,
      listLoading: false,
      detailVisible: false,
      detailDownVisible: false,
      detailEquipmentVisible: false,
      downResonListLoading: true,
      downResonList: [],
      oeeOptions: {
        tooltip: {
          trigger: 'axis',
          position: function(point, params, dom, rect, size) {
            // 其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
            var x = point[0]
            var y = point[1]
            var boxWidth = size.contentSize[0]
            var boxHeight = size.contentSize[1]
            var posX = 0 // x坐标位置
            var posY = 0 // y坐标位置

            if (x < boxWidth) { // 左边放不开
              posX = 5
            } else { // 左边放的下
              posX = x
            }

            if (y < boxHeight) { // 上边放不开
              posY = 5
            } else { // 上边放得下
              posY = y
            }
            return [posX, posY]
          }
        },
        legend: {
          // x: 'center',
          data: ['OEE']
        },
        radar: [
          {
            indicator: [
              { text: 'OEE', max: 100 },
              { text: '开机率', max: 100 },
              { text: '合格率', max: 100 },
              { text: '性能稼动率', max: 100 }
            ],
            name: {
              textStyle: { color: '#494949' }
            },
            center: ['45%', '50%'],
            radius: 130
          }
        ],
        series: [
          {
            type: 'radar',
            cursor: 'default',
            tooltip: {
              trigger: 'item'
            },
            itemStyle: { normal: { areaStyle: { type: 'default' }}},
            data: [
              {
                value: [],
                name: 'OEE综合分析'
              }
            ]
          }
        ]
      },
      abnormalOptions: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} min'
        },
        legend: {
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          // itemGap: 40, // 设置间距
          orient: 'vertical',
          x: '53%',
          y: 'center',
          // orient: 'vertical',  //垂直显示
          // y: 'center',    //延Y轴居中
          // x: 'right' //居右显示
          data: []
        },
        series: [
          {
            name: '异常停机时长',
            cursor: 'default',
            type: 'pie',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            radius: ['0%', '55%'],
            minAngle: 2, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
            avoidLabelOverlap: true, // 是否启用防止标签重叠策略
            label: {
              normal: {
                show: true,
                // position: 'center'
                textStyle: {
                  fontWeight: 700,
                  fontSize: 13 // 文字的字体大小
                },
                formatter: '{d}%'

              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '18',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [],
            center: ['25%', '50%']
          }
        ]
      },
      equipmentOptions: {
        color: ['#009494'],
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/>{a}: {c}%',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 40,
          y: 27,
          x2: 5,
          y2: 26,
          left: 65,
          top: 30,
          right: 18,
          bottom: 35
        },
        xAxis: [
          {
            name: '时间',
            nameLocation: 'start',
            nameGap: 35,
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
              margin: 10,
              interval: 0
              // interval: 0,
              // formatter: function(value) {
              //   return value.split('').join('\n')
              // }
            },
            boundaryGap: false // x轴坐标从0开始
          }
        ],
        yAxis: [
          {
            name: '报废率',
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
            },
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        dataZoom: [
          {
            start: 0, // 默认为0
            end: 100,
            type: 'slider', // slider 表示有滑动块的，inside表示内置的
            show: true, // 如果为false 则不显示
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 12, // 组件高度
            left: 65, // 左边的距离
            right: 16, // 右边的距离
            bottom: 0, // 右边的距离
            fillerColor: '#d3d3d3', // 选中范围的填充颜色。
            backgroundColor: '#f9f9f9', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            filterMode: 'filter'
          }
          // 下面这个属性是里面拖到
          // {
          //   type: 'inside',
          //   show: false,
          //   xAxisIndex: [0],
          //   start: 0, // 默认为1
          //   end: 100
          // }
        ],
        series: [
          {
            name: '报废率',
            cursor: 'default',
            symbolSize: 8, // 折线点的大小
            barMaxWidth: '15',
            barMinHeight: 5,
            type: 'line',
            hoverAnimation: false,
            data: []
          }
        ]
      },
      stopOptions: {
        color: ['#009494'],
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/>{a}: {c} 次',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 20,
          y: 27,
          x2: 5,
          y2: 26,
          bottom: 40,
          top: 30,
          left: 50
        },
        xAxis: [
          {
            name: '时间',
            nameLocation: 'start',
            nameGap: 25,
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
              margin: 10,
              interval: 0
              // interval: 0,
              // formatter: function(value) {
              //   return value.split('').join('\n')
              // }
            }
          }
        ],
        yAxis: [
          {
            name: '次数',
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
            type: 'value'
          }
        ],
        dataZoom: [
          {
            start: 0, // 默认为0
            end: 100,
            type: 'slider', // slider 表示有滑动块的，inside表示内置的
            show: true, // 如果为false 则不显示
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 12, // 组件高度
            left: 50, // 左边的距离
            right: 5, // 右边的距离
            bottom: 0, // 右边的距离
            fillerColor: '#d3d3d3', // 选中范围的填充颜色。
            backgroundColor: '#f9f9f9', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            filterMode: 'filter'
          }
          // 下面这个属性是里面拖到
          // {
          //   type: 'inside',
          //   show: false,
          //   xAxisIndex: [0],
          //   start: 0, // 默认为1
          //   end: 100
          // }
        ],
        series: [
          {
            name: '停机次数',
            cursor: 'default',
            barMaxWidth: '15',
            barMinHeight: 5,
            type: 'bar',
            data: []
          },
          {
            name: '停机次数',
            cursor: 'default',
            symbolSize: 0, // 折线点的大小
            type: 'line',
            hoverAnimation: false,
            color: ['#2f4554'],
            data: []
          }
        ]
      },
      eqptId: '',
      eqptBrand: '',
      eqptmodel: '',
      rejectatio: '',
      daNum: '',
      beginTime: '',
      endTime: '',
      rejectNum: '',
      downNum: '',
      downTimes: '',
      maxProdutEqptCode: '',
      maxProdutEqptCodeArr: [],
      minProdutEqptCode: '',
      minProdutEqptCodeArr: [],
      maxProdutDaNum: '',
      minProdutDaNum: '',
      maxProdutRejectatio: '',
      minProdutRejectatio: '',
      downReson: '',
      downResonArr: [],
      maxDownTime: '',
      maxDownNum: '',
      rejectTotal: '',
      downTotal: '',
      oeeData: {},
      everydayDownData: [],
      everydayRejectData: [],
      everydayRejectDetailData: [],
      everydayDownDetailData: [],
      eqptCode: ''
    }
  },
  watch: {
  },
  created() {
    this.beginDate = parseInt(this.$route.query.bt)
    this.endDate = parseInt(this.$route.query.et)
    this.eqptId = this.$route.query.id
    this.oneEqptRejectFun()
    this.onedownResonFun()
    this.eqptOeeFun()
    this.everydayDownFun()
    this.everydayRejectFun()
  },
  mounted() {
  },
  methods: {
    checkTime() {
      if (this.endDate !== null && this.endDate !== '') {
        const begin = Date.parse(new Date(new Date(this.beginDate).getFullYear(), new Date(this.beginDate).getMonth(), new Date(this.beginDate).getDate(), 0, 0, 0))
        const end = Date.parse(new Date(new Date(this.endDate).getFullYear(), new Date(this.endDate).getMonth(), new Date(this.endDate).getDate(), 0, 0, 0))
        if (end - begin < 0) {
          this.beginDate = this.getYesterdayFormatDate()
          this.$message.error('开始日期不能大于结束日期')
        }
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
      this.oneEqptRejectFun()
      this.onedownResonFun()
      this.eqptOeeFun()
      this.everydayDownFun()
      this.everydayRejectFun()
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
    oneEqptRejectFun() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        eqptId: this.eqptId
      }
      oneEqptReject(params).then(res => {
        this.eqptCode = res.data.eqptCode
        this.eqptBrand = res.data.eqptBrand
        this.eqptmodel = res.data.eqptmodel
        this.rejectatio = res.data.rejectatio
        this.beginTime = res.data.beginTime
        this.endTime = res.data.endTime
        if (res.data.maxDownReson) {
          this.downReson = res.data.maxDownReson.downReson
          this.downResonArr = res.data.maxDownReson.downReson.split(',')
          this.maxDownTime = this.formatNum(res.data.maxDownReson.downTimes.toString())
          this.maxDownNum = this.formatNum(res.data.maxDownReson.downNum.toString())
        } else {
          this.downReson = ''
          this.maxDownTime = ''
          this.maxDownNum = ''
          this.downResonArr = []
        }
        if (res.data.maxProdut) {
          this.maxProdutDaNum = this.formatNum(res.data.maxProdut.daNum.toString())
          this.maxProdutRejectatio = res.data.maxProdut.rejectRatio
          this.maxProdutEqptCode = res.data.maxProdut.productName
          this.maxProdutEqptCodeArr = res.data.maxProdut.productName.split(',')
        } else {
          this.maxProdutDaNum = ''
          this.maxProdutRejectatio = ''
          this.maxProdutEqptCode = ''
          this.maxProdutEqptCodeArr = []
        }
        if (res.data.minRejectRatioProdut) {
          this.minProdutRejectatio = res.data.minRejectRatioProdut.rejectRatio
          this.minProdutEqptCode = res.data.minRejectRatioProdut.productName
          this.minProdutEqptCodeArr = res.data.minRejectRatioProdut.productName.split(',')
          this.minProdutDaNum = this.formatNum(res.data.minRejectRatioProdut.daNum.toString())
        } else {
          this.minProdutRejectatio = ''
          this.minProdutEqptCode = ''
          this.minProdutDaNum = ''
          this.minProdutEqptCodeArr = []
        }
        this.daNum = this.formatNum(res.data.daNum.toString())
        this.rejectNum = this.formatNum(res.data.rejectNum.toString())
        this.downNum = this.formatNum(res.data.downNum.toString())
        this.downTimes = this.formatNum(res.data.downTimes.toString())
      })
    },
    onedownResonFun() {
      this.downResonListLoading = true
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        eqptId: this.eqptId
      }
      onedownReson(params).then(res => {
        this.downResonListLoading = false
        this.downResonList = res.data
        var titleArray = []
        var dataArray = []
        for (const item of this.downResonList) {
          titleArray.push(item.downReson)
          dataArray.push({
            value: item.downTimes,
            name: item.downReson
          })
        }
        this.abnormalOptions.legend.data = titleArray
        this.abnormalOptions.series[0].data = dataArray
      })
    },
    eqptOeeFun() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        eqptId: this.eqptId
      }
      eqptOee(params).then(res => {
        this.oeeData = res.data
        var dataArray = []
        dataArray.push(res.data.oee)
        dataArray.push(res.data.timeUseRate)
        dataArray.push(res.data.checkRate)
        dataArray.push(res.data.capabilityRate)
        this.oeeOptions.series[0].data[0].value = dataArray
      })
    },
    // 每日报废率
    everydayRejectFun() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        eqptId: this.eqptId,
        pageSize: 10000,
        orderType: 0,
        pageNum: 1
      }
      everydayReject(params).then(res => {
        this.everydayRejectData = res.data.list
        var xAxisData = []
        var rejectRatio = []
        for (const item of this.everydayRejectData) {
          xAxisData.push(item.everyday.substr(5, 5))
          rejectRatio.push(item.rejectRatio)
        }
        this.equipmentOptions.xAxis[0].data = xAxisData
        this.equipmentOptions.series[0].data = rejectRatio
        if (this.everydayRejectData.length > 30) {
          this.equipmentOptions.dataZoom[0].start = 100 - Math.floor(30 / this.everydayRejectData.length * 100)
          this.equipmentOptions.grid.bottom = 35
          this.equipmentOptions.dataZoom[0].show = true
        } else {
          this.equipmentOptions.dataZoom[0].show = false
          this.equipmentOptions.grid.bottom = 20
        }
      })
    },
    // 每日报废率详情
    everydayRejectDetailFun() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        eqptId: this.eqptId,
        pageSize: this.pageSize,
        orderType: 1,
        pageNum: this.pageNum
      }
      everydayReject(params).then(res => {
        this.everydayRejectDetailData = res.data.list
        this.rejectTotal = res.data.total
      })
    },
    // 每日停机
    everydayDownFun() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        eqptId: this.eqptId,
        pageSize: 10000,
        orderType: 0,
        pageNum: 1
      }
      everydayDown(params).then(res => {
        this.everydayDownData = res.data.list
        var xAxisData = []
        var seriesData = []
        for (const item of this.everydayDownData) {
          xAxisData.push(item.everyday.substr(5, 5))
          seriesData.push(item.downNum)
        }
        this.stopOptions.xAxis[0].data = xAxisData
        this.stopOptions.series[0].data = seriesData
        this.stopOptions.series[1].data = seriesData
        if (this.everydayDownData.length > 30) {
          this.stopOptions.dataZoom[0].start = 100 - Math.floor(30 / this.everydayDownData.length * 100)
          this.stopOptions.grid.bottom = 35
          this.stopOptions.dataZoom[0].show = true
        } else {
          this.stopOptions.dataZoom[0].show = false
          this.stopOptions.grid.bottom = 20
        }
      })
    },
    // 每日停机详情
    everydayDownDetailFun() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        eqptId: this.eqptId,
        pageSize: this.pageSize,
        orderType: 1,
        pageNum: this.downPageNum
      }
      everydayDown(params).then(res => {
        this.everydayDownDetailData = res.data.list
        this.downTotal = res.data.total
      })
    },
    modalPageChanges(eqptPageNum) {
      this.pageNum = eqptPageNum
      this.everydayRejectDetailFun()
    },
    modalDownPageChanges(downPageNum) {
      this.downPageNum = downPageNum
      this.everydayDownDetailFun()
    },
    viewAll(data) {
      this.pageNum = 1
      this.downPageNum = 1
      if (data === 1) {
        this.everydayRejectDetailFun()
        this.detailVisible = true
      } else {
        this.everydayDownDetailFun()
        this.detailDownVisible = true
      }
    },
    viewEquipmentAll() {
      this.detailEquipmentVisible = true
    },
    // tabs
    handleClick() {
      this.oneEqptRejectFun()
      this.onedownResonFun()
      this.eqptOeeFun()
      this.everydayDownFun()
      this.everydayRejectFun()
    }
  }
}
