import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { roles, add, remove, menus, addRights } from '@/api/roles'
import { findTree } from '@/api/background/menuManager'
import TreeTable from '@/components/TreeTable'
import treeToArray from './customEval'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, TreeTable },
  data() {
    const validateName = (rule, value, callback) => {
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      if (value.trim().length === 0) {
        callback(new Error('请输入角色名称'))
      } else {
        if (value.length > 20) {
          callback(new Error('角色名称不能大于 20 位'))
        } else if (!chinese.test(value)) {
          callback(new Error('角色名称必须为中文'))
        } else {
          callback()
        }
      }
    }
    return {
      func: treeToArray,
      expandAll: true,
      routerValues: [],
      args: [],
      checkAll: false,
      isIndeterminate: true,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      isLoadtree: false,
      checkedRouters: [],
      list: [],
      menus: [],
      roleBtn: [],
      selectedMenu: [],
      searchkey: '',
      random: 0,
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      name: '',
      roleForm: {
        roleName: '',
        checkedRouters: []
      },
      rules: {
        roleName: [{ required: true, validator: validateName, trigger: 'blur' }],
        checkedRouters: [{ type: 'array', required: true, message: '请选择用户权限', trigger: 'blur' }]
      },
      routers: [{ name: '添加', value: 1 }],
      selectedArr: [],
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
    // this.getRouterList()
  },
  methods: {
    findTreeFun(roleId) {
      const requestParams = { roleId }
      this.isLoadtree = true
      findTree(requestParams).then(res => {
        if (res.code === 0) {
          this.menus = res.data
        }
        this.isLoadtree = false
      })
    },
    handleCheckAllChange(val) {
      this.roleForm.checkedRouters = val ? this.routerValues : []
      this.isIndeterminate = false
      console.log(this.roleForm.checkedRouters)
    },
    handleCheckedRoutersChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.routers.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.routers.length
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
        pageNum: 1,
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
      roles(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.roleForm.roleName = ''
      this.roleForm.checkedRouters = []
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.roleForm.roleName.trim()
            // cnname: this.roleForm.roleName.trim(),
            // roleMenuList: this.roleForm.checkedRouters
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
            name: this.roleForm.roleName.trim(),
            id: this.currentId
          }
          add(params).then(res => {
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
      this.roleDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      if (this.routers.length !== row.roleMenuList.length) {
        this.checkAll = false
      } else {
        this.checkAll = true
      }
      this.currentId = row.id
      this.roleForm.roleName = row.name
      this.roleForm.checkedRouters = row.roleMenuList
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
    // 获取菜单
    getRouterList() {
      menus({}).then(res => {
        if (res.code === 0) {
          const RouterMap = []
          for (const item of res.data) {
            RouterMap.push({
              name: item.menuName,
              value: item.id
            })
            this.routerValues.push(item.id)
          }
          this.routers = RouterMap
        }
      })
    },
    // 权限配置
    handleRole(row) {
      this.currentId = row.id
      this.findTreeFun(this.currentId)
      this.roleDialogVisible = true
      this.random = Math.random()
    },
    selectionChange(data) {
      console.log('子组件数据')
      this.selectedMenu = data
    },
    handleRoleBtnChange(data) {
      console.log(data)
    },
    submitRoleForm() {
      console.log(this.selectedMenu)
      const list = []
      for (const item of this.selectedMenu) {
        list.push({
          menuId: item.id,
          functionId: item.checkedFunctions.map((item) => {
            return item.split('-')[1]
          })
        })
      }
      const params = {
        roleId: this.currentId,
        list: list
      }
      console.log(params)
      addRights(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '配置成功!'
          })
          this.roleDialogVisible = false
          this.findTreeFun()
        }
      })
    }
  }
}
