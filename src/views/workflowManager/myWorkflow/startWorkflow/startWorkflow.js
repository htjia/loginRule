
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findMyProcess, findStartForm, endTask, completestart, completeTask } from '@/api/workflowSetting'
import { getUserId } from '@/utils/auth'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      updatePwdDialogVisible: false,
      configDialogVisible: false,
      list: [],
      postOptions: [],
      roleOptions: [],
      deptList: [],
      username: '',
      defaultProps: {
        children: 'child',
        label: 'label'
      },
      treeData: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      name: '',
      currentId: '',
      sendInfo: {},
      tokenForm: {},
      listOne: {},
      formFlag: false,
      isDisable: false
    }
  },
  watch: {
  },
  created() {
    const params = {
      userId: getUserId(),
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
        userId: getUserId(),
        pageNum: this.pageNum,
        pageSize
      }
      this.pageSize = pageSize
      this.fetchData(params)
    },
    // 当前页数改变
    currentChange(pageNum) {
      const params = {
        userId: getUserId(),
        pageSize: this.pageSize,
        pageNum
      }
      this.pageNum = pageNum
      this.fetchData(params)
    },
    handleSearch(data) {
      const params = {
        userId: getUserId(),
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
        userId: getUserId(),
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.searchkey
      }
      findMyProcess(requestParams).then(res => {
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
    // 发起流程
    handleSend(row) {
      this.listOne = row
      this.isDisable = true
      this.sendInfo = ''
      findStartForm({ processId: row.id, userId: getUserId() }).then(res => {
        this.isDisable = false
        if (res.code === 0) {
          this.sendInfo = res.data
          this.currentId = res.data.executionId
          this.addDialogVisible = true
        }
      }, res => {
        this.isDisable = false
      })
    },
    // 关闭
    handleClose() {
      this.addDialogVisible = false
    },
    // 添加提交
    submitForm(formName) {
      this.formFlag = false
      this.form = document.getElementById('tokenForm')
      for (let i = 0; i < this.form.length; i++) {
        const inst = this.form[i]
        if (inst.value === '') {
          this.formFlag = true
        } else {
          this.tokenForm[inst.id] = inst.value
        }
      }
      if (!this.formFlag) {
        if (this.sendInfo.taskId === '') {
          this.tokenForm.processKey = this.listOne.key
          this.tokenForm.userId = getUserId()
          completestart(this.tokenForm).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.addDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          document.getElementById('tokenForm')
          this.tokenForm.taskId = this.sendInfo.taskId
          completeTask(this.tokenForm).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.addDialogVisible = false
              this.fetchData()
            }
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请填写完整的表单!'
        })
        return false
      }
    },
    // 取消
    resetForm(row) {
      this.addDialogVisible = false
      if (this.currentId !== '') {
        endTask({ executionId: this.currentId, reason: '', flag: true }).then(res => {
          if (res.code === 0) {
            this.addDialogVisible = false
          }
        })
      }
    }
  }
}

