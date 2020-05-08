import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryTables, add, update, remove } from '@/api/metadata/tableManager'
import { queryhdfs } from '@/api/metadata/hdfsManager'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入表名称'))
      } else {
        if (value.length < 1) {
          callback(new Error('不能小于1位'))
        } else {
          callback()
        }
      }
    }
    return {
      routers: [],
      routerValues: [],
      checkAll: false,
      checkedRouters: ['department', 'departmentDetail'],
      isIndeterminate: true,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      permissionVisible: false,
      list: [],
      hdfsOptions: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      name: '',
      tabelForm: {
        tabelname: '',
        content: '',
        hdfs: ''
      },
      rules: {
        tabelname: [{ required: true, validator: validateName, trigger: 'blur' }],
        content: [{ required: false, trigger: 'blur' }],
        hdfs: [{ required: true, message: '请选择集群', trigger: 'change' }]
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
  mounted() {
    this.gethdfsList()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedRouters = val ? this.routerValues : []
      this.isIndeterminate = false
    },
    handleCheckedRoutersChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.routers.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.routers.length
    },
    // 得到集群列表
    gethdfsList() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1
      }
      queryhdfs(requestParams).then(res => {
        if (res.code === 0) {
          this.hdfsOptions = res.data
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
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
        pageNum: this.pageNum,
        tableName: data
      }
      this.fetchData(params)
    },
    // 查询
    fetchData(params) {
      this.listLoading = true
      const requestParams = params || {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        searchkey: this.searchkey
      }
      queryTables(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.tabelForm.tabelname = ''
      this.tabelForm.content = ''
      this.tabelForm.hdfs = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(done) {
      done()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.tabelForm.hdfs)
          const params = {
            name: this.tabelForm.tabelname,
            content: this.tabelForm.content,
            hdfsId: this.tabelForm.hdfs
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
            name: this.tabelForm.tabelname,
            content: this.tabelForm.content,
            id: this.currentId,
            hdfsId: this.tabelForm.hdfs
          }
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
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
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      console.log(row)
      this.currentId = row.id
      this.tabelForm.tabelname = row.name
      this.tabelForm.content = row.content
      this.editDialogVisible = true
      // this.tabelForm.hdfs = row.hdfsId
      this.tabelForm.hdfs = 1
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        remove(params).then(res => {
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
    // 編輯字段
    filedEdit(row) {
      this.$router.push({ path: '/metadataManager/filedManager', query: { id: row.id }})
    }
  }
}
