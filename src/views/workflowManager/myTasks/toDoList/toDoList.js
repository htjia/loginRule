
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { taskList, completeTask, fallBackTask, turnSendTask, detail, findTaskForm } from '@/api/workflowManager/myTasks/toDoList'
import { getList } from '@/api/commonUser'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      viewDetailsVisible: false,
      trunVisible: false,
      transactVisible: false,
      backDialogVisible: false,
      isDisable: false,
      list: [],
      detailList: [],
      encode: '',
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      reason: '',
      taskFrom: '',
      tasksForm: {},
      turnForm: {
        person: ''
      },
      rules: {
        person: [{ required: true, message: '请选择转办人', trigger: 'blur' }]
      },
      workerOptions: [],
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
    this.getUserList()
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
    getUserList() {
      const requestParams = {
        userId: sessionStorage.getItem('User-Id')
      }
      getList(requestParams).then(res => {
        this.workerOptions = res.data.users
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.searchkey,
        assignee: sessionStorage.getItem('User-Id')
      }
      taskList(requestParams).then(res => {
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
    // 回退
    rollback(row) {
      this.reason = ''
      this.currentId = row.id
      this.backDialogVisible = true
    },
    // 确认终止
    confirmDelete() {
      if (this.reason === '') {
        this.$message({
          type: 'error',
          message: '回退原因不能为空!'
        })
      } else {
        const params = {
          taskId: this.currentId,
          reason: this.reason
        }
        console.log(params)
        fallBackTask(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '回退成功!'
            })
            this.backDialogVisible = false
            this.fetchData()
          }
        })
      }
    },
    // 办理
    transact(row) {
      this.currentId = row.id
      const requestParams = {
        taskId: row.id
      }
      findTaskForm(requestParams).then(res => {
        this.taskFrom = res.data.form
        this.transactVisible = true
        setTimeout(() => {
          const form = document.getElementById('taskFrom')
          for (const formItem of form) {
            for (const valueItem of res.data.list) {
              if (formItem.name === valueItem.id) {
                formItem.value = valueItem.value
              }
            }
          }
        }, 100)
      })
    },
    // 办理确定
    submitCompleteForm() {
      this.formFlag = false
      this.form = document.getElementById('taskFrom')
      this.tasksForm = {}
      for (let i = 0; i < this.form.length; i++) {
        const inst = this.form[i]
        if (inst.value === '') {
          this.formFlag = true
        } else {
          this.tasksForm[inst.id] = inst.value
        }
      }
      this.tasksForm['taskId'] = this.currentId
      console.log(this.formFlag)
      console.log(this.tasksForm)
      if (!this.formFlag) {
        completeTask(this.tasksForm).then(res => {
          this.$message({
            type: 'success',
            message: '办理成功!'
          })
          this.fetchData()
          this.transactVisible = false
        })
      } else {
        this.$message({
          type: 'error',
          message: '检测到有未填项，请全部填写!'
        })
      }
    },
    // 转办
    handleTurn(row) {
      this.currentId = row.id
      this.trunVisible = true
    },
    // 转办确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            taskId: this.currentId,
            assignee: this.turnForm.person
          }
          turnSendTask(params).then(res => {
            this.trunVisible = false
            this.$message({
              type: 'success',
              message: '转办成功!'
            })
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭
    handleClose() {
    },
    // 取消
    resetForm(formName) {
      this.trunVisible = false
      this.$refs[formName].resetFields()
    },
    resetCompleteForm() {
      this.transactVisible = false
      this.backDialogVisible = false
    }
  }
}

