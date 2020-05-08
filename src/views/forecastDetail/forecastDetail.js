import PageHeaderLayout from '@/components/PageHeaderLayout'
import { getEqptList, oneEqptPrediction, predictedTrends, predictedTrendLists } from '@/api/forecastDetail'
import Chart from '@/components/Charts'
export default {
  components: { PageHeaderLayout, Chart },
  data() {
    return {
      listLoading: false,
      tableName: '',
      uploadState: '',
      equipment: '0',
      eqptCode: '',
      equipmentOptions: [],
      list: [],
      pageSize: 10,
      pageNum: 1,
      beginTime: '',
      endTime: '',
      foreCount: '',
      successCount: '',
      successRetio: '',
      searchkey: '',
      totalPage: 0,
      tokenForm: {
        tokenId: '',
        name: '',
        password: ''
      },
      rules: {
        tokenId: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
        name: [{ required: true, message: 'name不能为空', trigger: 'blur' }],
        password: [{ required: true, message: 'password不能为空', trigger: 'blur' }]
      },
      currentId: '',
      selectedDate: this.getYesterdayFormatDate(),
      trendOptions: {
        title: {
          text: '预测结果定义：若预测正确，则值为1；若预测失败，则值为-1',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          formatter: function(params) {
            let outcome = ''
            if (params.value === -1) {
              outcome = '预测失败'
            } else {
              outcome = '预测成功'
            }
            return params.name + '<br/> ' + params.value + ' (' + outcome + ')'
          },
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
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
            left: 30, // 左边的距离
            right: 20, // 右边的距离
            bottom: 20, // 右边的距离
            fillerColor: '#d3d3d3', // 选中范围的填充颜色。
            backgroundColor: '#f9f9f9', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            filterMode: 'filter'
          }
        ],
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            margin: 25
            // interval: 0
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        legend: {
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          data: [{
            name: '预测正确',
            textStyle: {
              color: '#009494'
            }
          },
          {
            name: '预测失败',
            textStyle: {
              color: '#de525f'
            }
          }],
          right: 10
        },
        series: [{
          name: '预测正确',
          data: [],
          type: 'bar',
          barMaxWidth: 20, // 最大宽度
          barWidth: function(param) {
            console.log(param)
            return 20
          },
          itemStyle: {
            normal: {
              color: function(params) {
                var index_color = params.value
                if (index_color >= 0) {
                  return '#009494'
                } else {
                  return '#de525f'
                }
              }
            }
          }
        },
        {
          name: '预测失败',
          data: [],
          type: 'bar',
          barMaxWidth: 20, // 最大宽度
          itemStyle: {
            normal: {
              color: function(params) {
                return '#de525f'
              }
            }
          }
        }],
        grid: {
          x: 30,
          y: 21,
          x2: 20,
          y2: 40,
          top: 40
        }
      },
      outcomeOptions: {
        tooltip: {
          formatter: '{b} <br/> {c}%'
        },
        series: [
          {
            name: '预测结果',
            type: 'gauge',
            animationEasing: 'linear',
            animationDuration: 1500,
            animationDurationUpdate: 1500,
            title: {
              fontWeight: 'bold'
            },
            detail: { formatter: '{value}%', fontSize: 26 },
            data: [{ value: 88.6, name: '预测成功率' }],
            axisLine: {
              lineStyle: {
                width: 10,
                color: [[0.2, '#c23531'], [0.8, '#63869e'], [1, '#91c7ae']]
              },
              textStyle: {
                color: 'red',
                fontSize: 7
              }
            },
            splitLine: { // 分割线样式
              length: 10
            },
            radius: '100%',
            axisTick: {
              length: 5
            }
          }
        ]
      }
    }
  },
  watch: {
  },
  created() {
    this.equipment = parseInt(this.$route.query.id)
    this.getEqptListFun()
    this.oneEqptPredictionFun()
    this.predictedTrendsFun()
    this.predictedTrendListsFun()
  },
  mounted() {
  },
  methods: {
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
    // 生成一个与行数相同的数组记录每一行设置的合并数
    getSpanArr(data, groups) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.pos = 0 // pos是spanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i][groups] === data[i - 1][groups]) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.spanArr[this.pos] += 1
            this.spanArr.push(0) // 0 即表示该行不显示
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 设备列表
    getEqptListFun() {
      getEqptList({}).then(res => {
        this.equipmentOptions = res.data
      })
    },
    // 预测统计
    oneEqptPredictionFun() {
      const params = {
        eqptId: this.equipment
      }
      oneEqptPrediction(params).then(res => {
        this.eqptCode = res.data.bsInfo.eqptCode
        this.beginTime = res.data.beginTime
        this.endTime = res.data.endTime
        this.foreCount = this.formatNum(res.data.bsInfo.foreCount.toString())
        this.successCount = this.formatNum(res.data.bsInfo.successCount.toString())
        this.successRetio = res.data.bsInfo.successRetio
        this.outcomeOptions.series[0].data[0].value = res.data.bsInfo.successRetio
      })
    },
    // 预测趋势
    predictedTrendsFun() {
      const params = {
        eqptId: this.equipment
      }
      predictedTrends(params).then(res => {
        console.log(res.data)
        var xAxisData = []
        var dataArrayRight = []
        var dataArrayLeft = []
        for (const item of res.data) {
          if (item.isaccuracy > -1) {
            dataArrayLeft.push(item.isaccuracy)
            dataArrayRight.push(0)
          } else {
            dataArrayRight.push(item.isaccuracy)
            dataArrayLeft.push(0)
          }
          xAxisData.push(item.shiftDate + '(' + item.shiftName + ')')
        }
        this.trendOptions.xAxis.data = xAxisData
        this.trendOptions.series[0].data = dataArrayLeft
        this.trendOptions.series[1].data = dataArrayRight
        if (res.data.length > 20) {
          this.trendOptions.dataZoom[0].start = 100 - Math.floor(20 / res.data.length * 100)
          this.trendOptions.dataZoom[0].show = true
          this.trendOptions.xAxis.axisLabel.margin = 25
          this.trendOptions.grid.y2 = 40
        } else {
          this.trendOptions.dataZoom[0].show = false
          this.trendOptions.xAxis.axisLabel.margin = 10
          this.trendOptions.grid.y2 = 26
        }
      })
    },
    // 趋势表格
    predictedTrendListsFun() {
      const params = {
        eqptId: this.equipment,
        date: this.selectedDate
      }
      predictedTrendLists(params).then(res => {
        console.log(res)
        this.list = res.data
        this.getSpanArr(this.list, 'shiftName')
      })
    },
    // 获取昨天日期
    getYesterdayFormatDate() {
      var today = new Date()
      today.setTime(today.getTime() - 24 * 60 * 60 * 1000)
      var y = today.getFullYear()
      var m = (today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1)
      var d = today.getDate() > 9 ? today.getDate() : '0' + today.getDate()
      return y + '-' + m + '-' + d
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 每页数量改变
    sizeChange(pageSize) {
      const params = {
        pageNum: this.pageNum,
        pageSize
      }
      this.pageSize = pageSize
      this.fetchData(params)
    },
    // 当前页数改变
    currentChange(pageNum) {
      const params = {
        pageSize: this.pageSize,
        pageNum
      }
      this.pageNum = pageNum
      this.fetchData(params)
    },
    handleSearch() {
      this.oneEqptPredictionFun()
      this.predictedTrendsFun()
      this.predictedTrendListsFun()
    },
    // 前一天
    before() {
      const d = new Date(this.selectedDate)
      const currentDate = d.getTime(d) - (24 * 60 * 60 * 1000)
      this.selectedDate = this.formatDate(currentDate)
      this.predictedTrendListsFun()
    },
    // 后一天
    after() {
      const d = new Date(this.selectedDate)
      const currentDate = d.getTime(d) + (24 * 60 * 60 * 1000)
      this.selectedDate = this.formatDate(currentDate)
      this.predictedTrendListsFun()
    },
    // 时间控件改变
    dateChanged() {
      this.predictedTrendListsFun()
    }
  }
}
