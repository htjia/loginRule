import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import TreeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import { findTree, add, remove, update } from '@/api/background/menuManager'
import { getList } from '@/api/background/function'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, TreeTable },
  data() {
    const validateMenuName = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入菜单名称'))
      } else {
        if (value.length > 10) {
          callback(new Error('名称长度不能大于10位'))
        } else {
          callback()
        }
      }
    }
    const validateMenuRouter = (rule, value, callback) => {
      const english = new RegExp('[a-zA-Z]')
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',[\\].<>?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.length === 0) {
        callback(new Error('请输入菜单路由'))
      } else {
        if (!english.test(value)) {
          callback(new Error('菜单路由必须为英文'))
        } else if (pattern.test(value)) {
          callback(new Error('菜单路由不能包含特殊字符'))
        } else {
          callback()
        }
      }
    }
    const validateRouterUrl = (rule, value, callback) => {
      const english = new RegExp('[a-zA-Z]')
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',[\\].<>?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.length === 0) {
        callback(new Error('请输入路由路径'))
      } else {
        if (!english.test(value)) {
          callback(new Error('路由路径必须为英文'))
        } else if (pattern.test(value)) {
          callback(new Error('路由路径不能包含特殊字符'))
        } else {
          callback()
        }
      }
    }
    const validateMenuIcon = (rule, value, callback) => {
      const english = new RegExp('[a-zA-Z]')
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',[\\].<>?~！@#￥……&*（）|{}【】‘；：”“'。，、？]")
      if (value.length === 0) {
        callback(new Error('请输入菜单图标'))
      } else {
        if (!english.test(value)) {
          callback(new Error('菜单图标必须为英文'))
        } else if (pattern.test(value)) {
          callback(new Error('菜单图标不能包含特殊字符'))
        } else {
          callback()
        }
      }
    }
    const validateSortNum = (rule, value, callback) => {
      console.log(value)
      if (value === null) {
        callback(new Error('请输入排序序号'))
      } else {
        if (value < 0) {
          callback(new Error('排序序号必须 ≥ 0'))
        } else {
          callback()
        }
      }
    }
    return {
      func: treeToArray,
      expandAll: true,
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
      menuForm: {
        menuName: '',
        menuRouter: '',
        routerUrl: '',
        menuIcon: '',
        menuFun: [],
        sortNum: ''
      },
      rules: {
        menuName: [{ required: true, validator: validateMenuName, trigger: 'blur' }],
        menuRouter: [{ required: true, validator: validateMenuRouter, trigger: 'blur' }],
        routerUrl: [{ required: true, validator: validateRouterUrl, trigger: 'blur' }],
        menuIcon: [{ required: true, validator: validateMenuIcon, trigger: 'blur' }],
        menuFun: [{ required: true, message: '请选择功能菜单', trigger: 'blur' }],
        sortNum: [{ required: true, validator: validateSortNum, trigger: 'blur' }]
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
    this.getFunctionList()
  },
  methods: {
    message(row) {
      console.log(row)
    },
    fetchData(params) {
      this.isLoadtree = true
      findTree().then(res => {
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
    // 添加根目录
    handleAdd() {
      this.menuForm.menuName = ''
      this.menuForm.menuRouter = ''
      this.menuForm.routerUrl = ''
      this.menuForm.menuIcon = ''
      this.menuForm.rule = ''
      this.menuForm.sortNum = ''
      this.menuForm.menuFun = []
      this.currentNode = ''
      this.dialogVisible = true
    },
    // 添加按钮
    append(data) {
      this.menuForm.menuName = ''
      this.menuForm.menuRouter = ''
      this.menuForm.routerUrl = ''
      this.menuForm.menuIcon = ''
      this.menuForm.rule = ''
      this.menuForm.sortNum = ''
      this.menuForm.menuFun = []
      this.dialogVisible = true
      this.currentNode = data
    },
    // 添加fun
    addNode(id) {
      const params = {
        parentId: id,
        name: this.menuForm.menuName,
        router: this.menuForm.menuRouter,
        viewOrder: this.menuForm.sortNum,
        funIds: this.menuForm.menuFun.join(',')
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
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(data.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
      })
    },
    // 修改按钮
    edit(row) {
      this.parentid = row.parentId
      this.currentNode = row
      this.menuForm.menuName = row.name
      this.menuForm.menuRouter = row.router
      this.menuForm.sortNum = row.viewOrder
      if (row.funIds) {
        this.menuForm.menuFun = row.funIds.split(',').map((item) => {
          return parseInt(item)
        })
      } else {
        this.menuForm.menuFun = []
      }
      console.log(this.menuForm.menuFun)
      this.editDialogVisible = true
    },
    // 获取所有功能按钮
    getFunctionList(data) {
      const params = {
        pageSize: 1000,
        pageNum: 1
      }
      getList(params).then(res => {
        this.typeOptions = res.data.list
      })
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
          const params = {
            id: this.currentNode.id,
            parentId: this.currentNode.parentId,
            name: this.menuForm.menuName,
            router: this.menuForm.menuRouter,
            viewOrder: this.menuForm.sortNum,
            funIds: this.menuForm.menuFun.join(',')
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
