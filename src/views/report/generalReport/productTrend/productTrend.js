
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { productEverydayTrend } from '@/api/report/product'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
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
      beginDate: '',
      endDate: '',
      listLoading: false,
      list: [],
      searchkey: '',
      beginTime: '',
      endTime: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    this.beginDate = this.$route.query.bt
    this.endDate = this.$route.query.et
    this.productEverydayTrendFun()
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
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.productEverydayTrendFun()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.productEverydayTrendFun()
    },
    handleSearch(data) {
      this.pageNum = 1
      this.productEverydayTrendFun()
    },
    // 查询
    productEverydayTrendFun() {
      this.listLoading = true
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        pageNum: this.pageNum,
        orderType: 1,
        pageSize: this.pageSize
      }
      productEverydayTrend(params).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          console.log(res)
          this.list = res.data.list
          this.totalPage = res.data.total
          document.getElementById('tableTop').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
        }
      })
    },
    timeChanged(data) {
      console.log(data)
    }
  }
}

