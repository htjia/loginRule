
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findModel, deleteModel, releaseModel, createModule, pcmQuery, editModel } from '@/api/workflowSetting'
import { getUserId, getToken } from '@/utils/auth'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('流程名称不能为空'))
      } else {
        callback()
      }
    }
    const validateCategory = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('流程分类不能为空'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      showDialogVisible: false,
      configDialogVisible: false,
      iframeUrl: '',
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
      flowForm: {
        name: '',
        code: '',
        category: '1',
        description: ''
      },
      mamangeList: [],
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        category: [{ required: true, validator: validateCategory, message: '请选择流程分类', trigger: 'blur' }]
      },
      currentId: '',
      isDisable: false,
      updateCode: '',
      categoryUp: ''
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
        pageNum: 1,
        name: data
      }
      this.pageNum = 1
      this.fetchData(params)
    },
    // 查询
    fetchList() {
      const requestParams = {
        pageSize: 1000000,
        pageNum: 1,
        name: ''
      }
      pcmQuery(requestParams).then(res => {
        if (res.code === 0) {
          this.mamangeList = res.data.list
        }
      })
    },
    // 查询
    fetchData(params) {
      this.listLoading = true
      const requestParams = params || {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        searchkey: this.searchkey
      }
      findModel(requestParams).then(res => {
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
    // 添加
    handleAdd() {
      this.fetchList()
      this.flowForm.name = ''
      this.flowForm.category = ''
      this.flowForm.description = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 关闭1
    handleClose1() {
      this.$confirm('关闭后若有未保存的设计将丢失，确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showDialogVisible = false
      }).catch(() => {
        this.showDialogVisible = true
      })
    },
    // 添加提交
    submitForm(formName) {
      this.isDisable = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            // id: this.currentId,
            name: this.flowForm.name.trim(),
            category: this.flowForm.category,
            description: this.flowForm.description.trim()
          }
          console.log(params)
          createModule(params).then(res => {
            this.isDisable = false
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
          }, res => {
            this.isDisable = false
          })
        } else {
          this.isDisable = false
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.flowForm.category === this.updateCode) {
            for (const item of this.mamangeList) {
              if (item.name === this.flowForm.category) {
                this.categoryUp = item.id
                break
              }
            }
          } else {
            this.categoryUp = this.flowForm.category
          }
          const params = {
            id: this.currentId,
            name: this.flowForm.name.trim(),
            category: this.categoryUp,
            description: this.flowForm.description.trim()
          }
          console.log(params)
          editModel(params).then(res => {
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
      this.fetchList()
      this.flowForm.category = row.category
      this.updateCode = row.category
      this.currentId = row.id
      this.flowForm.name = row.name
      this.flowForm.description = row.description
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该流程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          modelId: row.id
        }
        deleteModel(params).then(res => {
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
    // 设计
    showModeler(row) {
      this.iframeUrl = 'http://192.168.2.42:8186/modeler.html?modelId=1'
      this.iframeUrl = this.iframeUrl.substring(0, this.iframeUrl.length - 1) + row.id + '&name=' + row.name + '&key=' + row.key + '&role=' + getToken() +
      '&userId=' + getUserId() + '&random=' + Math.random()
      this.showDialogVisible = true
    },
    // 发布
    handlePush(row) {
      this.$confirm('确认发布流程？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        releaseModel({ modelId: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '发布成功!'
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

