import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { query, add, remove, update } from '@/api/timetask/sqlDef'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateTableName = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.trim().length === 0) {
        callback(new Error('请输入表名'))
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
    // const validateename = (rule, value, callback) => {
    //   const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    //   if (value.trim().length === 0) {
    //     callback(new Error('请输入业务英文名称'))
    //   } else {
    //     if (pattern.test(value)) {
    //       callback(new Error('英文名称不能包含特殊字符'))
    //       if (value.length > 60) {
    //         callback(new Error('英文名称长度不能大于 60 位'))
    //       } else {
    //         callback()
    //       }
    //     }
    //   }
    // }
    // const validatedesc = (rule, value, callback) => {
    //   const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    //   if (value.trim().length === 0) {
    //     callback(new Error('请输入业务描述'))
    //   } else {
    //     if (pattern.test(value)) {
    //       callback(new Error('业务描述中不能包含特殊字符'))
    //     } else if (value.length > 300) {
    //       callback(new Error('业务描述长度不能大于 300 位'))
    //     } else {
    //       callback()
    //     }
    //   }
    // }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      preProDataVisible: false,
      detailVisible: false,
      businessId: 1,
      list: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      taskType: '-1',
      sqlForm: {
        tablename: '',
        sqlParam: '',
        sql: ''
      },
      rules: {
        tablename: [{ required: true, validator: validateTableName, trigger: 'blur' }],
        sql: [{ required: true, message: '请输入SQL', trigger: 'blur' }]
      },
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    this.businessId = this.$route.query.id
    this.fetchData()
  },
  methods: {
    fetchData() {
      const params = {
        businessId: this.businessId
      }
      this.listLoading = true
      query(params).then(res => {
        if (res.code === 0) {
          this.list = res.data
          this.listLoading = false
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 添加
    addSQL() {
      this.sqlForm.tablename = ''
      this.sqlForm.sql = ''
      this.sqlForm.tableparam = ''
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
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            businessId: this.businessId,
            sqlTable: this.sqlForm.tablename,
            sqlParam: this.sqlForm.sqlParam,
            sqlInfo: this.sqlForm.sql
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
      this.sqlForm.tablename = row.sqlTable
      this.sqlForm.sql = row.sqlInfo
      this.sqlForm.sqlParam = row.sqlParam
      this.editDialogVisible = true
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            businessId: this.businessId,
            sqlTable: this.sqlForm.tablename,
            sqlParam: this.sqlForm.sqlParam,
            sqlInfo: this.sqlForm.sql
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
      this.$confirm('此操作将永久删除该SQL, 是否继续?', '提示', {
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
    // 预清洗界面
    handleEditPre(row) {
      this.preProDataVisible = true
    }
  }
}
