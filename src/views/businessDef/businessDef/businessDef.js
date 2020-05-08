import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { query, add, remove, update } from '@/api/timetask/businessDef'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validatename = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.trim().length === 0) {
        callback(new Error('请输入业务中文名称'))
      } else {
        if (pattern.test(value)) {
          callback(new Error('名称中不能包含特殊字符'))
        } else if (value.length > 50) {
          callback(new Error('名称长度不能大于 50 位'))
        } else {
          callback()
        }
      }
    }
    const validateename = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinacheck = new RegExp('^[0-9a-zA-Z_]*$', '')
      if (value.trim().length === 0) {
        callback(new Error('请输入业务英文名称'))
      } else if (!chinacheck.test(value)) {
        callback(new Error('英文名称不能输入汉字'))
      } else if (pattern.test(value)) {
        callback(new Error('英文名称不能包含特殊字符'))
      } else if (value.length > 60) {
        callback(new Error('英文名称长度不能大于 60 位'))
      } else {
        callback()
      }
    }
    const validatedesc = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入业务描述'))
      } else if (value.length > 255) {
        callback(new Error('业务描述长度不能大于 255 位'))
      } else {
        callback()
      }
    }
    const apiResultcheck = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('对外展示字段不能为空'))
      } else {
        callback()
      }
    }
    const apiHelpcheck = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('接口中文帮助不能为空'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      preProDataVisible: false,
      detailVisible: false,
      list: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      taskType: '-1',
      busiForm: {
        name: '',
        enname: '',
        description: '',
        fieldSetInfo: '',
        apiResult: '',
        apiHelp: '',
        createTime: ''
      },
      rules: {
        name: [{ required: true, validator: validatename, trigger: 'blur' }],
        enname: [{ required: true, validator: validateename, trigger: 'blur' }],
        description: [{ required: true, validator: validatedesc, trigger: 'blur' }],
        apiResult: [{ required: true, validator: apiResultcheck, trigger: 'blur' }],
        apiHelp: [{ required: true, validator: apiHelpcheck, trigger: 'blur' }]
      },
      interfaceForm: {
        name: '',
        type: '',
        inputParam: '',
        businessId: '',
        outParam: ''
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
      name: ''
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
        name: this.searchkey
      }
      this.fetchData(params)
    },
    fetchData(params) {
      this.listLoading = true
      const requestParams = params || {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.searchkey
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
    // 添加
    addtask() {
      this.busiForm.name = ''
      this.busiForm.enname = ''
      this.busiForm.description = ''
      this.busiForm.fieldSetInfo = ''
      this.busiForm.apiResult = ''
      this.busiForm.apiHelp = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      if (typeof (formName) !== 'undefined') {
        this.$refs[formName].resetFields()
      }
    },
    // 取消
    resetForm(formName) {
      console.log(formName)
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.preProDataVisible = false
      if (typeof (formName) !== 'undefined') {
        this.$refs[formName].resetFields()
      }
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.busiForm.name,
            enname: this.busiForm.enname,
            description: this.busiForm.description,
            fieldSetInfo: this.busiForm.fieldSetInfo,
            apiResult: this.busiForm.apiResult,
            apiHelp: this.busiForm.apiHelp
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
      this.currentId = row.id
      this.busiForm.name = row.name
      this.busiForm.enname = row.enname
      this.busiForm.description = row.description
      this.busiForm.fieldSetInfo = row.fieldSetInfo
      this.busiForm.apiResult = row.apiResult
      this.busiForm.apiHelp = row.apiHelp
      this.editDialogVisible = true
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            name: this.busiForm.name,
            enname: this.busiForm.enname,
            description: this.busiForm.description,
            fieldSetInfo: this.busiForm.fieldSetInfo,
            apiResult: this.busiForm.apiResult,
            apiHelp: this.busiForm.apiHelp
          }
          console.log(params)
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
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该业务, 是否继续?', '提示', {
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
    // 对外接口
    handleInterface(row) {
      this.interfaceForm.name = '/engineeBusiness/externalApi'
      this.interfaceForm.type = 'GET'
      this.interfaceForm.inputParam = 'businessId      业务ID \npageNum      第几页 \n pageSize    每页多少条 '
      this.interfaceForm.businessId = row.id
      this.interfaceForm.outParam = row.apiHelp
      this.preProDataVisible = true
    },
    // SQL设置
    sqlSet(row) {
      this.$router.push({ path: '/businessDef/sqlDef', query: { id: row.id }})
    }
  }
}
