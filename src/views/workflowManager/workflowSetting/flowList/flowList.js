
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findProcess, activateProcess, deleteProcess, hangProcess, flowImage } from '@/api/workflowSetting'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      updatePwdDialogVisible: false,
      deleteDialogVisible: false,
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
      name: '',
      userForm: {
        name: '',
        userName: '',
        passWord: '',
        confirmPassWord: '',
        role: ''
      },
      currentId: '',
      deleteFlag: true,
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
      findProcess(requestParams).then(res => {
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
    // 流程图
    handleFlow(row) {
      flowImage({ deploymentId: row.deploymentId }).then(res => {
        if (res.code === 0) {
          this.imgUrl = res.data
          this.editDialogVisible = false
          this.fetchData()
        }
      })
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm() {
      this.editDialogVisible = false
      this.updatePwdDialogVisible = false
      this.addDialogVisible = false
      this.deleteDialogVisible = false
    },
    // 激活
    handleActive(row) {
      this.$confirm('此操作将激活该流程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activateProcess({ processKey: row.key, version: row.version }).then(res => {
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
    // 删除
    handleDelete(row) {
      this.deleteFlag = true
      this.deleteDialogVisible = true
      this.currentId = row.deploymentId
    },
    // 确认删除
    confirmDelete() {
      this.isDisable = true
      deleteProcess({ deploymentId: this.currentId, flag: !this.deleteFlag }).then(res => {
        this.isDisable = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.deleteDialogVisible = false
          this.fetchData()
        }
      }, res => {
        this.isDisable = false
      })
    },
    // 挂起
    handleHang(row) {
      this.currentId = row.id
      this.$confirm('此操作将挂起该流程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hangProcess({ processKey: row.key, version: row.version }).then(res => {
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

