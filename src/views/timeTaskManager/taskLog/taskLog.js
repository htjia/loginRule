import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { query, remove, detail, removeAll } from '@/api/timetask/taskLog'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      detailVisible: false,
      list: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      issucess: '-1',
      jobForm: {
        jobName: '',
        code: '',
        issucess: '0',
        createTime: '',
        logContent: ''
      },
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    const params = {
      pageNum: 1,
      pageSize: 15,
      searchkey: ''
    }
    this.fetchData(params)
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
    // 查询
    handleSearch(data) {
      const params = {
        pageSize: this.pageSize,
        pageNum: 1,
        searchkey: this.searchkey,
        issucess: this.issucess
      }
      this.fetchData(params)
    },
    fetchData(params) {
      this.listLoading = true
      const requestParams = params || {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        searchkey: this.searchkey,
        taskType: this.taskType
      }
      query(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
          document.getElementById('tableTop').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 查看详细
    handleDetail(row) {
      this.listLoading = true
      const requestParams = row.id
      detail(requestParams).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          this.jobForm.jobName = res.data.jobName
          this.jobForm.code = res.data.code
          this.jobForm.issucess = res.data.issucess.toString()
          this.jobForm.createTime = res.data.createTime
          this.jobForm.logContent = res.data.logContent
          this.detailVisible = true
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.detailVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该任务日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    // 清空所有日志
    clearall() {
      this.$confirm('此操作将永久删除任务日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeAll().then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '清空所有日志成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    }
  }
}
