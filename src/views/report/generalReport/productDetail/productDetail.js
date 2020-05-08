
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { oneOverview, oneProductPlanTrend, productTrend, oneProductPlanList, reason, reasonDetail } from '@/api/report/productDetail'
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
      listLoading: false,
      isYesterday: true,
      productId: '',
      avgRejectRatio: 8,
      num: 0.12,
      contrastVisible: false,
      mouldAndEqptVisible: false,
      scrapFormVisible: false,
      mouldVisible: false,
      eqptVisible: false,
      productPlanTrendLoading: true,
      totalLoading: true,
      list: [],
      normalList: [],
      yzDetailList: [],
      jjgDetailList: [],
      yhDetailList: [],
      unnormalList: [],
      productTrendOptions: {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            console.log(params)
            var result = ''
            if (params[0].data.abnormal) {
              result += '异常工单' + '<br>' + '工单编号：' + params[0].name + '<br>'
            } else {
              result += '工单编号：' + params[0].name + '<br>'
            }
            result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#e25d5d"></span>'
            result += '平均值 : ' + '<span style="color:#fff">' + params[0].data.mean + ' %</span><br>'
            params.forEach(function(item) {
              result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>'
              if (item.seriesName === '报废率') {
                result += item.seriesName + ' : ' + '<span style="color:#fff">' + item.data.value + ' %</span><br>'
              }
            })
            return result
          }
        },
        grid: {
          x: 40,
          y: 40,
          x2: 50,
          y2: 35,
          left: 70,
          right: 70,
          bottom: 40
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
            left: 70, // 左边的距离
            right: 70, // 右边的距离
            bottom: 0, // 右边的距离
            fillerColor: '#d3d3d3', // 选中范围的填充颜色。
            backgroundColor: '#f9f9f9', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            filterMode: 'filter'
          }
        ],
        xAxis: {
          name: '工单号',
          nameLocation: 'start',
          nameGap: 35,
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            margin: 20
            // rotate: -20
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
          data: []
        },
        yAxis: {
          name: '报废率',
          nameGap: 20,
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
        },
        series: [
          {
            name: '报废率',
            type: 'line',
            hoverAnimation: false,
            stack: '总量',
            symbolSize: 8, // 折线点的大小
            data: [],
            // markPoint: {
            //   data: [
            //     { type: 'max',
            //       name: '最大值'
            //     }
            //   ]
            // },
            itemStyle: {
              normal: {
                color: function(param) {
                  if (param.data.abnormal) {
                    return '#e25d5d'
                  } else {
                    return '#2abd6d'
                  }
                },
                symbolSize: 20,
                lineStyle: {
                  color: '#2abd6d'
                },
                label: {
                  show: true,
                  fontSize: 12,
                  position: 'left',
                  formatter: function(param) {
                    var currentValue = param.value
                    if (param.data.abnormal) {
                      currentValue = currentValue + '%'
                    } else {
                      currentValue = currentValue + '%'
                    }
                    return currentValue
                  }
                }
              }
            }
          },
          {
            name: '平行于y轴的趋势线',
            type: 'line',
            markLine: {
              silent: false,
              precision: 2,
              lineStyle: {
                normal: {
                  type: 'dashed',
                  width: 1,
                  color: '#e25d5d' // 这儿设置安全基线颜色
                }
              },
              label: {
                normal: {
                  // formatter: '安全\n基线' // 这儿设置文字
                  formatter: '{c} % \n平均值'
                }
              },
              symbol: 'none', // 去掉箭头
              data: [
                {
                  yAxis: 11
                }
              ]
            }
          }
        ]
      },
      mouldOptions: {
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
        dataZoom: [
          {
            start: 0, // 默认为0
            end: 100,
            type: 'slider', // slider 表示有滑动块的，inside表示内置的
            show: true, // 如果为false 则不显示
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 12, // 组件高度
            left: 40, // 左边的距离
            right: 65, // 右边的距离
            bottom: 16, // 右边的距离
            fillerColor: '#d3d3d3', // 选中范围的填充颜色。
            backgroundColor: '#f9f9f9', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            filterMode: 'filter'
          }
        ],
        xAxis: [
          {
            type: 'category',
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
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              margin: 20
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
          y2: 26,
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
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5]
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
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8]
          }
        ]
      },
      eqptOptions: {
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
        dataZoom: [
          {
            start: 0, // 默认为0
            end: 100,
            type: 'slider', // slider 表示有滑动块的，inside表示内置的
            show: true, // 如果为false 则不显示
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 12, // 组件高度
            left: 40, // 左边的距离
            right: 65, // 右边的距离
            bottom: 16, // 右边的距离
            fillerColor: '#d3d3d3', // 选中范围的填充颜色。
            backgroundColor: '#f9f9f9', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            filterMode: 'filter'
          }
        ],
        xAxis: [
          {
            type: 'category',
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
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              margin: 20
              // rotate: -20
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
          y2: 26,
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
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5]
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
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8]
          }
        ]
      },
      mouldAndEqptOptions: {
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
        dataZoom: [
          {
            start: 0, // 默认为0
            end: 100,
            type: 'slider', // slider 表示有滑动块的，inside表示内置的
            show: true, // 如果为false 则不显示
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 12, // 组件高度
            left: 40, // 左边的距离
            right: 65, // 右边的距离
            bottom: 27, // 右边的距离
            fillerColor: '#d3d3d3', // 选中范围的填充颜色。
            backgroundColor: '#f9f9f9', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            filterMode: 'filter'
          }
        ],
        xAxis: [
          {
            type: 'category',
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
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              margin: 20,
              formatter: function(value) {
                return value.split('+').join('\n')
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
          y2: 50,
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
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5]
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
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8]
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
            name: '异常分析',
            cursor: 'default',
            type: 'pie',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
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
            name: '异常分析',
            cursor: 'default',
            type: 'pie',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
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
        legend: {
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          // itemGap: 40, // 设置间距
          orient: 'vertical',
          selectedMode: false,
          x: '80%',
          y: 'center',
          // orient: 'vertical',  //垂直显示
          // y: 'center',    //延Y轴居中
          // x: 'right' //居右显示
          data: []
        },
        series: [
          {
            name: '压铸报废',
            cursor: 'default',
            type: 'pie',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            minAngle: 2, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
            avoidLabelOverlap: true, // 是否启用防止标签重叠策略
            radius: [0, '50%'],
            label: {
              normal: {
                position: 'inner',
                show: false
              }
            }, // 扇形区域内显示文字
            data: [],
            center: ['30%', '50%']
            // color: ['#10EFE0', '#EF42A4', '#FF8F03']
          },
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
            radius: ['50%', '70%'],
            labelLine: {
              normal: {
                show: true,
                length: 1
              }
            },
            data: [],
            center: ['30%', '50%'],
            color: ['#d53a35', '#d56c28', '#D58C52', 'transparent', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', '#D55A0F', '#A476D5', '#D5809A'],
            startAngle: 90
          }
        ]
      },
      dialogTitle: '',
      totaldaNum: '',
      totalRejectNum: '',
      totalRejectRatio: '',
      daNumTerm: '',
      rejectNumTerm: '',
      rejectRatioTerm: '',
      productName: '',
      productCode: '',
      selectedArr: [],
      mouldTrendList: [],
      eqptTrendList: [],
      mouldAndEqptTrendList: [],
      maxRejectRatioCombine: {},
      minRejectRatioCombine: {},
      maxRejectRatioMoudle: {},
      minRejectRatioMoudle: {},
      productPlanTrend: [],
      scrapFormData: [],
      yhList: [],
      jjgList: [],
      zjList: [],
      yzList: [],
      productRate: {},
      order: '0'
    }
  },
  watch: {},
  created() {
    this.beginDate = parseInt(this.$route.query.bt)
    this.endDate = parseInt(this.$route.query.et)
    this.productId = this.$route.query.id
    this.oneOverviewFun()
    this.oneProductPlanTrendFun()
    this.productTrendFun()
    this.getProductPlanList()
    this.reasonFun()
  },
  mounted() {
    this.getDetailFrom(0)
    this.getDetailFrom(1)
    this.getDetailFrom(2)
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
      if (this.formatDate(this.getYesterdayFormatDate()) === this.formatDate(this.beginDate)) {
        this.isYesterday = true
      } else {
        this.isYesterday = false
      }
      this.oneOverviewFun()
      this.oneProductPlanTrendFun()
      this.productTrendFun()
      this.getProductPlanList()
      this.reasonFun()
      setTimeout(() => {
        this.getDetailFrom(0)
        this.getDetailFrom(1)
        this.getDetailFrom(2)
      }, 100)
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
    // 总览
    oneOverviewFun() {
      this.totalLoading = true
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        productId: this.productId
      }
      oneOverview(params).then(res => {
        this.totalLoading = false
        if (res.data.maxRejectRatioCombine) {
          this.totaldaNum = this.formatNum(res.data.productRejectInfo.daNum.toString())
          this.totalRejectNum = this.formatNum(res.data.productRejectInfo.rejectNum.toString())
          this.totalRejectRatio = res.data.productRejectInfo.rejectRatio
          this.productName = res.data.productRejectInfo.productName
          this.productCode = res.data.productRejectInfo.productCode
          this.daNumTerm = res.data.productRejectInfo.daNumTerm
          this.rejectNumTerm = res.data.productRejectInfo.rejectNumTerm
          this.rejectRatioTerm = res.data.productRejectInfo.rejectRatioTerm
          this.maxRejectRatioCombine = res.data.maxRejectRatioCombine
          this.minRejectRatioCombine = res.data.minRejectRatioCombine
          this.maxRejectRatioMoudle = res.data.maxRejectRatioMoudle
          this.minRejectRatioMoudle = res.data.minRejectRatioMoudle
        } else {
          this.totaldaNum = ''
        }
      })
    },
    // 报废率趋势
    oneProductPlanTrendFun() {
      this.productPlanTrendLoading = true
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        productId: this.productId
      }
      oneProductPlanTrend(params).then(res => {
        if (res.data.length > 0) {
          this.avgRejectRatio = res.data[0].avgRejectRatio
        }
        var xAxisData = []
        var rejectArray = []
        this.productPlanTrendLoading = false
        this.productPlanTrend = res.data
        for (const item of res.data) {
          xAxisData.push(item.woCode)
          // rejectArray.push(item.rejectRatio)
          rejectArray.push({
            value: item.rejectRatio,
            woCode: item.woCode,
            abnormal: item.abnormal,
            mean: this.avgRejectRatio
          })
        }
        this.productTrendOptions.xAxis.data = xAxisData
        this.productTrendOptions.series[0].data = rejectArray
        this.productTrendOptions.series[1].markLine.data[0].yAxis = this.avgRejectRatio
        if (res.data.length > 30) {
          this.productTrendOptions.dataZoom[0].start = 100 - Math.floor(30 / res.data.length * 100)
          this.productTrendOptions.dataZoom[0].show = true
          this.productTrendOptions.xAxis.axisLabel.margin = 10
          this.productTrendOptions.grid.y2 = 35
        } else {
          this.productTrendOptions.dataZoom[0].show = false
          this.productTrendOptions.xAxis.axisLabel.margin = 20
          this.productTrendOptions.grid.y2 = 25
        }
      })
    },
    // 报废图表
    productTrendFun() {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        productId: this.productId
      }
      productTrend(params).then(res => {
        this.mouldTrendList = res.data.mouldTrend
        this.eqptTrendList = res.data.eqptTrend
        this.mouldAndEqptTrendList = res.data.mouldAndEqptTrend
        // 模具
        this.darwCharts(res.data.mouldTrend, this.mouldOptions, 'mould')
        // 设备
        this.darwCharts(res.data.eqptTrend, this.eqptOptions, 'eqpt')
        // 模具+设备
        var xAxisData = []
        var rejectArray = []
        var daNumArray = []
        for (const item of res.data.mouldAndEqptTrend) {
          xAxisData.push(`${item.eqpt}+${item.mould}`)
          rejectArray.push(item.rejectRatio)
          daNumArray.push(item.daNum)
        }
        this.mouldAndEqptOptions.xAxis[0].data = xAxisData
        this.mouldAndEqptOptions.series[0].data = rejectArray
        this.mouldAndEqptOptions.series[1].data = daNumArray
        if (res.data.mouldAndEqptTrend.length > 20) {
          this.mouldAndEqptOptions.dataZoom[0].end = Math.floor(20 / res.data.mouldAndEqptTrend.length * 100)
          this.mouldAndEqptOptions.dataZoom[0].show = true
          this.mouldAndEqptOptions.xAxis[0].axisLabel.margin = 20
          this.mouldAndEqptOptions.grid.y2 = 45
        } else {
          this.mouldAndEqptOptions.dataZoom[0].show = false
          this.mouldAndEqptOptions.xAxis[0].axisLabel.margin = 10
          this.mouldAndEqptOptions.grid.y2 = 35
        }
      })
    },
    // 差异对比list
    getProductPlanList() {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        productId: this.productId
      }
      oneProductPlanList(params).then(res => {
        this.normalList = res.data.normal
        this.unnormalList = res.data.unnormal
        this.list = this.normalList
      })
    },
    // 绘制图表
    darwCharts(arr, chartOptions, name) {
      var xAxisData = []
      var rejectArray = []
      var daNumArray = []
      for (const item of arr) {
        xAxisData.push(item[name])
        rejectArray.push(item.rejectRatio)
        daNumArray.push(item.daNum)
      }
      chartOptions.xAxis[0].data = xAxisData
      chartOptions.series[0].data = rejectArray
      chartOptions.series[1].data = daNumArray
      if (arr.length > 15) {
        chartOptions.dataZoom[0].end = Math.floor(15 / arr.length * 100)
        chartOptions.dataZoom[0].show = true
        chartOptions.xAxis[0].axisLabel.margin = 20
        chartOptions.grid.y2 = 35
      } else {
        chartOptions.dataZoom[0].show = false
        chartOptions.xAxis[0].axisLabel.margin = 10
        chartOptions.grid.y2 = 25
      }
    },
    // 查看全部模具
    viewAllMould() {
      this.mouldVisible = true
    },
    // 查看全部压铸机
    viewAllEqpt() {
      this.eqptVisible = true
    },
    // 查看全部模具+压铸机组合
    viewAllMouldEqpt() {
      this.mouldAndEqptVisible = true
    },
    // 产品趋势源数据
    viewTendencyAll() {
      console.log(1)
    },
    // tabs
    handleClick() {
      this.oneOverviewFun()
      this.oneProductPlanTrendFun()
      this.productTrendFun()
      this.getProductPlanList()
    },
    // 差异对比按钮
    contrastBtn() {
      this.contrastVisible = true
    },
    changeFun(val) {
      if (val.length > 2) {
        // val.forEach(row => {
        //   this.$refs.multipleTable.toggleRowSelection(row)
        // })
      }
      this.selectedArr = val
    },
    // 点击图表
    barClick(data) {
      this.$router.push({
        path: '/routine/contrast',
        query: {
          c1: data,
          pn: this.productName,
          pc: this.productCode
        }
      })
    },
    // 差异对比->跳至对比页面
    contrastFun() {
      console.log(this.selectedArr)
      if (this.selectedArr.length !== 2) {
        this.$message.error('请选取 2 个工单做对比')
        return
      }
      this.$router.push({
        path: '/routine/contrast',
        query: {
          c1: this.selectedArr[0].woCode,
          c2: this.selectedArr[1].woCode,
          pn: this.productName,
          pc: this.productCode
        }
      })
    },
    // 全部/异常 工单
    orderChange(data) {
      if (data === '0') {
        this.list = this.normalList
      } else {
        this.list = this.unnormalList
      }
    },
    // 报废构成
    reasonFun() {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        productId: this.productId
      }
      reason(params).then(res => {
        this.productRate = res.data.productRate
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
        var totalNum = 0
        for (const item of this.zjList) {
          totalNum += item.num
          zjSeriesArray.push({
            name: item.reason,
            value: item.num
          })
        }
        zjSeriesArray.push({
          value: (totalNum * (100 - this.yzList[0].rate)) / this.yzList[0].rate
        })
        if (zjSeriesArray.length === 2) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['transparent', '#D55A0F']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', 'transparent']
          }
        } else if (zjSeriesArray.length === 3) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D53154', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D53154']
          }
        } else if (zjSeriesArray.length === 4) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D53154', '#D56482', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D53154', '#D56482']
          }
        } else if (zjSeriesArray.length === 5) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D58C52', '#D56482', '#D53154', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D58C52', '#D56482', '#D53154']
          }
        } else if (zjSeriesArray.length === 6) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D58C52', '#D56482', '#D53154', '#D58D58', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D58C52', '#D56482', '#D53154', '#D58D58']
          }
        } else if (zjSeriesArray.length === 7) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F']
          }
        } else if (zjSeriesArray.length === 8) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E']
          }
        } else if (zjSeriesArray.length === 9) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', '#D55b0F', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', '#D55b0F']
          }
        } else if (zjSeriesArray.length === 10) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', '#D55b0F', '#A476D5', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', '#D55b0F', '#A476D5']
          }
        } else if (zjSeriesArray.length === 11) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', '#D55b0F', '#A476D5', '#D5809A', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', '#D55b0F', '#A476D5', '#D5809A']
          }
        } else if (zjSeriesArray.length === 12) {
          if (this.yzList.length === 1) {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', '#D55b0F', '#A476D5', '#D5809A', '#aaa', 'transparent']
          } else {
            this.castingOptions.series[1].color = ['#D55A0F', '#d56c28', 'transparent', '#D58C52', '#D56482', '#D53154', '#D58D58', '#D5777F', '#D5166E', '#D55b0F', '#A476D5', '#D5809A', '#aaa']
          }
        }
        this.castingOptions.legend.data = legendData
        this.castingOptions.series[0].data = daNumArray
        if (zjSeriesArray.length > 1) {
          this.castingOptions.series[1].data = zjSeriesArray
          this.castingOptions.legend.x = '80%'
        } else {
          this.castingOptions.series[1].data = []
          this.castingOptions.legend.x = '65%'
        }
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
    // 查看全部报废构成
    viewAllFrom() {
      this.scrapFormVisible = true
    },
    getDetailFrom(process) {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        productId: this.productId,
        process: process
      }
      reasonDetail(params).then(res => {
        if (process === 0) {
          this.yzDetailList = res.data.list
        } else if (process === 1) {
          this.jjgDetailList = res.data.list
        } else {
          this.yhDetailList = res.data.list
        }
      })
    }
  }
}
