import PageHeaderLayout from '@/components/PageHeaderLayout'
import { detail } from '@/api/factory'
export default {
  components: { PageHeaderLayout },
  data() {
    return {
      listLoading: false,
      list: []
    }
  },
  watch: {
  },
  mounted() {
    this.fetchData(this.$route.query.id)
  },
  methods: {
    fetchData(id) {
      detail(id).then(res => {
        this.list.push(res.data)
        detail(res.data.parentCode).then(res => {
          if (res.data === null) {
            this.list[0].parentCode = '无'
          } else {
            this.list[0].parentCode = res.data.name
          }
        })
      })
    }
  }
}
