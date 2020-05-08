import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryEquipment, productList, queryMould, rawList, eqptParam } from '@/api/parameterRecommend'
import Chart from '@/components/Charts'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      isStart: sessionStorage.getItem('paramRefresh'),
      isLoading: false,
      disabledSelect: true,
      productModelForm: {
        eqptType: sessionStorage.getItem('eqptType') === null ? '' : sessionStorage.getItem('eqptType'), // 设备
        productType: sessionStorage.getItem('productType') === null ? '' : parseInt(sessionStorage.getItem('productType')), // 产品
        mouldType: sessionStorage.getItem('mouldType') === null ? '' : sessionStorage.getItem('mouldType'), // 模具型号
        materialsType: sessionStorage.getItem('materialsType') === null ? '' : sessionStorage.getItem('materialsType') // 材料
      },
      productModelValue: '',
      equipmentOptions: [],
      productOptions: [],
      mouldOptions: [],
      materialsOptions: [],
      factoryType: '3',
      factoryOptions: [
        {
          id: '3',
          name: '3#'
        }
      ],
      rules: {
        eqptType: [
          { required: true, message: '请选择设备型号', trigger: 'change' }
        ],
        productType: [
          { required: true, message: '请选择产品型号', trigger: 'change' }
        ],
        mouldType: [
          { required: true, message: '请选择模具型号', trigger: 'change' }
        ],
        materialsType: [
          { required: true, message: '请选择材料', trigger: 'change' }
        ]
      },
      listLoading: false,
      tableName: '',
      searchTime: [],
      rateValue: 0,
      uploadState: '',
      eqptBrand: '',
      infoList: [{
        power: '',
        productName: '',
        mouldCode: '',
        eqptCode: '',
        rawName: '',
        modelId: ''
      }],
      yLists: [{ va: '推荐范围', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '', v9: '' }],
      zLists: [{ va: '推荐范围', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '', v9: '', v10: '' }],
      zsLists: [{ va: '推荐范围', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '', v9: '', v10: '' }],
      jkdyLists: [{ va: '推荐范围', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '', v9: '' }],
      jkLists: [{ va: '推荐范围', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '' }]
    }
  },
  watch: {
    productType(newValue, oldValue) {
      this.productModelForm.mouldType = ''
      this.productModelForm.materialsType = ''
      // setTimeout(() => this.$refs.productModelForm.clearValidate(), 10)
      // setTimeout(() => this.$refs.productModelFormIn.clearValidate(), 10)
      console.log(newValue, 'newValue')
      if (newValue !== '') {
        this.disabledSelect = false
        // 获取产品对应的模具
        this.mouldInfo(newValue)
        // 获取产品对应的材料
        this.materialsInfo(newValue)
        sessionStorage.removeItem('mouldType')
        sessionStorage.removeItem('materialsType')
      } else {
        this.disabledSelect = true
      }
    }
  },
  created() {
    this.equipmentInfo()
    this.productInfo()
  },
  computed: {
    productType() {
      return this.productModelForm.productType
    }
  },
  mounted() {
    if (sessionStorage.getItem('productType')) {
      // this.productModelForm.productType = parseInt(sessionStorage.getItem('productType'))
      this.disabledSelect = false
      this.mouldInfo(sessionStorage.getItem('productType'))
      this.materialsInfo(sessionStorage.getItem('productType'))
    }
  },
  methods: {
    // 获取所有设备
    equipmentInfo() {
      queryEquipment({}).then(res => {
        if (res.code === 0) {
          this.equipmentOptions = res.data
          // if (sessionStorage.getItem('eqptType')) {
          //   console.log('123')
          // }
        }
      })
    },
    // 获取所有产品
    productInfo() {
      productList({}).then(res => {
        if (res.code === 0) {
          this.productOptions = res.data
        }
      })
    },
    // 获取产品对应的模具
    mouldInfo(productId) {
      const params = {
        productId: productId
      }
      queryMould(params).then(res => {
        this.mouldOptions = res.data
        if (sessionStorage.getItem('mouldType')) {
          this.productModelForm.mouldType = parseInt(sessionStorage.getItem('mouldType'))
        }
      })
    },
    // 获取产品对应的材料
    materialsInfo(productId) {
      const params = {
        productId: productId
      }
      rawList(params).then(res => {
        this.materialsOptions = res.data
        if (sessionStorage.getItem('materialsType')) {
          this.productModelForm.materialsType = parseInt(sessionStorage.getItem('materialsType'))
          this.getParams()
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          sessionStorage.setItem('eqptType', this.productModelForm.eqptType)
          sessionStorage.setItem('productType', this.productModelForm.productType)
          sessionStorage.setItem('mouldType', this.productModelForm.mouldType)
          sessionStorage.setItem('materialsType', this.productModelForm.materialsType)
          this.getParams()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取推荐参数
    getParams() {
      if (this.isStart) {
        this.isLoading = true
      }
      const params = {
        productId: this.productModelForm.productType,
        eqptId: this.productModelForm.eqptType,
        mouldId: sessionStorage.getItem('mouldType'),
        rawId: sessionStorage.getItem('materialsType')
        // productId: '3565',
        // eqptId: '330',
        // mouldId: '8287',
        // rawId: '39053'
        // productId: '5411',
        // eqptId: '339',
        // mouldId: '8490',
        // rawId: '39047'
      }
      eqptParam(params).then(res => {
        sessionStorage.setItem('paramRefresh', true)
        sessionStorage.setItem('eqptType', this.productModelForm.eqptType)
        sessionStorage.setItem('productType', this.productModelForm.productType)
        sessionStorage.setItem('mouldType', this.productModelForm.mouldType)
        sessionStorage.setItem('materialsType', this.productModelForm.materialsType)
        this.isLoading = false
        this.isStart = sessionStorage.getItem('paramRefresh')
        this.eqptBrand = res.data.eqptBrand
        this.rateValue = res.data.param.scrap_rate_threshold_value
        this.infoList = []
        this.infoList.push({
          power: res.data.power + 't',
          productName: res.data.productName,
          mouldCode: res.data.mouldCode,
          eqptCode: res.data.eqptCode,
          rawName: res.data.rawName,
          modelId: res.data.modelId
        })
        if (res.data.eqptBrand === '1') { // 东洋
          this.yLists = [{ va: '推荐范围', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '', v9: '' }]
          const item1 = res.data.param.setting_value.filter(item => item.var_name === 'yz_3Speed')
          const item2 = res.data.param.setting_value.filter(item => item.var_name === 'yz_2Speed')
          const item3 = res.data.param.setting_value.filter(item => item.var_name === 'yz_1Speed')
          const item4 = res.data.param.setting_value.filter(item => item.var_name === 'yz_TopSpeed')
          const item5 = res.data.param.setting_value.filter(item => item.var_name === 'yz_BoostingTime')
          const item6 = res.data.param.setting_value.filter(item => item.var_name === 'yz_Coolingtime1')
          const item7 = res.data.param.setting_value.filter(item => item.var_name === 'yz_Thickness')
          const item8 = res.data.param.setting_value.filter(item => item.var_name === 'yz_CycleTime')
          const monitoring1 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_1Speed')
          const monitoring2 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_2Speed')
          const monitoring3 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_3Speed')
          const monitoring4 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_TopSpeed')
          const monitoring5 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_Pressure')
          const monitoring6 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_Thickness')
          const monitoring7 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_BoostingTime')
          const monitoring8 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_CycleTime')
          const monitoring9 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_Clampingforce')
          if (item1.length !== 0) {
            const c1 = item1[0].value - item1[0].lower_limit
            const c2 = item1[0].upper_limit - item1[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.yLists[0].v1 = item1[0].value
            } else {
              this.yLists[0].v1 = item1[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.yLists[0].v1 = '--'
          }
          if (item2.length !== 0) {
            const c1 = item2[0].value - item2[0].lower_limit
            const c2 = item2[0].upper_limit - item2[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.yLists[0].v2 = item2[0].value
            } else {
              this.yLists[0].v2 = item2[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.yLists[0].v2 = '--'
          }
          if (item3.length !== 0) {
            const c1 = item3[0].value - item3[0].lower_limit
            const c2 = item3[0].upper_limit - item3[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.yLists[0].v3 = item3[0].value
            } else {
              this.yLists[0].v3 = item3[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.yLists[0].v3 = '--'
          }
          if (item4.length !== 0) {
            const c1 = item4[0].value - item4[0].lower_limit
            const c2 = item4[0].upper_limit - item4[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.yLists[0].v4 = item4[0].value
            } else {
              this.yLists[0].v4 = item4[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.yLists[0].v4 = '--'
          }
          if (item5.length !== 0) {
            const c1 = item5[0].value - item5[0].lower_limit
            const c2 = item5[0].upper_limit - item5[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.yLists[0].v5 = item5[0].value
            } else {
              this.yLists[0].v5 = item5[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.yLists[0].v5 = '--'
          }
          if (item6.length !== 0) {
            const c1 = item6[0].value - item6[0].lower_limit
            const c2 = item6[0].upper_limit - item6[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.yLists[0].v6 = item6[0].value
            } else {
              this.yLists[0].v6 = item6[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.yLists[0].v6 = '--'
          }
          if (item7.length !== 0) {
            const c1 = item7[0].value - item7[0].lower_limit
            const c2 = item7[0].upper_limit - item7[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.yLists[0].v7 = item7[0].value
            } else {
              this.yLists[0].v7 = item7[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.yLists[0].v7 = '--'
          }
          if (item8.length !== 0) {
            const c1 = item8[0].value - item8[0].lower_limit
            const c2 = item8[0].upper_limit - item8[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.yLists[0].v8 = item8[0].value
            } else {
              this.yLists[0].v8 = item8[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.yLists[0].v8 = '--'
          }
          if (monitoring1.length !== 0) {
            this.jkdyLists[0].v1 = monitoring1[0].lower_limit.toFixed(2) + '~' + monitoring1[0].upper_limit.toFixed(2)
          } else {
            this.jkdyLists[0].v1 = '--'
          }
          if (monitoring2.length !== 0) {
            this.jkdyLists[0].v2 = monitoring2[0].lower_limit.toFixed(2) + '~' + monitoring2[0].upper_limit.toFixed(2)
          } else {
            this.jkdyLists[0].v2 = '--'
          }
          if (monitoring3.length !== 0) {
            this.jkdyLists[0].v3 = monitoring3[0].lower_limit.toFixed(2) + '~' + monitoring3[0].upper_limit.toFixed(2)
          } else {
            this.jkdyLists[0].v3 = '--'
          }
          if (monitoring4.length !== 0) {
            this.jkdyLists[0].v4 = monitoring4[0].lower_limit.toFixed(2) + '~' + monitoring4[0].upper_limit.toFixed(2)
          } else {
            this.jkdyLists[0].v4 = '--'
          }
          if (monitoring5.length !== 0) {
            this.jkdyLists[0].v5 = monitoring5[0].lower_limit + '~' + monitoring5[0].upper_limit
          } else {
            this.jkdyLists[0].v5 = '--'
          }
          if (monitoring6.length !== 0) {
            this.jkdyLists[0].v6 = monitoring6[0].lower_limit + '~' + monitoring6[0].upper_limit
          } else {
            this.jkdyLists[0].v6 = '--'
          }
          if (monitoring7.length !== 0) {
            this.jkdyLists[0].v7 = monitoring7[0].lower_limit / 1000 + '~' + monitoring7[0].upper_limit / 1000
          } else {
            this.jkdyLists[0].v7 = '--'
          }
          if (monitoring8.length !== 0) {
            this.jkdyLists[0].v8 = monitoring8[0].lower_limit + '~' + monitoring8[0].upper_limit
          } else {
            this.jkdyLists[0].v8 = '--'
          }
          if (monitoring9.length !== 0) {
            this.jkdyLists[0].v9 = monitoring9[0].lower_limit + '~' + monitoring9[0].upper_limit
          } else {
            this.jkdyLists[0].v9 = '--'
          }
        } else { // 2东芝非S，  3东芝S
          this.zLists = [{ va: '推荐范围', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '', v9: '', v10: '' }]
          const item1 = res.data.param.setting_value.filter(item => item.var_name === 'yz_LowSpeed')
          const item2 = res.data.param.setting_value.filter(item => item.var_name === 'yz_HighSpeed')
          const item3 = res.data.param.setting_value.filter(item => item.var_name === 'yz_BoostingTime')
          const item4 = res.data.param.setting_value.filter(item => item.var_name === 'yz_Highspeedstartingposition')
          const item5 = res.data.param.setting_value.filter(item => item.var_name === 'yz_Emptyplaylocation')
          const item6 = res.data.param.setting_value.filter(item => item.var_name === 'yz_Shootforwardlimits')
          const item7 = res.data.param.setting_value.filter(item => item.var_name === 'yz_Injectionbacktime')
          const item8 = res.data.param.setting_value.filter(item => item.var_name === 'yz_Closingtime')
          const item9 = res.data.param.setting_value.filter(item => item.var_name === 'yz_Thickness')
          const item10 = res.data.param.setting_value.filter(item => item.var_name === 'yz_CycleTime')
          const monitoring1 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_CycleTime')
          const monitoring2 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_LowSpeed')
          const monitoring3 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_HighSpeed')
          const monitoring4 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_Highspeedstartingposition')
          const monitoring5 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_FastInterval')
          const monitoring6 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_Thickness')
          const monitoring7 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_Pressure')
          const monitoring8 = res.data.param.monitoring_value.filter(item => item.var_name === 'yz_BoostingTime')
          if (item1.length !== 0) {
            const c1 = item1[0].value - item1[0].lower_limit
            const c2 = item1[0].upper_limit - item1[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v1 = item1[0].value
              this.zsLists[0].v1 = '--'
            } else {
              this.zLists[0].v1 = item1[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v1 = '--'
            }
          } else {
            this.zLists[0].v1 = '--'
            this.zsLists[0].v1 = '--'
          }
          if (item2.length !== 0) {
            const c1 = item2[0].value - item2[0].lower_limit
            const c2 = item2[0].upper_limit - item2[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v2 = item2[0].value
              this.zsLists[0].v2 = '--'
            } else {
              this.zLists[0].v2 = item2[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v2 = '--'
            }
          } else {
            this.zLists[0].v2 = '--'
            this.zsLists[0].v2 = '--'
          }
          if (item3.length !== 0) {
            const c1 = item3[0].value - item3[0].lower_limit
            const c2 = item3[0].upper_limit - item3[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v3 = item3[0].value
              this.zsLists[0].v3 = '--'
            } else {
              this.zLists[0].v3 = item3[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v3 = '--'
            }
          } else {
            this.zLists[0].v3 = '--'
            this.zsLists[0].v3 = '--'
          }
          if (item4.length !== 0) {
            const c1 = item4[0].value - item4[0].lower_limit
            const c2 = item4[0].upper_limit - item4[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v4 = item4[0].value
              this.zsLists[0].v4 = item4[0].value
            } else {
              this.zLists[0].v4 = item4[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v4 = item4[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.zLists[0].v4 = '--'
            this.zsLists[0].v4 = '--'
          }
          if (item5.length !== 0) {
            const c1 = item5[0].value - item5[0].lower_limit
            const c2 = item5[0].upper_limit - item5[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v5 = item5[0].value
              this.zsLists[0].v5 = item5[0].value
            } else {
              this.zLists[0].v5 = item5[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v5 = item5[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.zLists[0].v5 = '--'
            this.zsLists[0].v5 = '--'
          }
          if (item6.length !== 0) {
            const c1 = item6[0].value - item6[0].lower_limit
            const c2 = item6[0].upper_limit - item6[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v6 = item6[0].value
              this.zsLists[0].v6 = item6[0].value
            } else {
              this.zLists[0].v6 = item6[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v6 = item6[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.zLists[0].v6 = '--'
            this.zsLists[0].v6 = '--'
          }
          if (item7.length !== 0) {
            const c1 = item7[0].value - item7[0].lower_limit
            const c2 = item7[0].upper_limit - item7[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v7 = item7[0].value
              this.zsLists[0].v7 = item7[0].value
            } else {
              this.zLists[0].v7 = item7[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v7 = item7[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.zLists[0].v7 = '--'
            this.zsLists[0].v7 = '--'
          }
          if (item8.length !== 0) {
            const c1 = item8[0].value - item8[0].lower_limit
            const c2 = item8[0].upper_limit - item8[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v8 = item8[0].value
              this.zsLists[0].v8 = item8[0].value
            } else {
              this.zLists[0].v8 = item8[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v8 = item8[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.zLists[0].v8 = '--'
            this.zsLists[0].v8 = '--'
          }
          if (item9.length !== 0) {
            const c1 = item9[0].value - item9[0].lower_limit
            const c2 = item9[0].upper_limit - item9[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v9 = item9[0].value
              this.zsLists[0].v9 = item9[0].value
            } else {
              this.zLists[0].v9 = item9[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v9 = item9[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.zLists[0].v9 = '--'
            this.zsLists[0].v9 = '--'
          }
          if (item10.length !== 0) {
            const c1 = item10[0].value - item10[0].lower_limit
            const c2 = item10[0].upper_limit - item10[0].value
            const c = c1 > c2 ? c1 : c2
            if (c === 0) {
              this.zLists[0].v10 = item10[0].value
              this.zsLists[0].v10 = item10[0].value
            } else {
              this.zLists[0].v10 = item10[0].value + '±' + c.toFixed(2)
              this.zsLists[0].v10 = item10[0].value + '±' + c.toFixed(2)
            }
          } else {
            this.zLists[0].v10 = '--'
            this.zsLists[0].v10 = '--'
          }
          if (monitoring1.length !== 0) {
            this.jkLists[0].v1 = monitoring1[0].lower_limit + '~' + monitoring1[0].upper_limit
          } else {
            this.jkLists[0].v1 = '--'
          }
          if (monitoring2.length !== 0) {
            this.jkLists[0].v2 = monitoring2[0].lower_limit.toFixed(2) + '~' + monitoring2[0].upper_limit.toFixed(2)
          } else {
            this.jkLists[0].v2 = '--'
          }
          if (monitoring3.length !== 0) {
            this.jkLists[0].v3 = monitoring3[0].lower_limit.toFixed(2) + '~' + monitoring3[0].upper_limit.toFixed(2)
          } else {
            this.jkLists[0].v3 = '--'
          }
          if (monitoring4.length !== 0) {
            this.jkLists[0].v4 = monitoring4[0].lower_limit + '~' + monitoring4[0].upper_limit
          } else {
            this.jkLists[0].v4 = '--'
          }
          if (monitoring5.length !== 0) {
            this.jkLists[0].v5 = monitoring5[0].lower_limit + '~' + monitoring5[0].upper_limit
          } else {
            this.jkLists[0].v5 = '--'
          }
          if (monitoring6.length !== 0) {
            this.jkLists[0].v6 = monitoring6[0].lower_limit + '~' + monitoring6[0].upper_limit
          } else {
            this.jkLists[0].v6 = '--'
          }
          if (monitoring7.length !== 0) {
            this.jkLists[0].v7 = monitoring7[0].lower_limit + '~' + monitoring7[0].upper_limit
          } else {
            this.jkLists[0].v7 = '--'
          }
          if (monitoring8.length !== 0) {
            this.jkLists[0].v8 = monitoring8[0].lower_limit + '~' + monitoring8[0].upper_limit
          } else {
            this.jkLists[0].v8 = '--'
          }
        }
      })
    },
    clearSearch() {
      this.productModelForm.eqptType = ''
      this.productModelForm.productType = ''
      this.productModelForm.mouldType = ''
      this.productModelForm.materialsType = ''
    },
    clearSearchOut() {
      this.clearSearch()
      this.submitForm('productModelForm')
      // this.$refs.productModelForm.resetFields()
    },
    clearSearchIn() {
      this.clearSearch()
      // this.submitForm('productModelFormIn')
    },
    // 东阳设定参数推荐
    DYrenderHeader1(h) {
      return [h('p', {}, ['低速3速度']), h('p', {}, ['m/s'])]
    },
    DYrenderHeader2(h) {
      return [h('p', {}, ['低速2速度']), h('p', {}, ['m/s'])]
    },
    DYrenderHeader3(h) {
      return [h('p', {}, ['低速1速度']), h('p', {}, ['m/s'])]
    },
    DYrenderHeader4(h) {
      return [h('p', {}, ['高速速度']), h('p', {}, ['m/s'])]
    },
    DYrenderHeader5(h) {
      return [h('p', {}, ['增压启动']), h('p', {}, ['ms'])]
    },
    DYrenderHeader6(h) {
      return [h('p', {}, ['冷却时间']), h('p', {}, ['s'])]
    },
    DYrenderHeader7(h) {
      return [h('p', {}, ['料饼厚度']), h('p', {}, ['mm'])]
    },
    DYrenderHeader8(h) {
      return [h('p', {}, ['一个铸造循环时间']), h('p', {}, ['s'])]
    },
    // 东芝设定参数推荐
    DZrenderHeader1(h) {
      return [h('p', {}, ['低速阀刻度回转']), h('p', {}, ['m/s'])]
    },
    DZrenderHeader2(h) {
      return [h('p', {}, ['高速阀刻度回转']), h('p', {}, ['m/s'])]
    },
    DZrenderHeader3(h) {
      return [h('p', {}, ['增压阀刻度回转']), h('p', {}, ['m/s'])]
    },
    DZrenderHeader4(h) {
      return [h('p', {}, ['高速开始']), h('p', {}, ['mm'])]
    },
    DZrenderHeader5(h) {
      return [h('p', {}, ['空打位置']), h('p', {}, ['mm'])]
    },
    DZrenderHeader6(h) {
      return [h('p', {}, ['射出前进限位置']), h('p', {}, ['mm'])]
    },
    DZrenderHeader7(h) {
      return [h('p', {}, ['射出后退时间']), h('p', {}, ['s'])]
    },
    DZrenderHeader8(h) {
      return [h('p', {}, ['合模时间']), h('p', {}, ['s'])]
    },
    DZrenderHeader9(h) {
      return [h('p', {}, ['料饼厚度']), h('p', {}, ['mm'])]
    },
    DZrenderHeader10(h) {
      return [h('p', {}, ['一个铸造循环时间']), h('p', {}, ['s'])]
    },
    // 东芝-H设定参数推荐
    DZHrenderHeader1(h) {
      return [h('p', {}, ['低速速度']), h('p', {}, ['m/s'])]
    },
    DZHrenderHeader2(h) {
      return [h('p', {}, ['高速速度']), h('p', {}, ['m/s'])]
    },
    DZHrenderHeader3(h) {
      return [h('p', {}, ['升压时间']), h('p', {}, ['ms'])]
    },
    // 东阳监控参数推荐
    DYmonitorHeader1(h) {
      return [h('p', {}, ['1速速度']), h('p', {}, ['m/s'])]
    },
    DYmonitorHeader2(h) {
      return [h('p', {}, ['2速速度']), h('p', {}, ['m/s'])]
    },
    DYmonitorHeader3(h) {
      return [h('p', {}, ['3速速度']), h('p', {}, ['m/s'])]
    },
    DYmonitorHeader4(h) {
      return [h('p', {}, ['最高速度']), h('p', {}, ['m/s'])]
    },
    DYmonitorHeader5(h) {
      return [h('p', {}, ['铸造压力']), h('p', {}, ['Mpa'])]
    },
    DYmonitorHeader6(h) {
      return [h('p', {}, ['料头厚']), h('p', {}, ['mm'])]
    },
    DYmonitorHeader7(h) {
      return [h('p', {}, ['增压启动时间']), h('p', {}, ['s'])]
    },
    DYmonitorHeader8(h) {
      return [h('p', {}, ['周期时间']), h('p', {}, ['s'])]
    },
    DYmonitorHeader9(h) {
      return [h('p', {}, ['关模力']), h('p', {}, ['Ton'])]
    },
    // 东芝监控参数推荐
    DZmonitorHeader1(h) {
      return [h('p', {}, ['循环时间']), h('p', {}, ['s'])]
    },
    DZmonitorHeader2(h) {
      return [h('p', {}, ['低速速度']), h('p', {}, ['m/s'])]
    },
    DZmonitorHeader3(h) {
      return [h('p', {}, ['高速速度']), h('p', {}, ['m/s'])]
    },
    DZmonitorHeader4(h) {
      return [h('p', {}, ['高速开始']), h('p', {}, ['mm'])]
    },
    DZmonitorHeader5(h) {
      return [h('p', {}, ['高速区间']), h('p', {}, ['mm'])]
    },
    DZmonitorHeader6(h) {
      return [h('p', {}, ['料饼厚度']), h('p', {}, ['mm'])]
    },
    DZmonitorHeader7(h) {
      return [h('p', {}, ['铸造压力']), h('p', {}, ['Mpa'])]
    },
    DZmonitorHeader8(h) {
      return [h('p', {}, ['升压时间']), h('p', {}, ['ms'])]
    }
  }
}
