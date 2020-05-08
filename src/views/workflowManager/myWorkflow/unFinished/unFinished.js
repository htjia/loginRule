import store from '../../../../store'
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { flowList, endTask } from '@/api/workflowManager/myWorkflow/unFinished'
import { detail } from '@/api/workflowManager/myTasks/toDoList'
import router from '../../../../router'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      viewDetailsVisible: false,
      deleteDialogVisible: false,
      deleteFlag: false,
      isDisable: false,
      reason: '',
      list: [],
      detailList: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      encode: '',
      imgUrl: 'data:image/jpeg;base64,',
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
  },
  mounted() {
    store.dispatch('GetRouter').then(res => { // 拉取用户信息
      const params = {
        routers: res,
        path: '/workflowManager'
      }
      store.dispatch('GetFunIds', params).then((res) => {
        console.log(222222222222)
        console.log(res)
      })
    })
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
        // this.list = [{}]
        this.list = res.data.list
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
        executionId: row.executionId
      }
      detail(requestParams).then(res => {
        this.encode = res.data.encode
        this.detailList = res.data.tasks
      })
    },
    // 确认终止
    confirmDelete() {
      this.isDisable = true
      if (this.reason === '') {
        this.isDisable = false
        this.$message({
          type: 'error',
          message: '终止原因不能为空!'
        })
      } else {
        const params = {
          executionId: this.currentId,
          flag: !this.deleteFlag,
          reason: this.reason
        }
        console.log(params)
        endTask(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '终止成功!'
            })
            this.deleteDialogVisible = false
            this.fetchData()
          }
        })
      }
    },
    // 终止
    handleEnd(row) {
      this.reason = ''
      this.deleteFlag = true
      this.deleteDialogVisible = true
      this.currentId = row.executionId
    },
    resetForm() {
      this.deleteDialogVisible = false
    }
  }
}

