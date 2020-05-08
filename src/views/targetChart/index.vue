<template>
  <PageHeaderLayout >
    <div id="chart" style="width: 100%;height: calc(100vh - 127px);"><div v-loading="true" class="preloading">正在加载请稍后...</div></div>
  </PageHeaderLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPoint } from '@/api/targetChart'
import PageHeaderLayout from '@/components/PageHeaderLayout'
import echarts from 'echarts'
import resize from '@/utils/resize'
export default {
  name: 'Dashboard',
  components: { PageHeaderLayout },
  mixins: [resize],
  data() {
    return {
      list: null,
      listLoading: true,
      chart: null,
      series: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  watch: {
    // series(val) {
    //   this.initChart(val)
    // }
  },
  created() {
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const seriesArr = []
      getPoint().then(res => {
        for (var item of res.data) {
          seriesArr.push({
            type: 'line',
            data: [[item.cie_x, item.cie_y]],
            color: '#5268A4',
            symbol: 'circle', // 拐点样式
            symbolSize: 7 // 拐点大小
          })
        }
        this.initChart(
          seriesArr
        )
        this.series = seriesArr
        console.log(seriesArr)
        this.listLoading = false
      })
    },
    initChart(series) {
      this.chart = echarts.init(document.getElementById('chart'))
      this.chart.setOption(
        {
          backgroundColor: '#fff',
          title: {
            // text: '对数轴示例',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            itemWidth: 12,
            itemHeight: 10
          },
          xAxis: {
            type: 'value',
            // name: 'x',
            splitLine: { show: true },
            min: function(value) {
              return 0.1
            }
          },
          grid: {
            top: '10%',
            left: '4%',
            right: '4%',
            bottom: '4%',
            containLabel: true
            // show:true
          },
          yAxis: {
            type: '',
            splitLine: { show: true },
            min: function(value) {
              return 0.1
            }
            // name: 'y'
          },
          // series: [
          //   {
          //     type: 'line',
          //     data: [[1, 2]],
          //     color: '#5268A4',
          //     symbol: 'circle', // 拐点样式
          //     symbolSize: 7 // 拐点大小
          //   }
          // ]
          series: series
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .preloading {
    width: 100%;
    height: 100%;
    background: #fff;
    line-height: 150px;
    font-size: 30px;
    text-align: center;
  }
  .dashboard {
    &-container {
      margin: 0px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
