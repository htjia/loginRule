import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import TreeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import { labelList, add, remove, update, initmetatable } from '@/api/metadata/labelManager'
import { queryType } from '@/api/metadata/filedManager'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, TreeTable },
  data() {
    const validateNodeName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入名称'))
      } else {
        if (value.length < 1) {
          callback(new Error('不能小于1位'))
        } else {
          callback()
        }
      }
    }
    return {
      func: treeToArray,
      expandAll: false,
      dialogVisible: false,
      editDialogVisible: false,
      isLoading: false,
      isLoadtree: false,
      detailDialogVisible: false,
      filterText: '',
      searchkey: '',
      currentNode: '',
      typeOptions: [],
      list: {},
      args: [null, null, 'timeLine'],
      nodeForm: {
        nodeName: '',
        enname: '',
        typeName: '',
        fieldLength: ''
      },
      rules: {
        nodeName: [{ required: true, validator: validateNodeName, trigger: 'blur' }],
        enname: [{ required: true, message: '英文名不能为空', trigger: 'blur' }],
        typeName: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        fieldLength: [{ required: true, message: '长度不能为空', trigger: 'blur' }]
      },
      parentid: ''
    }
  },
  watch: {
    // filterText(val) {
    //   this.$refs.deptTree.filter(val)
    // }
  },
  created() {
  },
  mounted() {
    this.initLoading = true
    this.fetchData()
    this.getTypeList()
  },
  methods: {
    message(row) {
      console.log(row)
    },
    fetchData(params) {
      const requestParams = params || {
      }
      this.isLoadtree = true
      labelList(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data
        }
        this.isLoadtree = false
      })
    },
    handleSearch(data) {
      const params = {
        labelName: this.searchkey
      }
      this.fetchData(params)
    },
    // 搜索
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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
    // 初始化
    initRuleTable() {
      this.isLoading = true
      initmetatable(false).then(res => {
        this.isLoading = false
        console.log(res.code)
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '初始化成功!'
          })
        } else if (res.code === 5009) {
          this.$confirm('规则表已经存在, 是否覆盖?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isLoading = true
            initmetatable(true).then(res => {
              this.isLoading = false
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '初始化成功!'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: res.message
                })
              }
            })
          }).catch(() => {
          })
        } else {
          this.$message({
            type: 'success',
            message: res.message
          })
        }
      })
    },
    // 添加根目录
    handleAdd() {
      this.nodeForm.nodeName = ''
      this.nodeForm.enname = ''
      this.nodeForm.typeName = ''
      this.nodeForm.fieldLength = ''
      this.nodeForm.rule = []
      this.dialogVisible = true
    },
    // 添加按钮
    append(data) {
      this.nodeForm.nodeName = ''
      this.nodeForm.enname = ''
      this.nodeForm.typeName = ''
      this.nodeForm.fieldLength = ''
      this.nodeForm.rule = []
      this.dialogVisible = true
      this.currentNode = data
    },
    // 添加fun
    addNode(id) {
      const params = {
        parentid: id,
        label: this.nodeForm.nodeName,
        enname: this.nodeForm.enname,
        fieldtype: this.nodeForm.typeName,
        fieldlength: this.nodeForm.fieldLength
      }
      add(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.fetchData()
        }
      })
    },
    // 删除
    remove(data) {
      console.log(data.id)
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(data.id).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      }).catch(() => {
      })
    },
    // 修改按钮
    edit(row) {
      this.parentid = row.parentid
      this.currentNode = row
      this.editDialogVisible = true
      this.nodeForm.nodeName = row.label
      this.nodeForm.enname = row.enname
      this.nodeForm.typeName = row.fieldtype
      this.nodeForm.fieldLength = row.fieldlength
      this.nodeForm.rule = []
    },
    // 编辑 fun
    editNode(data, name, parentid) {
      const params = {
        id: data.id,
        parentid: parentid,
        label: name,
        enname: this.nodeForm.enname,
        fieldtype: this.nodeForm.typeName,
        fieldlength: this.nodeForm.fieldLength
      }
      update(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })

          this.fetchData()
        }
      })
    },
    // 查看详情
    viewDetail(data) {
      this.$router.push({ path: '/departmentDetail/index', query: { id: data.id }})
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.currentNode) {
            this.addNode(this.currentNode.id)
          } else {
            this.addNode('0')
          }
          this.dialogVisible = false
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
          this.editNode(this.currentNode, this.nodeForm.nodeName, this.parentid)
          this.editDialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.dialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
