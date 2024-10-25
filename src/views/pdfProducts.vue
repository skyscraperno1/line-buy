<template>
    <div class="content">
      <div class="cell">
        <el-button type="primary" @click="getPdf">PDF</el-button>
      </div>
    </div>
</template>

<script>
import { getByProductPdf } from '@/api/tablation'
export default {
    data(){
        return{
            queryParams: {},
            // userId: 'U868511d7c9fc6074ce08c5140503e808',
            userId: '',
        }
    },
    async created(){
      this.init()
      await this.parseQueryParams();
    },
    methods:{
          async init() {
          // 正式环境LineId:2003804589-8E07K6bN
          // 测试环境LineId:2003687931-w55JjYzE
          await liff.init({ liffId: '2003687931-w55JjYzE' })
          const res = liff.getContext()
          console.log('liff',res)
          this.userId = res.userId
          this.getUserInfo();
        },
        async parseQueryParams() {
            const params = new URLSearchParams(window.location.search);
            for (let [key, value] of params.entries()) {
                this.queryParams[key] = value;
            }
        },
        getPdf() {
          if(this.queryParams.pdf){
            window.open(`https://mp.desim.tech/api/pdf/${this.queryParams.pdf}`)
          }
        },
        async getUserInfo() {
            const data = {
              userId: this.userId,
              pdf: this.queryParams.pdf
            }
            const res = await getByProductPdf(data)
        }
    }
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .cell{
    width: 80%;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 40px 30px;
    border-radius: 5px
  }
  }
</style>
