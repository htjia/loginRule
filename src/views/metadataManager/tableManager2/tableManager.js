import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryTables, queryFieldList } from '@/api/metadata/tableManager'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      tables: [],
      fieldList: [{}, {}, {}, {}, {}],
      searchkey: '',
      detailVisible: false,
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      tableName: '',
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    const params = {
      tableName: this.searchkey
    }
    this.fetchData(params)
  },
  mounted() {
  },
  methods: {
    handleSearch(data) {
      const params = {
        tableName: data
      }
      this.fetchData(params)
    },
    // 查询
    fetchData(params) {
      this.listLoading = true
      const requestParams = params || {
        tableName: this.searchkey
      }
      queryTables(requestParams).then(res => {
        if (res.code === 0) {
          this.tables = res.data
          this.listLoading = false
        }
      })
    },
    // 查看详情
    viewDetail(item) {
      this.tableName = item.cname
      const params = {
        id: item.id
      }
      queryFieldList(params).then(res => {
        if (res.code === 0) {
          this.fieldList = res.data
          this.detailVisible = true
        }
      })
    },
    // 关闭
    handleClose(done) {
      done()
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
