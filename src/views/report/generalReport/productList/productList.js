
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { everyOneReject } from '@/api/report/product'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      list: [],
      productOptions: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      time: '',
      totalPage: 0,
      currentId: '',
      timeFame: '',
      beginTime: '',
      beginDate: '',
      endDate: '',
      beginDateTamp: '',
      endDateTamp: '',
      endTime: '',
      sortType: '',
      productId: '',
      productForm: {
        product: ''
      },
      rules: {
        product: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
  },
  created() {
    this.beginDate = this.$route.query.bt
    this.beginDateTamp = parseInt(this.$route.query.btp)
    this.endDate = this.$route.query.et
    this.endDateTamp = parseInt(this.$route.query.etp)
    this.sortType = this.$route.query.s
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      document.getElementById('tableTop').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      document.getElementById('tableTop').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    },
    // 清空选中项
    clearSelected(formName) {
      this.$refs[formName].resetFields()
      this.fetchData()
    },
    // 搜索
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.pageNum = 1
          this.fetchData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        productId: this.productForm.product,
        startTime: this.beginDate,
        endTime: this.endDate,
        orderType: this.sortType
      }
      everyOneReject(params).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          this.list = res.data
          for (const item of res.data) {
            this.productOptions.push({
              name: `${item.productCode}/${item.productName}`,
              id: item.productId
            })
          }
          this.totalPage = res.data.length
        }
      })
    },
    timeChanged(data) {
      console.log(data)
    },
    // 详情按钮跳转
    handleDetails(row) {
      this.$router.push({ path: '/routine/productDetail', query: { id: row.productId, bt: parseInt(this.beginDateTamp), et: parseInt(this.endDateTamp) }})
    }
  }
}

