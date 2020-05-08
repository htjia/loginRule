import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { summary, reason, reasonDetail, productThan } from '@/api/report/abnormal'
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
      scrapFormDataLoading: true,
      currentNum: 0,
      currentMachiningNum: 0,
      currentInspectionNum: 0,
      num: 0.12,
      castVisible: false,
      detailList: [],
      detailList1: [],
      detailList2: [],
      detailList3: [],
      abnormalData: [],
      rate: '',
      rate1: '',
      rate2: '',
      rate3: '',
      daNum: '',
      daNum1: '',
      daNum2: '',
      daNum3: '',
      yzList: [],
      zjList: [],
      yhList: [],
      jjgList: [],
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
          y2: 20,
          top: 30
        },
        series: [
          {
            barMaxWidth: '18',
            barGap: '80%',
            barMinHeight: 5,
            cursor: 'default',
            name: '报废率',
            type: 'bar',
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
            data: []
          },
          {
            barMaxWidth: '18',
            barGap: '80%',
            barMinHeight: 5,
            cursor: 'default',
            name: '生产总数',
            type: 'bar',
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
      jjgContrastOptions: {
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
          y2: 20,
          top: 30
        },
        series: [
          {
            barMaxWidth: '18',
            barGap: '80%',
            barMinHeight: 5,
            cursor: 'default',
            name: '报废率',
            type: 'bar',
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
            data: []
          },
          {
            barMaxWidth: '18',
            barGap: '80%',
            barMinHeight: 5,
            cursor: 'default',
            name: '生产总数',
            type: 'bar',
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
      yhContrastOptions: {
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
          y2: 20,
          top: 30
        },
        series: [
          {
            barMaxWidth: '18',
            barGap: '80%',
            barMinHeight: 5,
            cursor: 'default',
            name: '报废率',
            type: 'bar',
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
            data: []
          },
          {
            barMaxWidth: '18',
            barGap: '80%',
            barMinHeight: 5,
            cursor: 'default',
            name: '生产总数',
            type: 'bar',
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
      abnormalOptions: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}'
        },
        legend: {
          orient: 'vertical',
          x: '70%',
          y: 'center',
          // orient: 'vertical',  //垂直显示
          // y: 'center',    //延Y轴居中
          // x: 'right' //居右显示
          data: [],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10 // 设置高度
        },
        series: [
          {
            name: '报废环节',
            cursor: 'default',
            type: 'pie',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            // radius: ['50%', '70%'],
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
            center: ['35%', '50%']
          }
        ]
      },
      machiningOptions: {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            var result = params.name + '<br>'
            result += '报废总数: ' + params.value + '<br>'
            result += '占比: ' + params.percent + '%'
            return result
          }
        },
        legend: {
          orient: 'vertical',
          x: '80%',
          y: 'center',
          // orient: 'vertical',  //垂直显示
          // y: 'center',    //延Y轴居中
          // x: 'right' //居右显示
          data: [],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10 // 设置高度
        },
        series: [
          {
            type: 'pie',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            cursor: 'default',
            radius: ['0', '60%'],
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
            center: ['40%', '50%']
          }
        ]
      },
      yhOptions: {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            var result = params.name + '<br>'
            result += '报废总数: ' + params.value + '<br>'
            result += '占比: ' + params.percent + '%'
            return result
          }
        },
        legend: {
          orient: 'vertical',
          x: '80%',
          y: 'center',
          // orient: 'vertical',  //垂直显示
          // y: 'center',    //延Y轴居中
          // x: 'right' //居右显示
          data: [],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10 // 设置高度
        },
        series: [
          {
            type: 'pie',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            radius: ['0', '60%'],
            cursor: 'default',
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
            center: ['40%', '50%']
          }
        ]
      },
      castingOptions: {
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b}: {c} ({d}%)'
          formatter: function(params) {
            if (params.name !== '') {
              var result = params.name + '<br>'
              result += '报废总数: ' + params.value + '<br>'
              result += '占比: ' + params.percent + '%'
              return result
            }
          }
        },
        series: [
          {
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
            label: {
              normal: {
                show: true,
                // position: 'center',
                textStyle: {
                  fontWeight: 700,
                  fontSize: 13 // 文字的字体大小
                },
                formatter: '{b}\n{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            radius: [0, '55%'],
            data: [],
            center: ['50%', '50%']
            // color: ['#10EFE0', '#EF42A4', '#FF8F03']
          }
        ]
      },
      castingZjOptions: {
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b}: {c} ({d}%)'
          formatter: function(params) {
            if (params.name !== '') {
              var result = params.name + '<br>'
              result += '报废总数: ' + params.value + '<br>'
              result += '占比: ' + params.percent + '%'
              return result
            }
          }
        },
        series: [
          {
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
            label: {
              normal: {
                show: true,
                // position: 'center',
                textStyle: {
                  fontWeight: 700,
                  fontSize: 13 // 文字的字体大小
                },
                formatter: '{b} {d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            radius: [0, '40%'],
            data: [],
            center: ['55%', '50%']
            // color: ['#10EFE0', '#EF42A4', '#FF8F03']
          }
        ]
      },
      anum: '',
      aratio: '',
      lrate: 1,
      lratio: '',
      zggx: '',
      zghb: '',
      zgrate: '',
      yzyy: '',
      yznum: '',
      yzzb: '',
      jjgnum: '',
      jjgyy: '',
      jjgzb: '',
      yhyy: '',
      yhnum: '',
      yhzb: '',
      dialogTitle: '',
      productThanData: [],
      productThanJjData: [],
      productThanYhData: [],
      isYesterday: true,
      scrapFormData: []
    }
  },
  watch: {
  },
  beforeRouteEnter(to, from, next) {
    const back = sessionStorage.getItem('back')
    const bt = sessionStorage.getItem('bt')
    const et = sessionStorage.getItem('et')
    if (back === '1' && bt !== null && et !== null && (from.path.indexOf('abnormalProduct') > -1 || from.path.indexOf('cockpit') > -1)) {
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
    this.summaryFun()
    this.reasonFun()
    this.productThanFun(0, 0)
    this.productThanFun(1, 0)
    this.productThanFun(2, 0)
  },
  mounted() {
    this.reasonDetailFun(0)
    this.reasonDetailFun(1)
    this.reasonDetailFun(2)
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
      this.summaryFun()
      this.reasonFun()
      this.productThanFun(0, 0)
      this.productThanFun(1, 0)
      this.productThanFun(2, 0)
      // 查看全部
      setTimeout(() => {
        this.reasonDetailFun(0)
        this.reasonDetailFun(1)
        this.reasonDetailFun(2)
      }, 1000)
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
    // 总览信息
    summaryFun() {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      summary(params).then(res => {
        this.anum = res.data.anum ? this.formatNum(res.data.anum.toString()) : ''
        this.yznum = res.data.yznum ? this.formatNum(res.data.yznum.toString()) : ''
        this.jjgnum = res.data.jjgnum ? this.formatNum(res.data.jjgnum.toString()) : ''
        this.yhnum = res.data.yhnum ? this.formatNum(res.data.yhnum.toString()) : ''
        this.aratio = res.data.aratio
        this.lrate = res.data.lrate
        this.lratio = res.data.lratio
        this.zghb = res.data.zghb
        this.zgrate = res.data.zgrate
        this.yzzb = res.data.yzzb
        this.jjgzb = res.data.jjgzb
        this.yhzb = res.data.yhzb
        this.zggx = res.data.zggx
        this.yzyy = res.data.yzyy.split('，')
        this.jjgyy = res.data.jjgyy.split('，')
        this.yhyy = res.data.yhyy.split('，')
        this.yzyyAll = res.data.yzyy
        this.jjgyyAll = res.data.jjgyy
        this.yhyyAll = res.data.yhyy
        this.abnormalData = res.data.list
        var legendData = []
        var daNumArray = []
        for (const item of res.data.list) {
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
    // 报废构成
    reasonFun() {
      this.scrapFormDataLoading = true
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      reason(params).then(res => {
        this.scrapFormDataLoading = false
        // 压铸报废构成
        this.scrapFormData = res.data.yzList
        this.yzList = res.data.yzList
        this.zjList = res.data.zjList
        this.jjgList = res.data.jjgList
        this.yhList = res.data.yhList
        var legendData = []
        var daNumArray = []
        var zjSeriesArray = []
        for (const item of this.yzList) {
          legendData.push(item.reason)
          daNumArray.push({
            name: item.reason,
            value: item.num
          })
        }
        for (const item of this.zjList) {
          zjSeriesArray.push({
            name: item.reason,
            value: item.num
          })
        }
        this.castingOptions.series[0].data = daNumArray
        this.castingZjOptions.series[0].data = zjSeriesArray
        // 机加工报废构成
        var machiningLegendData = []
        var machiningNumArray = []
        for (const item of this.jjgList) {
          machiningLegendData.push(item.reason)
          machiningNumArray.push({
            name: item.reason,
            value: item.num
          })
        }
        this.machiningOptions.legend.data = machiningLegendData
        this.machiningOptions.series[0].data = machiningNumArray
        // 氧化终检
        var yhLegendData = []
        var yhNumArray = []
        for (const item of this.yhList) {
          yhLegendData.push(item.reason)
          yhNumArray.push({
            name: item.reason,
            value: item.num
          })
        }
        this.yhOptions.legend.data = yhLegendData
        this.yhOptions.series[0].data = yhNumArray
      })
    },
    // 报废构成详情
    reasonDetailFun(process) {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        process: process
      }
      reasonDetail(params).then(res => {
        if (process === 0) {
          this.detailList1 = res.data.list
          this.rate1 = res.data.rate
          this.daNum1 = this.formatNum(res.data.num.toString())
        } else if (process === 1) {
          this.detailList2 = res.data.list
          this.rate2 = res.data.rate
          this.daNum2 = this.formatNum(res.data.num.toString())
        } else {
          this.detailList3 = res.data.list
          this.rate3 = res.data.rate
          this.daNum3 = this.formatNum(res.data.num.toString())
        }
      })
    },
    // 产品对比
    productThanFun(process, orderWay) {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        process: process,
        orderWay: orderWay
      }
      productThan(params).then(res => {
        if (process === 0) {
          this.productThanData = res.data
          this.darwCharts(res.data, this.machineOptions)
        } else if (process === 1) {
          this.productThanJjData = res.data
          this.darwCharts(res.data, this.jjgContrastOptions)
        } else {
          this.productThanYhData = res.data
          this.darwCharts(res.data, this.yhContrastOptions)
        }
      })
    },
    // 绘制图表
    darwCharts(arr, chartOptions) {
      var xAxisData = []
      var rejectArray = []
      var daNumArray = []
      for (const item of arr) {
        xAxisData.push(item.name)
        rejectArray.push(item.rate)
        daNumArray.push(item.pnum)
      }
      chartOptions.xAxis[0].data = xAxisData
      chartOptions.series[0].data = rejectArray
      chartOptions.series[1].data = daNumArray
    },
    viewAll() {
      console.log('查看全部')
    },
    // 全部压铸
    viewAllYz() {
      this.detailList = this.detailList1
      this.rate = this.rate1
      this.daNum = this.daNum1
      this.dialogTitle = '压铸报废构成'
      this.castVisible = true
    },
    // 全部机加工
    viewAllMachine() {
      this.detailList = this.detailList2
      this.rate = this.rate2
      this.daNum = this.daNum2
      this.dialogTitle = '机加工报废构成'
      this.castVisible = true
    },
    // 全部氧化
    viewAllCombustion() {
      this.detailList = this.detailList3
      this.rate = this.rate3
      this.daNum = this.daNum3
      this.dialogTitle = '氧化终检报废构成'
      this.castVisible = true
    },
    // tabs
    handleClick() {
      this.summaryFun()
      this.reasonFun()
      this.productThanFun(0, 0)
      this.productThanFun(1, 0)
      this.productThanFun(2, 0)
      // 查看全部
      setTimeout(() => {
        this.reasonDetailFun(0)
        this.reasonDetailFun(1)
        this.reasonDetailFun(2)
      }, 1000)
    },
    // 前后10条切换
    switchBtn(num) {
      this.currentNum = num
      this.productThanFun(0, num)
    },
    // 机加工产品对比前后10条切换
    machiningSwitchBtn(num) {
      this.currentMachiningNum = num
      this.productThanFun(1, num)
    },
    // 氧化终检对比前后10条切换
    inspectionSwitchBtn(num) {
      this.productThanFun(2, num)
      this.currentInspectionNum = num
    },
    // 全部产品
    viewAllProduct(num) {
      this.$router.push({ path: '/routine/abnormalProduct', query: { bt: this.beginDate, et: this.endDate, s: num }})
    }
  }
}
