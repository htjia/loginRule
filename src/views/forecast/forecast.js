import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getWholeFore, everyEqptPrediction } from '@/api/forecast'
import Chart from '@/components/Charts'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      listLoading: false,
      tableName: '',
      precisionValue: '0',
      searchTime: [],
      uploadState: '',
      list: [],
      lists: [{}, {}, {}, {}, {}],
      precision: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '60%以上'
        },
        {
          value: '2',
          label: '70%以上'
        },
        {
          value: '3',
          label: '80%以上'
        },
        {
          value: '4',
          label: '90%以上'
        }
      ],
      pageSize: 10,
      pageNum: 1,
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
      options: {
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
        },
        calculable: false,
        xAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLine: {
              lineStyle: {
                color: 'rgb(174, 174, 174)',
                width: 1
              },
              show: true
            },
            axisTick: {
              show: true,
              inside: true,
              length: 5,
              lineStyle: {
                color: 'rgb(174, 174, 174)'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#474747'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: ['13#', '14#', '17#', '4#', '2#', '1#'],
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgb(174, 174, 174)',
                width: 1
              }
            },
            axisLabel: {
              margin: 15,
              textStyle: {
                color: '#474747'
              }
              // formatter: '{value} 包'
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgb(215, 215, 215)'
              },
              show: true
            }
          }
        ],
        series: [
          {
            name: '报废率',
            type: 'bar',
            barMaxWidth: '15',
            barMinHeight: 5,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7',
                    '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494',
                    '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7',
                    '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            },

            // 设置柱的宽度，要是数据太少，柱子太宽不美观~

            barWidth: 20,
            data: [0.05, 0.06, 0.07, 0.08, 0.09, 0.1]
          }
        ],
        // color: ['rgb(51, 169, 169)'],
        animation: true,
        animationEasing: 'ElasticInOut',
        grid: {
          x: 50,
          y: 20,
          x2: 30,
          y2: 40
        }
      },
      abnormalOptions: {
      },
      scrappageOptions: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            data: ['2018-11-1', '2018-11-2', '2018-11-3', '2018-11-4', '2018-11-5', '2018-11-6', '2018-11-7', '2018-11-8', '2018-11-9', '2018-11-10', '2018-11-11', '2018-11-12', '2018-11-13', '2018-11-14'],
            nameTextStyle: {
              color: '#474747'
            },
            axisLine: {
              lineStyle: {
                color: '#474747',
                width: 1
              }
            },
            axisTick: {
              lineStyle: {
                color: '#474747'
              }
            },
            axisLabel: {
              margin: 15,
              interval: 0
              // interval: 0,
              // formatter: function(value) {
              //   return value.split('').join('\n')
              // }
            },
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#474747',
                width: 1
              }
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#474747'
              }
            },
            axisLabel: {
              show: true,
              margin: 15
            }
          }
        ],
        series: [
          {
            name: '报废率',
            type: 'line',
            hoverAnimation: false,
            data: [11, 11, 15, 13, 12, 13, 10, 10, 10, 10, 10, 10, 10, 10]
          }
        ],
        grid: {
          x: 30,
          y: 21,
          x2: 40,
          y2: 40
        },
        color: ['#ff7f50', '#87cefa', '#da70d6']
      },
      beginTime: '',
      endTime: '',
      sixFore: '',
      sevenFore: '',
      eightFore: '',
      nineFore: '',
      foreCount: '',
      successCount: '',
      orderNum: 1,
      orderType: 0,
      accuracyRatio: ''
    }
  },
  watch: {
  },
  created() {
    this.getWholeForeFun()
    this.everyEqptPredictionFun()
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
    // 生产过程预测统计信息
    getWholeForeFun() {
      getWholeFore({}).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.beginTime = res.data.beginTime
          this.endTime = res.data.endTime
          this.sixFore = this.formatNum(res.data.sixFore.toString())
          this.sevenFore = this.formatNum(res.data.sevenFore.toString())
          this.eightFore = this.formatNum(res.data.eightFore.toString())
          this.nineFore = this.formatNum(res.data.nineFore.toString())
          this.foreCount = this.formatNum(res.data.allFore.foreCount.toString())
          this.successCount = this.formatNum(res.data.allFore.successCount.toString())
          this.accuracyRatio = res.data.allFore.accuracyRatio
        }
      })
    },
    selectedChange() {
      this.pageNum = 1
      this.everyEqptPredictionFun()
    },
    // 按指定范围请求各设备预测情况
    everyEqptPredictionFun() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        successRatio: this.precisionValue,
        orderNum: this.orderNum,
        orderType: this.orderType
      }
      everyEqptPrediction(params).then(res => {
        this.list = res.data.list
        this.totalPage = res.data.total
      })
    },
    sortChange(column) {
      console.log(column)
      if (column.order === 'ascending') {
        this.orderType = 0 // 升
      } else {
        this.orderType = 1 // 降
      }
      if (column.prop === 'eqptCode') {
        this.orderNum = 1 // 设备
      } else if (column.prop === 'foreCount') {
        this.orderNum = 2 // 预测数
      } else {
        this.orderNum = 3 // 成功率
      }
      this.everyEqptPredictionFun()
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.everyEqptPredictionFun()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.everyEqptPredictionFun()
    },
    handleSearch(data) {
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        tableName: this.tableName,
        startTime: this.searchTime[0],
        endTime: this.searchTime[1],
        uploadState: this.uploadState
      }
      this.fetchData(params)
    },
    // 查看全部
    viewDetails(row) {
      this.$router.push({ path: '/forecastDetail/index', query: { id: row.eqptId }})
    }
  }
}
