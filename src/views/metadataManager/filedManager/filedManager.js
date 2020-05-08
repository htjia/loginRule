import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { query, add, update, queryType, labelRelations, fieldRelations } from '@/api/metadata/filedManager'
import { labelList } from '@/api/metadata/labelManager'
import { queryTables } from '@/api/metadata/tableManager'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入字段名称'))
      } else {
        if (value.length < 1) {
          callback(new Error('不能小于1位'))
        } else {
          callback()
        }
      }
    }
    const validateLabel = (rule, value, callback) => {
      console.log(value)
      if (value.length === 0) {
        callback(new Error('请选择标签'))
      } else {
        callback()
      }
    }
    return {
      routers: [],
      routerValues: [],
      checkAll: false,
      checkedRouters: ['department', 'departmentDetail'],
      isIndeterminate: true,
      configDialogVisible: false,
      filedRelationVisible: false,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      permissionVisible: false,
      treeData: [],
      typeOptions: [],
      list: [],
      tableList: [],
      searchkey: '',
      filterText: '',
      name: '',
      filedForm: {
        fieldName: '',
        cnname: '',
        typeName: '',
        fieldLength: ''
      },
      configForm: [],
      configLabelForm: {
        labelName: ''
      },
      configRules: {},
      configLabelRules: {
        labelName: [{ required: true, validator: validateLabel, trigger: 'blur' }]
      },
      rules: {
        fieldName: [{ required: true, validator: validateName, trigger: 'blur' }],
        cnname: [{ required: true, message: '中文名不能为空', trigger: 'blur' }],
        typeName: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        fieldLength: [{ required: true, message: '长度不能为空', trigger: 'blur' }]
      },
      currentId: '',
      currentTable: '',
      labelNames: [],
      resourceCheckedKey: [],
      selectedTable: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.labelTree.filter(val)
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.getTypeList()
    this.getLabelList()
    this.getTableList()
  },
  methods: {
    getTableList() {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        tableName: this.searchkey
      }
      console.log(params)
      queryTables(params).then(res => {
        if (res.code === 0) {
          this.tableList = res.data.list
        }
      })
    },
    rowClick(row, event, column) {
      console.log(row)
      this.currentTable = row.name
      const params = {
        tableId: row.id
      }
      query(params).then(res => {
        if (res.code === 0) {
          this.labelNames = res.data
        }
      })
    },
    labelItemClick(item) {
      if (!this.selectedTable.find(value => value.filedId === item.id)) {
        this.selectedTable.push(
          {
            tableName: this.currentTable,
            filedName: item.cnname,
            filedId: item.id
          }
        )
      }
    },
    handleCheckAllChange(val) {
      this.checkedRouters = val ? this.routerValues : []
      this.isIndeterminate = false
    },
    handleCheckedRoutersChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.routers.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.routers.length
    },
    handleSearch(data) {
      this.getTableList()
    },
    getTypeList() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1
      }
      queryType(requestParams).then(res => {
        if (res.code === 0) {
          this.typeOptions = res.data.list
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        tableId: this.$route.query.id
      }
      query(params).then(res => {
        if (res.code === 0) {
          this.list = res.data
          for (const item of this.list) {
            if (item.relation) {
              item.relations = item.relation.split(',')
            }
          }
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.filedForm.fieldName = ''
      this.filedForm.cnname = ''
      this.filedForm.typeName = ''
      this.filedForm.fieldLength = ''
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
            fieldName: this.filedForm.fieldName,
            tableId: this.$route.query.id,
            cnname: this.filedForm.cnname,
            fieldTypeId: this.filedForm.typeName,
            fieldLength: this.filedForm.fieldLength
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
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            fieldName: this.filedForm.fieldName,
            tableId: this.$route.query.id,
            cnname: this.filedForm.cnname,
            fieldTypeId: this.filedForm.typeName,
            fieldLength: this.filedForm.fieldLength
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
      this.configDialogVisible = false
      this.$refs[formName].resetFields()
    },
    cancel() {
      this.filedRelationVisible = false
      this.labelNames = []
    },
    // 编辑
    handleEdit(row) {
      console.log(row)
      this.currentId = row.id
      this.filedForm.fieldName = row.fieldName
      this.filedForm.cnname = row.cnname
      this.filedForm.fieldLength = row.fieldLength
      this.filedForm.typeName = row.typeId
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(index) {
      this.selectedTable.splice(index, 1)
    },
    // 编辑标签
    labelEdit(row) {
      this.currentId = row.id
      this.filedForm.fieldName = row.cnname
      this.configDialogVisible = true
      const labelIdList = row.labelIdList.split(',')
      console.log(labelIdList)
      this.resourceCheckedKey = labelIdList
      // this.$refs.labelTree.setChecked(labelIdList, true)
    },
    // 配置标签提交
    submitConfigLabelForm(formName) {
      this.configLabelForm.labelName = this.$refs.labelTree.getCheckedKeys()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const list = []
          for (const item of this.$refs.labelTree.getCheckedKeys()) {
            list.push({
              id: item
            })
          }
          const params = {
            fieldId: this.currentId,
            metaSourcesLi: list
          }
          console.log(params)
          labelRelations(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '配置成功!'
              })
              this.configDialogVisible = false
              this.fetchData()
            }
          })
        }
      })
    },
    // 获取labelList
    getLabelList() {
      labelList({}).then(res => {
        if (res.code === 0) {
          this.treeData = res.data
        }
      })
    },
    // 字段关系编辑
    filedRelationEdit(row) {
      this.currentId = row.id
      this.filedForm.fieldName = row.cnname
      this.filedRelationVisible = true
      this.selectedTable = row.relationList
    },
    // 配置表
    submitConfigTableForm() {
      if (this.selectedTable.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择关联字段!'
        })
      } else {
        const list = []
        for (const item of this.selectedTable) {
          list.push({
            id: item.filedId
          })
        }
        const params = {
          masterFieldId: this.currentId,
          fieldLi: list
        }
        console.log(params)
        fieldRelations(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '配置成功!'
            })
            this.filedRelationVisible = false
            this.labelNames = []
            this.fetchData()
          }
        })
      }
    }
  }
}
