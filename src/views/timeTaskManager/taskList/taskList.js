import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { query, add, remove, detail } from '@/api/timetask/taskList'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateLevel = (rule, value, callback) => {
      if (!value) {
        callback(new Error('任务等级不能为空'))
      }
      if (value < -1) {
        callback(new Error('任务等级最小为-1'))
      } else {
        callback()
      }
    }
    const validatePath = (rule, value, callback) => {
      if (!value) {
        callback(new Error('任务jar包存放路径不能为空'))
      }
      if (value.length > 100) {
        callback(new Error('路径长度不能大于100'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      detailVisible: false,
      list: [],
      preTeskOptions: [],
      preTaskName: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      taskType: '-1',
      jobForm: {
        jobName: '',
        param: '',
        timeOut: '',
        level: '',
        taskType: '0',
        jarPath: '',
        taskClassName: '',
        jarMethodName: '',
        jarMethodType: '0',
        preTask: []
      },
      rules: {
        jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
        timeOut: [{ required: true, message: '任务执行超时时间不能为空', trigger: 'blur' }],
        level: [{ required: true, validator: validateLevel, trigger: 'blur' }],
        jarPath: [{ required: true, validator: validatePath, trigger: 'blur' }],
        taskClassName: [{ required: true, message: 'jar包中主类不能为空', trigger: 'blur' }]
      },
      currentId: '',
      currentTable: '',
      labelNames: [],
      resourceCheckedKey: [],
      selectedTable: []
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
    this.getPreTeskOptions()
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
        taskType: this.taskType
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
    // 获取所有前置任务
    getPreTeskOptions() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1,
        searchkey: '',
        taskType: this.taskType
      }
      query(requestParams).then(res => {
        this.preTeskOptions = res.data.list
      })
    },
    // 查看详细
    handleDetail(row) {
      this.listLoading = true
      const requestParams = row.jobId
      detail(requestParams).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          this.jobForm.jobName = row.jobName
          this.jobForm.param = row.param
          this.jobForm.timeOut = row.timeOut
          this.jobForm.level = row.level
          this.jobForm.taskType = row.taskType.toString()
          this.jobForm.jarPath = row.jarPath
          this.jobForm.taskClassName = row.taskClassName
          this.jobForm.jarMethodName = row.jarMethodName
          this.jobForm.jarMethodType = row.jarMethodType.toString()
          this.detailVisible = true
          this.preTaskName = []
          const teskStr = res.data.frontTask.split(',')
          for (const item of teskStr) {
            console.log(item)
            for (const itemOption of this.preTeskOptions) {
              if (item === itemOption.jobId.toString()) {
                this.preTaskName.push(itemOption.jobName)
              }
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 添加
    addtask() {
      this.jobForm.jobName = ''
      this.jobForm.param = ''
      this.jobForm.timeOut = ''
      this.jobForm.level = ''
      this.jobForm.taskType = '-1'
      this.jobForm.jarPath = ''
      this.jobForm.taskClassName = ''
      this.jobForm.jarMethodName = ''
      this.jobForm.jarMethodType = '-1'
      this.jobForm.preTask = []
      this.addDialogVisible = true
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
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            jobName: this.jobForm.jobName,
            param: this.jobForm.param,
            timeOut: this.jobForm.timeOut,
            level: this.jobForm.level,
            taskType: this.jobForm.taskType,
            jarPath: this.jobForm.jarPath,
            taskClassName: this.jobForm.taskClassName,
            jarMethodName: this.jobForm.jarMethodName,
            jarMethodType: this.jobForm.jarMethodType,
            frontTask: this.jobForm.preTask.join(',')
          }
          console.log(params)
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
    // 编辑
    handleEdit(row) {
      console.log(row)
      this.currentId = row.jobId
      this.jobForm.jobName = row.jobName
      this.jobForm.param = row.param
      this.jobForm.timeOut = row.timeOut
      this.jobForm.level = row.level
      this.jobForm.taskType = row.taskType.toString()
      this.jobForm.jarPath = row.jarPath
      this.jobForm.taskClassName = row.taskClassName
      this.jobForm.jarMethodName = row.jarMethodName
      this.jobForm.jarMethodType = row.jarMethodType.toString()
      this.editDialogVisible = true
      this.jobForm.preTask = []
      for (const item of row.frontTask.split(',')) {
        this.jobForm.preTask.push(parseInt(item))
      }
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            jobId: this.currentId,
            jobName: this.jobForm.jobName,
            param: this.jobForm.param,
            timeOut: this.jobForm.timeOut,
            level: this.jobForm.level,
            taskType: this.jobForm.taskType,
            jarPath: this.jobForm.jarPath,
            taskClassName: this.jobForm.taskClassName,
            jarMethodName: this.jobForm.jarMethodName,
            jarMethodType: this.jobForm.jarMethodType,
            frontTask: this.jobForm.preTask.join(',')
          }
          console.log(params)
          add(params).then(res => {
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
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.jobId).then(res => {
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
