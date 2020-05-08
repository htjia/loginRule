import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { logList } from '@/api/uploadLog'
import Chart from '@/components/Charts'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      listLoading: false,
      tableName: '',
      searchTime: [],
      uploadState: '',
      list: [],
      lists: [{}, {}, {}, {}, {}],
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
                color: '#7a7a7a'
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
                color: '#7a7a7a'
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
              color: '#7a7a7a'
            },
            axisLine: {
              lineStyle: {
                color: '#7a7a7a',
                width: 1
              }
            },
            axisTick: {
              lineStyle: {
                color: '#7a7a7a'
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
                color: '#7a7a7a',
                width: 1
              }
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#7a7a7a'
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
      }
    }
  },
  watch: {
  },
  created() {
    const params = {
      pageNum: 1,
      pageSize: 10,
      searchkey: ''
    }
    this.fetchData(params)
  },
  mounted() {
  },
  methods: {
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
    }
  }
}
