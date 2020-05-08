
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findAllTask, activateTask, hangTask, skipTask, endTask, interfaceDetail } from '@/api/workflowSetting'
import { getUserId } from '@/utils/auth'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      jumpDialogVisible: false,
      list: [],
      postOptions: [],
      roleOptions: [],
      deptList: [],
      username: '',
      defaultProps: {
        children: 'child',
        label: 'label'
      },
      imgUrl: '',
      treeData: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      imgPageSize: 15,
      imgPageNum: 1,
      imgTotalPage: 0,
      name: '',
      currentId: '',
      deleteFlag: false,
      reason: '',
      imgDate: [],
      isDisable: false
    }
  },
  watch: {
  },
  created() {
    const params = {
      pageNum: 1,
      pageSize: 15,
      name: ''
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
        pageNum: 1,
        name: this.searchkey
      }
      this.pageNum = 1
      this.fetchData(params)
    },
    // 查询
    fetchData(params) {
      this.listLoading = true
      const requestParams = params || {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.searchkey
      }
      findAllTask(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 每页数量改变
    imgSizeChange(pageSize) {
      const params = {
        executionId: this.currentId,
        pageNum: this.imgPageNum,
        pageSize
      }
      this.imgPageSize = pageSize
      this.flowImageList(params)
    },
    // 当前页数改变
    imgCurrentChange(pageNum) {
      const params = {
        executionId: this.currentId,
        pageSize: this.imgPageSize,
        pageNum
      }
      this.imgPageNum = pageNum
      this.flowImageList(params)
    },
    // 流程图列表
    flowImageList(params) {
      interfaceDetail(params).then(res => {
        if (res.code === 0) {
          this.imgUrl = res.data.encode
          this.imgDate = res.data.tasks
          this.imgTotalPage = parseInt(res.data.tasks.total)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 流程图
    handleFlow(row) {
      this.addDialogVisible = true
      this.currentId = row.executionId
      const params = {
        executionId: this.currentId,
        pageNum: this.imgPageNum,
        pageSize: this.imgPageSize
      }
      this.flowImageList(params)
    },
    // 跳过流程图
    confirmJump(row) {
      this.isDisable = true
      if (this.reason === '') {
        this.isDisable = false
        this.$message({
          type: 'error',
          message: '跳过原因不能为空!'
        })
      } else {
        skipTask({ taskId: this.currentId, userId: getUserId(), reason: this.reason }).then(res => {
          this.isDisable = false
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '跳过成功!'
            })
            this.jumpDialogVisible = false
            this.fetchData()
          }
        }, res => {
          this.isDisable = false
        })
      }
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.deleteDialogVisible = false
      this.addDialogVisible = false
      this.jumpDialogVisible = false
    },
    // 激活
    handleActive(row) {
      this.$confirm('此操作将激活该流程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activateTask({ executionId: row.executionId }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '激活成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
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
        endTask({ executionId: this.currentId, flag: !this.deleteFlag, reason: this.reason }).then(res => {
          this.isDisable = false
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '终止成功!'
            })
            this.deleteDialogVisible = false
            this.fetchData()
          }
        }, res => {
          this.isDisable = false
        })
      }
    },
    // 终止
    handleDelete(row) {
      this.deleteFlag = true
      this.deleteDialogVisible = true
      this.currentId = row.executionId
      this.reason = ''
    },
    // 跳过
    handleJump(row) {
      this.jumpDialogVisible = true
      this.currentId = row.id
      this.reason = ''
    },
    // 挂起
    handleHang(row) {
      this.currentId = row.id
      this.$confirm('此操作将挂起该流程, 是否继续?', '挂起', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hangTask({ executionId: row.executionId }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '挂起成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    }
  }
}

