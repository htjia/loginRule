
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { historyTasks, withdraw } from '@/api/workflowManager/myTasks/endTasks'
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
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        searchkey: this.searchkey,
        assignee: sessionStorage.getItem('User-Id')
      }
      historyTasks(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 查看详情
    viewDetails(row) {
      this.viewDetailsVisible = true
      const requestParams = {
        executionId: row.executionId
      }
      detail(requestParams).then(res => {
        this.encode = res.data.encode
        this.detailList = res.data.tasks
      })
    },
    // 关闭
    handleClose() {
    },
    // 撤销
    revocation(row) {
      this.$confirm('此操作将撤销已提交任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestParams = {
          hisTaskId: row.taskId
        }
        withdraw(requestParams).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
      })
    }
  }
}

