
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { ruleList, add, update, remove, findMyProcess } from '@/api/workflowManager/myDelegate/delegationRules'
import { getList } from '@/api/commonUser'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      list: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.deleagteForm.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal || time.getTime() < Date.now() - 86400000
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.deleagteForm.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      procesOptions: [],
      userOptions: [],
      deleagteForm: {
        endDate: '',
        beginDate: '',
        person: '',
        flow: ''
      },
      rules: {
        beginDate: [{ type: 'date', required: true, message: '请选择开始日期', trigger: 'blur' }],
        endDate: [{ type: 'date', required: true, message: '请选择结束日期', trigger: 'blur' }],
        person: [{ required: true, message: '请选择委托人', trigger: 'blur' }],
        flow: [{ required: true, message: '请选择委托流程', trigger: 'blur' }]
      },
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
    this.findMyProcessFun()
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
      this.searchkey = data
      this.pageNum = 1
      this.fetchData()
    },
    // 获取所有委托人
    getUserList() {
      const requestParams = {
        userId: sessionStorage.getItem('User-Id')
      }
      getList(requestParams).then(res => {
        this.userOptions = res.data.users
      })
    },
    // 所有流程
    findMyProcessFun() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1
      }
      findMyProcess(requestParams).then(res => {
        this.procesOptions = res.data.list
      })
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
      ruleList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.deleagteForm.endDate = ''
      this.deleagteForm.beginDate = ''
      this.deleagteForm.person = ''
      this.deleagteForm.flow = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            consignor: sessionStorage.getItem('User-Id'), // 委托人
            endTime: this.formatDate(this.deleagteForm.endDate),
            startTime: this.formatDate(this.deleagteForm.beginDate),
            mandatary: this.deleagteForm.person, // 被委托人
            process: this.deleagteForm.flow // 流程
          }
          add(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            consignor: sessionStorage.getItem('User-Id'), // 委托人
            endTime: this.formatDate(this.deleagteForm.endDate),
            startTime: this.formatDate(this.deleagteForm.beginDate),
            mandatary: this.deleagteForm.person, // 被委托人
            process: this.deleagteForm.flow // 流程
          }
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.updatePwdDialogVisible = false
      this.addDialogVisible = false
      this.configDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.currentId = row.id
      this.deleagteForm.endDate = Date.parse(new Date(row.endTime))
      this.deleagteForm.beginDate = Date.parse(new Date(row.startTime))
      this.deleagteForm.person = row.mandatary
      this.deleagteForm.flow = row.process
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        remove(param).then(res => {
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
    }
  }
}

