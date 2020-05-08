import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryEquipment, queryProduct, queryMould, integratedQuery, saveThreshold, findDetail } from '@/api/report/olap'
import Chart from '@/components/Charts'
import { Message } from 'element-ui'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  directives: {
    'el-select-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
          * scrollHeight 获取元素内容高度(只读)
          * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
          * clientHeight 读取元素的可见高度(只读)
          * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
          * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
          */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  data() {
    const validateOee = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入阈值'))
      } else {
        if (value < 0) {
          callback(new Error('阈值不能小于0'))
        } else {
          callback()
        }
      }
    }
    return {
      pickerOptionsStart: {
        // disabledDate: (time) => {
        //   const endDateVal = this.productModelForm.endDate
        //   if (endDateVal) {
        //     return time.getTime() > endDateVal
        //   } else {
        //     return time.getTime() > Date.now()
        //   }
        // },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      pickerOptionsEnd: {
        // disabledDate: (time) => {
        //   const beginDateVal = this.productModelForm.beginDate
        //   if (beginDateVal) {
        //     return time.getTime() < beginDateVal || time.getTime() > Date.now()
        //   } else {
        //     return time.getTime() > Date.now()
        //   }
        // },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      factoryType: '3',
      factoryOptions: [
        {
          id: '3',
          name: '3#'
        }
      ],
      isStart: sessionStorage.getItem('olapRefresh'),
      addOeeVisible: false,
      oeeDetailVisible: false,
      isLoading: false,
      newOeeVal: '',
      productModelForm: {
        beginDate: sessionStorage.getItem('olapStartTime') === null ? '' : parseInt(sessionStorage.getItem('olapStartTime')),
        endDate: sessionStorage.getItem('olapEndTime') === null ? '' : parseInt(sessionStorage.getItem('olapEndTime')),
        unitType: sessionStorage.getItem('unitType') === null ? ['全部'] : sessionStorage.getItem('unitType').split(','),
        productModel: sessionStorage.getItem('productModel') === null ? ['全部'] : sessionStorage.getItem('productModel').split(','),
        patternType: sessionStorage.getItem('patternType') === null ? ['全部'] : sessionStorage.getItem('patternType').split(',') // 模具型号
      },
      oeeForm: {
        oee: ''
      },
      oeeRules: {
        oee: [
          { required: true, validator: validateOee, trigger: 'blur' }
        ]
      },
      dataTable: '',
      productModelValue: '',
      equipmentOptions: [],
      productOptions: [],
      productOptionsAll: [],
      moduleOptions: [],
      currentRow: {},
      rules: {
        beginDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        unitType: [
          { required: true, message: '请选择设备型号', trigger: 'change' }
        ],
        productModel: [
          { required: true, message: '请选择产品型号', trigger: 'change' }
        ],
        patternType: [
          { required: true, message: '请选择模具型号', trigger: 'change' }
        ]
      },
      listLoading: false,
      isDisabled: true,
      disabledSelect: true,
      tableName: '',
      searchTime: [],
      uploadState: '',
      list: [],
      detailList: [],
      pageSize: 15,
      pageNum: 1,
      modalPageNum: 1,
      searchkey: '',
      totalPage: 0,
      detailTotal: 0,
      currentId: '',
      flag: true,
      screenHeight: document.body.clientHeight,
      searchCtnHeight: '',
      spanArr: [],
      oldOptions: sessionStorage.getItem('unitType') === null ? ['全部'] : sessionStorage.getItem('unitType').split(','),
      oldModuleOptions: sessionStorage.getItem('productModel') === null ? ['全部'] : sessionStorage.getItem('productModel').split(','),
      oldProductOptions: sessionStorage.getItem('patternType') === null ? ['全部'] : sessionStorage.getItem('patternType').split(','),
      pos: '',
      groups: '2',
      formData: {
        pageIndex: 1,
        pageSize: 500
      },
      productSearchKey: '',
      productSearchList: []
    }
  },
  watch: {
    productModel(newValue, oldValue) {
      this.productModelForm.patternType = ['全部']
      if (newValue.length !== 0) {
        this.disabledSelect = false
        // 获取所有的模具
        this.mouldInfo(newValue)
      } else {
        this.disabledSelect = true
      }
    }
  },
  created() {
    if (sessionStorage.getItem('unitType')) {
      this.disabledSelect = false
    }
  },
  computed: {
    productModel() {
      return this.productModelForm.productModel
    }
  },
  mounted() {
    if (!sessionStorage.getItem('olapRefresh')) {
      this.$refs.productModelFormOut.resetFields()
    }
    if (sessionStorage.getItem('productModel')) {
      this.mouldInfo(sessionStorage.getItem('productModel').split(','))
      this.fetchData()
    }
    this.getSpanArr(this.list, 'time')
    this.equipmentInfo()
    this.productInfo()
    // this.searchCtnHeight = this.$refs.searchCtn.offsetHeight
    // const that = this
    // window.onresize = () => {
    //   return (() => {
    //     window.screenHeight = document.body.clientHeight
    //     that.screenHeight = window.screenHeight
    //   })()
    // }
  },
  methods: {
    loadmore() {
      console.log(this.productSearchKey)
      this.formData.pageIndex++
      if (this.productSearchKey !== '') {
        this.productOptions = this.productSearchList.slice(0, parseInt(this.formData.pageIndex) * parseInt(this.formData.pageSize))
      } else {
        this.productOptions = this.productOptionsAll.slice(0, parseInt(this.formData.pageIndex) * parseInt(this.formData.pageSize))
      }
    },
    productSearch(query) {
      this.productSearchKey = query
      this.formData.pageIndex = 1
      this.productSearchList = this.productOptionsAll.filter(item => {
        return item.name.toLowerCase().indexOf(this.productSearchKey.toLowerCase()) > -1
      })
      this.productOptions = this.productSearchList.slice(0, parseInt(this.formData.pageIndex) * parseInt(this.formData.pageSize))
    },
    // 生成一个与行数相同的数组记录每一行设置的合并数
    getSpanArr(data, groups) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.pos = 0 // pos是spanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i][groups] === data[i - 1][groups]) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.spanArr[this.pos] += 1
            this.spanArr.push(0) // 0 即表示该行不显示
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    groupsChange() {
      this.pageNum = 1
      this.fetchData()
    },
    // 选择工厂
    factoryChangeSelect(data) {
      console.log(data)
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    settingOeeValue() {
      const oeeVal = sessionStorage.getItem('oee')
      if (oeeVal) {
        this.oeeForm.oee = oeeVal
      }
      this.addOeeVisible = true
    },
    modalPageChange(val) {
      console.log(val)
    },
    clearSearch() {
      this.productModelForm.beginDate = ''
      this.productModelForm.endDate = ''
      this.productModelForm.unitType = ['全部']
      this.productModelForm.productModel = ['全部']
      this.productModelForm.patternType = ['全部']
    },
    clearSearchOut() {
      this.clearSearch()
      this.submitForm('productModelFormOut')
    },
    clearSearchIn() {
      this.clearSearch()
      // this.$refs.productModelFormIn.resetFields()
      this.submitForm('productModelFormIn')
    },
    eqptChangeSelect(val) {
      const allValues = []
      // 保留所有值
      for (const item of this.equipmentOptions) {
        allValues.push(item.id)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions
      // 若是全部选择
      if (val.includes('全部')) { this.productModelForm.unitType = ['全部'] }
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes('全部') && !val.includes('全部')) this.productModelForm.unitType = []
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('全部') && val.includes('全部')) {
        const index = val.indexOf('全部')
        val.splice(index, 1) // 排除全选选项
        this.productModelForm.unitType = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('全部') && !val.includes('全部')) {
        if (val.length === allValues.length - 1) this.productModelForm.unitType = ['全部'].concat(val)
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldOptions = this.productModelForm.unitType
    },
    productChangeSelect(val) {
      const allValues = []
      // 保留所有值
      for (const item of this.productOptionsAll) {
        allValues.push(item.id)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldProductOptions
      // 若是全部选择
      if (val.includes('全部')) { this.productModelForm.productModel = ['全部'] }
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes('全部') && !val.includes('全部')) this.productModelForm.productModel = []
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('全部') && val.includes('全部')) {
        const index = val.indexOf('全部')
        val.splice(index, 1) // 排除全选选项
        this.productModelForm.productModel = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('全部') && !val.includes('全部')) {
        if (val.length === allValues.length - 1) this.productModelForm.productModel = ['全部'].concat(val)
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldProductOptions = this.productModelForm.productModel
    },
    modelChangeSelect(val) {
      const allValues = []
      // 保留所有值
      for (const item of this.moduleOptions) {
        allValues.push(item.id)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldModuleOptions
      // 若是全部选择
      if (val.includes('全部')) { this.productModelForm.patternType = ['全部'] }
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes('全部') && !val.includes('全部')) this.productModelForm.patternType = []
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('全部') && val.includes('全部')) {
        const index = val.indexOf('全部')
        val.splice(index, 1) // 排除全选选项
        this.productModelForm.patternType = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('全部') && !val.includes('全部')) {
        if (val.length === allValues.length - 1) this.productModelForm.patternType = ['全部'].concat(val)
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldModuleOptions = this.productModelForm.patternType
    },
    // 获取所有设备
    equipmentInfo() {
      queryEquipment({}).then(res => {
        if (res.code === 0) {
          this.equipmentOptions = res.data
          if (this.equipmentOptions.length > 0) {
            this.equipmentOptions.unshift({
              id: '全部',
              name: '全部'
            })
          }
        }
      })
    },
    // 获取所有产品
    productInfo() {
      queryProduct({}).then(res => {
        if (res.code === 0) {
          // this.productOptions = res.data
          this.productOptionsAll = res.data
          if (this.productOptionsAll.length > 0) {
            this.productOptionsAll.unshift({
              id: '全部',
              name: '全部'
            })
          }
          if (this.productOptionsAll.length > parseInt(this.formData.pageSize)) {
            this.productOptions = this.productOptionsAll.slice(0, parseInt(this.formData.pageSize))
          } else {
            this.productOptions = this.productOptionsAll
          }
        }
      })
    },
    // 获取所有模具
    mouldInfo(productIdList) {
      let productIds = ''
      if (productIdList[0] !== '全部') {
        productIds = productIdList.join(',')
      }
      const params = {
        productId: productIds
      }
      queryMould(params).then(res => {
        this.moduleOptions = res.data
        if (this.moduleOptions.length > 0) {
          this.moduleOptions.unshift({
            id: '全部',
            code: '全部'
          })
          this.productModelForm.patternType = ['全部']
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if ((this.productModelForm.beginDate - this.productModelForm.endDate) > 86400) {
            Message({
              message: '开始时间不能大于结束时间',
              type: 'error',
              duration: 5 * 1000
            })
            return false
          }
          this.fetchData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 设置OEE阈值
    submitOeeForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            threshold: this.oeeForm.oee
          }
          this.newOeeVal = this.oeeForm.oee
          saveThreshold(params).then(res => {
            if (res.code === 0) {
              this.addOeeVisible = false
              sessionStorage.setItem('oee', this.oeeForm.oee)
              this.oeeForm.oee = this.newOeeVal
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelSetOee() {
      this.addOeeVisible = false
      this.fetchData()
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    modalPageChanges(pageNum) {
      this.modalPageNum = pageNum
      this.viewDetail()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData() {
      if (this.isStart) {
        this.isLoading = true
      }
      this.listLoading = true
      var eqptIds = ''
      var materialIds = ''
      var modelIds = ''
      if (this.productModelForm.unitType[0] !== '全部') {
        eqptIds = this.productModelForm.unitType.join(',')
      }
      if (this.productModelForm.productModel[0] !== '全部') {
        materialIds = this.productModelForm.productModel.join(',')
      }
      if (this.productModelForm.patternType[0] !== '全部') {
        modelIds = this.productModelForm.patternType.join(',')
      }
      var params = {
        startTime: this.formatDate(this.productModelForm.beginDate),
        endTime: this.formatDate(this.productModelForm.endDate),
        eqptId: eqptIds,
        materialId: materialIds,
        modelId: modelIds,
        groupTag: this.groups,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      console.log(params)
      integratedQuery(params).then(res => {
        if (res.code === 0) {
          sessionStorage.setItem('olapRefresh', true)
          sessionStorage.setItem('olapStartTime', this.productModelForm.beginDate)
          sessionStorage.setItem('olapEndTime', this.productModelForm.endDate)
          sessionStorage.setItem('unitType', this.productModelForm.unitType)
          sessionStorage.setItem('productModel', this.productModelForm.productModel)
          sessionStorage.setItem('patternType', this.productModelForm.patternType)
          this.isStart = sessionStorage.getItem('olapRefresh')
          this.isLoading = false
          this.isDisabled = false
          this.list = res.data.dataList.list
          this.oeeForm.oee = res.data.threshold
          this.dataTable = res.data.dataTable
          this.totalPage = parseInt(res.data.dataList.total)
          switch (this.groups) {
            case '0' : this.getSpanArr(this.list, 'dataTime')
              break
            case '1' : this.getSpanArr(this.list, 'eqptName')
              break
            case '2' : this.getSpanArr(this.list, 'materialName')
              break
          }
          this.listLoading = false
          document.getElementById('tableTop').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
        }
      })
    },
    handleViewDetailClick(row) {
      this.currentRow = row
      this.modalPageNum = 1
      this.viewDetail()
    },
    // 查看详情
    viewDetail() {
      var params = {
        startTime: this.formatDate(this.productModelForm.beginDate),
        endTime: this.formatDate(this.productModelForm.endDate),
        eqptCode: this.currentRow.eqptName,
        materialName: this.currentRow.materialName,
        mouldCode: this.currentRow.mouldWmsCode,
        pageSize: 15,
        pageNum: this.modalPageNum
      }
      findDetail(params).then(res => {
        this.detailList = res.data.list
        this.detailTotal = res.data.total
        this.oeeDetailVisible = true
      })
    }
  }
}
