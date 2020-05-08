import PageHeaderLayout from '@/components/PageHeaderLayout'
import { logList } from '@/api/uploadLog'
import Chart from '@/components/Charts'
import { sevenDayReject, shiftList, productList, eqptList, workerList, reasonConstitute } from '@/api/report/cockpit'
// import { Message } from 'element-ui'
export default {
  components: { PageHeaderLayout, Chart },
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
      beginDate: this.getYesterdayFormatDate(),
      endDate: this.getYesterdayFormatDate(),
      factoryType: '3',
      factoryOptions: [
        {
          id: '3',
          name: '3#'
        }
      ],
      listLoading: false,
      isYesterday: true,
      tableName: '',
      uploadState: '',
      equipment: '1',
      forecastTime: '',
      list: [],
      pageSize: 10,
      pageNum: 1,
      searchkey: '',
      totalPage: 0,
      rejectInfo: {},
      tokenForm: {
        tokenId: '',
        name: '',
        password: ''
      },
      currentId: '',
      reasonConstituteData: [],
      abnormalOptions: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}'
        },
        legend: {
          orient: 'vertical',
          x: '70%',
          y: 'center',
          data: [],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10 // 设置高度
        },
        series: [
          {
            name: '报废环节',
            type: 'pie',
            cursor: 'default',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            minAngle: 2, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
            avoidLabelOverlap: true, // 是否启用防止标签重叠策略
            // radius: ['50%', '70%'],
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
                show: true,
                length: 1
              }
            },
            data: [
              { value: 335, name: '压铸报废' },
              { value: 310, name: '机加工报废' },
              { value: 234, name: '氧化终检报废' }
            ],
            center: ['35%', '50%']
          }
        ]
      },
      // 七天报废率
      outcomeOptions: {
        color: ['#009494'],
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/>{a}: {c}%',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 50,
          y: 10,
          x2: 30,
          y2: 30
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
              // margin: 15,
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
            type: 'value',
            // min: 0,
            // max: 100,
            // interval: 25,
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
        series: [
          {
            name: '平均报废率',
            type: 'bar',
            barMaxWidth: '15',
            barMinHeight: 5,
            cursor: 'default',
            data: [10, 20, 40, 60, 45, 40, 30]
          },
          {
            name: '平均报废率',
            type: 'line',
            hoverAnimation: false,
            color: ['#2f4554'],
            symbolSize: 0,
            data: [10, 20, 40, 60, 45, 40, 30]
          }
        ]
      },
      // 班次报废率统计
      classesOptions: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}'
        },
        legend: {
          orient: 'vertical', // 垂直显示
          x: '0',
          y: 'center',
          data: ['甲班', '乙班', '丙班'],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10 // 设置高度
        },
        series: [
          {
            name: '班次报废数',
            type: 'pie',
            cursor: 'default',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            radius: ['50%', '80%'],
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
                formatter: '{c}'

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
                show: true,
                length: 5
              }
            },
            data: [
              { value: 335, name: '甲班' },
              { value: 310, name: '乙班' },
              { value: 234, name: '丙班' }
            ],
            center: ['60%', '50%']
          }
        ]
      },
      productOptions: {
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
          data: ['报废率', '生产总数'],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10 // 设置高度
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
            axisPointer: {
              type: 'shadow'
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
          y: 30,
          x2: 65,
          y2: 20
        },
        series: [
          {
            name: '报废率',
            cursor: 'default',
            type: 'bar',
            barMaxWidth: '18',
            barGap: '50%',
            barMinHeight: 5,
            label: {
              normal: {
                show: true,
                position: 'top',
                fontSize: 8,
                formatter: function(value) {
                  return value.data + '%'
                }
              }
            },
            data: []
          },
          {
            name: '生产总数',
            cursor: 'default',
            type: 'bar',
            barMaxWidth: '18',
            barGap: '50%',
            barMinHeight: 5,
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: 'top',
                fontSize: 8,
                formatter: function(value) {
                  if (value.data === null) {
                    return value.data
                  } else if ((Math.round(value.data) / 10000) > 0.1) {
                    return (Math.round(value.data) / 10000).toFixed(2) + '万'
                  } else {
                    return value.data
                  }
                }
              }
            },
            data: []
          }
        ]
      },
      machineOptions: {
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
          data: ['报废率', '生产总数'],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10 // 设置高度
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
            axisPointer: {
              type: 'shadow'
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
            },
            splitLine: {
              show: false
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
          y: 30,
          x2: 65,
          y2: 20
        },
        series: [
          {
            name: '报废率',
            cursor: 'default',
            type: 'bar',
            barMaxWidth: '18',
            barGap: '80%',
            barMinHeight: 5,
            label: {
              normal: {
                show: true,
                position: 'top',
                fontSize: 8,
                formatter: function(value) {
                  return value.data.toFixed(2) + '%'
                }
              }
            },
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          },
          {
            name: '生产总数',
            cursor: 'default',
            type: 'bar',
            barMaxWidth: '18',
            barGap: '80%',
            barMinHeight: 5,
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: 'top',
                fontSize: 8,
                formatter: function(value) {
                  if (value.data === null) {
                    return value.data
                  } else if ((Math.round(value.data) / 10000) > 0.1) {
                    return (Math.round(value.data) / 10000).toFixed(2) + '万'
                  } else {
                    return value.data
                  }
                }
              }
            },
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          }
        ]
      },
      nameList: [],
      eqptData: [],
      productRejectRatioASC: [],
      productRejectRatioDESC: [],
      scrapNum1: '',
      scrapNum2: '',
      scrapNum3: '',
      scrapRatio1: '',
      scrapRatio2: '',
      scrapRatio3: '',
      rejectInfoDaNum: '',
      rejectNum: '',
      currentNum: 1
    }
  },
  watch: {
  },
  beforeRouteEnter(to, from, next) {
    const back = sessionStorage.getItem('back')
    const bt = sessionStorage.getItem('bt')
    const et = sessionStorage.getItem('et')
    if (back === '1' && bt !== null && et !== null && (from.path.indexOf('equipment') > -1 || from.path.indexOf('product') > -1 || from.path.indexOf('class') > -1 || from.path.indexOf('abnormal') > -1)) {
      sessionStorage.setItem('back', 2)
    }
    next()
  },
  created() {
    const back = sessionStorage.getItem('back')
    if (back === '2') {
      sessionStorage.removeItem('back')
      this.beginDate = parseInt(sessionStorage.getItem('bt'))
      this.endDate = parseInt(sessionStorage.getItem('et'))
    } else {
      sessionStorage.setItem('bt', this.beginDate)
      sessionStorage.setItem('et', this.endDate)
    }
    this.sevenDayRejectFun()
    this.getShiftList()
    this.getProductList()
    this.getEqptList()
    this.getWorkerList()
    this.getReasonConstitute()
  },
  mounted() {
    console.log(this.$route.query.id)
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
    sevenDayRejectFun() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      sevenDayReject(params).then(res => {
        this.rejectInfo = res.data.rejectInfo
        this.rejectInfoDaNum = this.formatNum(res.data.rejectInfo.daNum.toString())
        if (res.data.rejectInfo.rejectNum !== null) {
          this.rejectNum = this.formatNum(res.data.rejectInfo.rejectNum.toString())
        } else {
          this.rejectNum = 0
        }
        var xAxisData = []
        var daNumArray = []
        for (const item of res.data.sevenDay) {
          xAxisData.push(item.everyday.substr(5, 5))
          daNumArray.push(item.rejectRatio)
        }
        this.outcomeOptions.xAxis[0].data = xAxisData
        this.outcomeOptions.series[0].data = daNumArray
        this.outcomeOptions.series[1].data = daNumArray
      })
    },
    getShiftList() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      shiftList(params).then(res => {
        var legendData = []
        var daNumArray = []
        for (const item of res.data) {
          legendData.push(item.shiftName)
          daNumArray.push({
            name: item.shiftName,
            value: item.rejectNum
          })
        }
        this.classesOptions.legend.data = legendData
        this.classesOptions.series[0].data = daNumArray
      })
    },
    getProductList() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      productList(params).then(res => {
        this.productRejectRatioASC = res.data.productRejectRatioASC
        this.productRejectRatioDESC = res.data.productRejectRatioDESC
        this.darwCharts(this.productRejectRatioASC, this.productOptions, 'productName', 'daNum')
      })
    },
    getEqptList() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      eqptList(params).then(res => {
        // this.darwCharts(res.data, this.machineOptions, 'eqptCode', 'eqptNum')
        this.eqptData = res.data
        var xAxisData = []
        var rejectArray = []
        var daNumArray = []
        for (const item of res.data) {
          xAxisData.push(item.eqptNum + '#')
          rejectArray.push(item.rejectRatio)
          daNumArray.push(item.daNum)
        }
        this.machineOptions.xAxis[0].data = xAxisData
        this.machineOptions.series[0].data = rejectArray
        this.machineOptions.series[1].data = daNumArray
      })
    },
    getWorkerList() {
      const params = {
        beginTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      workerList(params).then(res => {
        if (res.data.length !== 0) {
          const num = res.data[0].rejectNum
          for (const item of res.data) {
            item.progress = (item.rejectNum / num) * 100
          }
          this.nameList = res.data.slice(0, 13)
        } else {
          this.nameList = []
        }
      })
    },
    // 报废原因分析
    getReasonConstitute() {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      reasonConstitute(params).then(res => {
        this.reasonConstituteData = res.data
        if (res.data.length > 0) {
          this.scrapNum1 = this.formatNum(res.data[0].num.toString())
          this.scrapRatio1 = res.data[0].rate
        }
        if (res.data.length > 1) {
          this.scrapNum2 = this.formatNum(res.data[1].num.toString())
          this.scrapRatio2 = res.data[1].rate
        }
        if (res.data.length > 2) {
          this.scrapNum3 = this.formatNum(res.data[2].num.toString())
          this.scrapRatio3 = res.data[2].rate
        }
        var legendData = []
        var daNumArray = []
        for (const item of res.data) {
          legendData.push(item.name)
          daNumArray.push({
            name: item.name,
            value: item.num
          })
        }
        this.abnormalOptions.legend.data = legendData
        this.abnormalOptions.series[0].data = daNumArray
      })
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
      this.sevenDayRejectFun()
      this.getShiftList()
      this.getProductList()
      this.getEqptList()
      this.getWorkerList()
      this.getReasonConstitute()
    },
    // 绘制图表
    darwCharts(arr, chartOptions, xname, yname) {
      var xAxisData = []
      var rejectArray = []
      var daNumArray = []
      for (const item of arr) {
        xAxisData.push(item[xname])
        rejectArray.push(item.rejectRatio)
        daNumArray.push(item[yname])
      }
      chartOptions.xAxis[0].data = xAxisData
      chartOptions.series[0].data = rejectArray
      chartOptions.series[1].data = daNumArray
    },
    handleClick() {
      this.sevenDayRejectFun()
      this.getShiftList()
      this.getProductList()
      this.getEqptList()
      this.getWorkerList()
      this.getReasonConstitute()
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
    handleSearch(data) {
      // const params = {
      //   pageSize: this.pageSize,
      //   pageNum: this.pageNum,
      //   tableName: this.tableName,
      //   uploadState: this.uploadState
      // }
      // this.fetchData(params)
    },
    // 查询
    fetchData(params) {
      this.listLoading = true
      const requestParams = params || {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      logList(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 全部报废原因
    viewAllCause() {
      this.$router.push({ path: '/routine/abnormal', query: { bt: this.beginDate, et: this.endDate }})
    },
    // 全部班次
    viewAllClasses() {
      this.$router.push({ path: '/routine/classes', query: { bt: this.beginDate, et: this.endDate }})
    },
    // 全部设备
    viewEquipmentAll() {
      this.$router.push({ path: '/routine/equipment', query: { bt: this.beginDate, et: this.endDate }})
    },
    // 全部产品
    viewAllProduct() {
      this.$router.push({ path: '/routine/product', query: { bt: this.beginDate, et: this.endDate }})
    },
    // 前后20条切换
    switchBtn(num) {
      this.currentNum = num
      if (num === 1) {
        this.darwCharts(this.productRejectRatioASC, this.productOptions, 'productName', 'daNum')
      } else {
        this.darwCharts(this.productRejectRatioDESC, this.productOptions, 'productName', 'daNum')
      }
    }
  }
}
