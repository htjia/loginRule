import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { tokenList, add, remove, update } from '@/api/apiToken'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      list: [],
      pageSize: 15,
      pageNum: 1,
      searchkey: '',
      totalPage: 0,
      tokenForm: {
        tokenId: '',
        name: '',
        password: ''
      },
      rules: {
        tokenId: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
        name: [{ required: true, message: 'name不能为空', trigger: 'blur' }],
        password: [{ required: true, message: 'password不能为空', trigger: 'blur' }]
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
        pageNum: this.pageNum,
        searchkey: data
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
      tokenList(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.tokenForm.tokenId = ''
      this.tokenForm.name = ''
      this.tokenForm.password = ''
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
          const params = {
            clientID: this.tokenForm.tokenId,
            clientSecret: this.tokenForm.name,
            clientPassword: this.tokenForm.password
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
            clientID: this.tokenForm.tokenId,
            clientSecret: this.tokenForm.name,
            clientPassword: this.tokenForm.password,
            id: this.currentId
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
      this.currentId = row.id
      this.tokenForm.tokenId = row.clientID
      this.tokenForm.name = row.clientSecret
      this.tokenForm.password = row.clientPassword
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该岗位, 是否继续?', '提示', {
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
    }
  }
}
