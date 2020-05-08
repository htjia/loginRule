
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getPlanConstuct, eqptParamsConstuct, scrapReasonscrapThan } from '@/api/report/contrast'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      isContrast: false,
      order: '0',
      productName: '',
      productCode: '',
      totaldaNum: '',
      totalRejectNum: '',
      totalRejectRatio: '',
      currentNav: 1,
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      time: '',
      totalPage: 0,
      wocode: {},
      scrapThanList: {
        gxList: [],
        yzList: [],
        yzzjList: [],
        jjzjList: [],
        yhzjList: []
      },
      firstColData: {
        eqptBSInfo: {
          eqptCode: '',
          eqptBrand: '',
          model: '',
          power: '',
          processTime: '',
          oee: ''
        },
        eqptDetail: {
          eqptCode: '',
          daNum: '',
          rejectNum: '',
          rejectatio: ''
        },
        planBsData: {},
        mouldReject: {
          mouldCode: '',
          daNum: '',
          rejectNum: '',
          rejectRatio: '',
          maintainCount: '',
          seriousMaintainCount: '',
          avgMaintainDay: ''
        }
      },
      secondColData: {
        eqptBSInfo: {
          eqptCode: '',
          eqptBrand: '',
          model: '',
          power: '',
          processTime: '',
          oee: ''
        },
        eqptDetail: {
          eqptCode: '',
          daNum: '',
          rejectNum: '',
          rejectatio: ''
        },
        planBsData: {},
        mouldReject: {
          mouldCode: '',
          daNum: '',
          rejectNum: '',
          rejectRatio: '',
          maintainCount: '',
          seriousMaintainCount: '',
          avgMaintainDay: ''
        }
      },
      eqptParams: [],
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    this.productName = this.$route.query.pn
    this.productCode = this.$route.query.pc
    this.woCode1 = this.$route.query.c1
    if (this.$route.query.c2) {
      this.woCode2 = this.$route.query.c2
      this.isContrast = true
    }
    this.fetchData()
  },
  mounted() {
    // 先给页面注册滚动事件
    this.$refs.scrollBox.addEventListener('scroll', this.Scroll)
  },
  methods: {
    formatNum(str) {
      var newStr = ''
      var count = 0
      for (var i = str.length - 1; i >= 0; i--) {
        if (count % 3 === 0 && count !== 0) {
          newStr = str.charAt(i) + ',' + newStr
        } else {
          newStr = str.charAt(i) + newStr
        }
        count++
      }
      str = newStr
      return str
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        woCode1: this.woCode1,
        woCode2: this.woCode2
      }
      this.wocode = {
        wocode: this.woCode1 + ',' + this.woCode2
      }
      getPlanConstuct(params).then(res => {
        if (res.code === 0) {
          this.totaldaNum = this.formatNum(res.data[0].daNum.toString())
          this.totalRejectNum = this.formatNum(res.data[0].rejectNum.toString())
          this.totalRejectRatio = res.data[0].rejectRatio
          if (res.data.length === 2) {
            this.firstColData = res.data[0]
            this.secondColData = res.data[1]
          } else {
            this.firstColData = res.data[0]
          }
        }
      })
      eqptParamsConstuct(params).then(res => {
        this.eqptParams = res.data
      })
      scrapReasonscrapThan(this.wocode).then(res => {
        // this.scrapThanList = res.data
        this.scrapThanList.gxList = []
        this.scrapThanList.yzList = []
        this.scrapThanList.yzzjList = []
        this.scrapThanList.jjzjList = []
        this.scrapThanList.yhzjList = []
        for (let i = 0; i < res.data.gxList.length; i++) {
          if ((res.data.gxList[i].value1 !== '' && res.data.gxList[i].value1 !== res.data.gxList[i].value2) || this.order !== 1) {
            this.scrapThanList.gxList.push(res.data.gxList[i])
          }
        }
        for (let i = 0; i < res.data.yzList.length; i++) {
          if ((res.data.yzList[i].value1 !== '' && res.data.yzList[i].value1 !== res.data.yzList[i].value2) || this.order !== 1) {
            this.scrapThanList.yzList.push(res.data.yzList[i])
          }
        }
        for (let i = 0; i < res.data.yzzjList.length; i++) {
          if ((res.data.yzzjList[i].value1 !== '' && res.data.yzzjList[i].value1 !== res.data.yzzjList[i].value2) || this.order !== 1) {
            this.scrapThanList.yzzjList.push(res.data.yzzjList[i])
          }
        }
        for (let i = 0; i < res.data.jjzjList.length; i++) {
          if ((res.data.jjzjList[i].value1 !== '' && res.data.jjzjList[i].value1 !== res.data.jjzjList[i].value2) || this.order !== 1) {
            this.scrapThanList.jjzjList.push(res.data.jjzjList[i])
          }
        }
        for (let i = 0; i < res.data.yhzjList.length; i++) {
          if ((res.data.yhzjList[i].value1 !== '' && res.data.yhzjList[i].value1 !== res.data.yhzjList[i].value2) || this.order !== 1) {
            this.scrapThanList.yhzjList.push(res.data.yhzjList[i])
          }
        }
      })
    },
    timeChanged(data) {
      console.log(data)
    },
    groupsChange(data) {
      console.log(data)
      scrapReasonscrapThan(this.wocode).then(res => {
        // this.scrapThanList = res.data
        this.scrapThanList.gxList = []
        this.scrapThanList.yzList = []
        this.scrapThanList.yzzjList = []
        this.scrapThanList.jjzjList = []
        this.scrapThanList.yhzjList = []
        for (let i = 0; i < res.data.gxList.length; i++) {
          if ((res.data.gxList[i].value1 !== '' && res.data.gxList[i].value1 !== res.data.gxList[i].value2) || this.order !== 1) {
            this.scrapThanList.gxList.push(res.data.gxList[i])
          }
        }
        for (let i = 0; i < res.data.yzList.length; i++) {
          if ((res.data.yzList[i].value1 !== '' && res.data.yzList[i].value1 !== res.data.yzList[i].value2) || this.order !== 1) {
            this.scrapThanList.yzList.push(res.data.yzList[i])
          }
        }
        for (let i = 0; i < res.data.yzzjList.length; i++) {
          if ((res.data.yzzjList[i].value1 !== '' && res.data.yzzjList[i].value1 !== res.data.yzzjList[i].value2) || this.order !== 1) {
            this.scrapThanList.yzzjList.push(res.data.yzzjList[i])
          }
        }
        for (let i = 0; i < res.data.jjzjList.length; i++) {
          if ((res.data.jjzjList[i].value1 !== '' && res.data.jjzjList[i].value1 !== res.data.jjzjList[i].value2) || this.order !== 1) {
            this.scrapThanList.jjzjList.push(res.data.jjzjList[i])
          }
        }
        for (let i = 0; i < res.data.yhzjList.length; i++) {
          if ((res.data.yhzjList[i].value1 !== '' && res.data.yhzjList[i].value1 !== res.data.yhzjList[i].value2) || this.order !== 1) {
            this.scrapThanList.yhzjList.push(res.data.yhzjList[i])
          }
        }
      })
    },
    navClick(num) {
      switch (num) {
        case 1 : document.getElementById('jcxx').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
          break
        case 2 : document.getElementById('yzjjcxx').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
          break
        case 3 : document.getElementById('yzjcs').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
          break
        case 4 : document.getElementById('yzjjgls').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
          break
        case 5 : document.getElementById('mjjgls').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
          break
        case 6 : document.getElementById('bfxx').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
          break
      }
    },
    // 滚动事件,如果不绑定到元素上，则只能监听页面滚动
    Scroll(e) {
      const jcxx = parseInt(window.getComputedStyle(this.$refs.jcxx).height)
      const yzjjcxx = parseInt(window.getComputedStyle(this.$refs.yzjjcxx).height)
      const yzjcs = parseInt(window.getComputedStyle(this.$refs.yzjcs).height)
      const yzjjgls = parseInt(window.getComputedStyle(this.$refs.yzjjgls).height)
      const mjjgls = parseInt(window.getComputedStyle(this.$refs.mjjgls).height)
      const scrollTop = this.$refs.scrollBox.scrollTop
      if (scrollTop === 0) {
        this.currentNav = 1
      }
      if (scrollTop > jcxx) {
        this.currentNav = 2
      }
      if (scrollTop > jcxx + yzjjcxx + 25) {
        this.currentNav = 3
      }
      if (scrollTop > jcxx + yzjjcxx + yzjcs + 50) {
        this.currentNav = 4
      }
      if (scrollTop > jcxx + yzjjcxx + yzjcs + yzjjgls + 75) {
        this.currentNav = 5
      }
      if (scrollTop > jcxx + yzjjcxx + yzjcs + yzjjgls + mjjgls + 100) {
        this.currentNav = 6
      }
    }
  }
}

