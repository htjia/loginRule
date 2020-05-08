import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { dataDestList, add, update, remove, addParams, getDirctFiled, removeRelation } from '@/api/commonSet/dataDestination'
import { labelList } from '@/api/metadata/labelManager'
import { paramList } from '@/api/commonSet/collectParam'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.trim().length === 0) {
        callback(new Error('请输入表名称'))
      } else {
        if (value.trim().length > 20) {
          callback(new Error('表名称长度不能大于20'))
        } else if (pattern.test(value)) {
          callback(new Error('表名称不能包含特殊字符'))
        } else {
          callback()
        }
      }
    }
    const validateUrl = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入存储路径'))
      } else {
        if (value.trim().length > 50) {
          callback(new Error('存储路径长度不能大于20'))
        } else {
          callback()
        }
      }
    }
    return {
      routers: [],
      routerValues: [],
      checkAll: false,
      isIndeterminate: true,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      configFieldVisible: false,
      list: [],
      relationList: [],
      metaData: [],
      paramList: [],
      checkedRadio: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      searchkey: '',
      fieldId: '',
      isExpand: false,
      tableForm: {
        tableName: '',
        storageType: '0',
        storageUrl: ''
      },
      rules: {
        tableName: [{ required: true, validator: validateName, trigger: 'blur' }],
        storageType: [{ required: true, message: '请选择存储类型', trigger: 'change' }],
        storageUrl: [{ required: true, validator: validateUrl, trigger: 'blur' }]
      },
      typeOptions: [
        {
          id: '0',
          name: 'hdfs'
        },
        {
          id: '1',
          name: 'http'
        },
        {
          id: '2',
          name: 'mysql'
        }
      ],
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.getMetaDataFun()
    this.getParamList()
  },
  methods: {
    // 获取关联字段
    getDirctFiledFun() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1,
        dataDirectId: this.currentId
      }
      getDirctFiled(requestParams).then(res => {
        this.relationList = res.data.list
      })
    },
    // 获取采集参数
    getParamList() {
      const requestParams = {
        pageSize: 10000,
        pageNum: 1,
        searchkey: ''
      }
      paramList(requestParams).then(res => {
        if (res.code === 0) {
          this.paramList = res.data.list
        }
      })
    },
    // 关联采集参数
    addRelationItem() {
      if (!this.checkedRadio) {
        this.$message({
          type: 'error',
          message: '请选择采集参数!'
        })
      } else {
        const params = {
          dataDirectId: this.currentId,
          fieldId: this.checkedRadio,
          fieldRelTable: 1
        }
        addParams(params).then(res => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getDirctFiledFun()
        })
      }
    },
    // 关联主数据
    addRelationMetaItem() {
      if (this.fieldId) {
        const params = {
          dataDirectId: this.currentId,
          fieldId: this.fieldId,
          fieldRelTable: 0
        }
        addParams(params).then(res => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getDirctFiledFun()
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择子节点添加!'
        })
      }
    },
    handleNodeClick(data) {
      console.log(data)
      if (data.children.length === 0) {
        this.fieldId = data.id
      } else {
        this.fieldId = ''
      }
    },
    handleFieldConfig(row) {
      this.isExpand = false
      this.checkedRadio = ''
      this.fieldId = ''
      this.currentId = row.id
      this.getDirctFiledFun()
      this.configFieldVisible = true
    },
    getMetaDataFun() {
      labelList({}).then(res => {
        if (res.code === 0) {
          this.metaData = res.data
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
      this.pageNum = pageNum
      this.fetchData()
    },
    handleSearch(data) {
      this.pageNum = 1
      this.searchkey = data
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        searchkey: this.searchkey
      }
      dataDestList(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.tableForm.tableName = ''
      this.tableForm.storageType = ''
      this.tableForm.storageUrl = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    configClose() {
      console.log(123)
      this.isExpand = true
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            storagePath: this.tableForm.storageUrl,
            storageType: this.tableForm.storageType,
            tableName: this.tableForm.tableName
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
            storagePath: this.tableForm.storageUrl,
            storageType: this.tableForm.storageType,
            tableName: this.tableForm.tableName,
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
      this.tableForm.tableName = row.tableName
      this.tableForm.storageType = row.storageType
      this.tableForm.storageUrl = row.storagePath
      this.editDialogVisible = true
    },
    handleDeleteRelation(row) {
      this.$confirm('此操作将永久删除该关联字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        removeRelation(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDirctFiledFun()
          }
        })
      }).catch(() => {
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该表及其配置, 是否继续?', '提示', {
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
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    }
  }
}
