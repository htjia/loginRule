
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { flowFormList, flowFormRemoveForm, flowFormSaveForm } from '@/api/workflowSetting'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('表单名称不能为空'))
      } else {
        callback()
      }
    }
    const validateContent = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('表单内容不能为空'))
      } else {
        callback()
      }
    }
    const validateRemark = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('备注不能为空'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      viewDialogVisible: false,
      configDialogVisible: false,
      list: [],
      postOptions: [],
      roleOptions: [],
      deptList: [],
      username: '',
      viewHtml: '',
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
      formInfo: {
        name: '',
        remark: '',
        content: ''
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        content: [{ required: true, validator: validateContent, trigger: 'blur' }],
        remark: [{ required: true, validator: validateRemark, trigger: 'blur' }]
      },
      currentId: '',
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
        name: data
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
      flowFormList(requestParams).then(res => {
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
    handleView(row) {
      this.viewHtml = row.content
      this.viewDialogVisible = true
    },
    thisClose() {
      this.viewDialogVisible = false
    },
    // 添加
    handleAdd() {
      this.formInfo.name = ''
      this.formInfo.content = ''
      this.formInfo.remark = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.isDisable = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.formInfo.name.trim(),
            content: this.formInfo.content.trim(),
            remark: this.formInfo.remark.trim()
          }
          console.log(params)
          flowFormSaveForm(params).then(res => {
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
          const params = {
            id: this.currentId,
            name: this.formInfo.name.trim(),
            content: this.formInfo.content.trim(),
            remark: this.formInfo.remark.trim()
          }
          flowFormSaveForm(params).then(res => {
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
      this.formInfo.name = row.name
      this.formInfo.content = row.content
      this.formInfo.remark = row.remark
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将删除该表单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        flowFormRemoveForm({ id: row.id }).then(res => {
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

