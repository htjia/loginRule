
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { flowList } from '@/api/workflowManager/myWorkflow/finished'
import { detail } from '@/api/workflowManager/myTasks/toDoList'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      viewDetailsVisible: false,
      list: [],
      detailList: [],
      encode: '',
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
        userId: sessionStorage.getItem('User-Id'),
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        processName: this.searchkey
      }
      flowList(requestParams).then(res => {
        this.list = res.data.list
        // this.list = [{}]
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 关闭
    handleClose() {
    },
    // 查看详情
    viewDetails(row) {
      this.viewDetailsVisible = true
      const requestParams = {
        executionId: row.id
      }
      detail(requestParams).then(res => {
        this.encode = res.data.encode
        this.detailList = res.data.tasks
      })
    }
  }
}

