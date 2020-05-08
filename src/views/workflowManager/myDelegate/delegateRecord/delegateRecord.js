
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryList } from '@/api/workflowManager/myDelegate/delegateRecord'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      list: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    handleSearch(data) {
      this.pageNum = 1
      this.searchkey = data
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        mandatary: this.searchkey,
        userId: sessionStorage.getItem('User-Id')
      }
      queryList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    }
  }
}

