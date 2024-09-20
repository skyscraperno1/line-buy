<template>
    <div class="content">
      <div class="hotProduct" >HOT商品</div>
      <div class="esimCard">
        <div class="esimCardItem" v-for="(item, index) in hotList" :key="index">
          <div class="cont">
            <div class="imgdiv" v-if="item.flagImage"><img :src="item.flagImage" class="nationalIcon"></div>
            <div class="card_title">{{ item.country }} eSIM</div>
            <div class="card_desc">
              <img src="../assets/images/Frame8.png">
              <span>{{ item.days }}日間</span>
            </div>
            <div class="card_sub">{{ item.productName }}</div>
            <div class="unlimited">
              <div class="unides" v-if="item.unitPrice">
                <span style="margin-right: 5px;">{{ item.symbol }}</span>
                <span>{{ item.unitPrice.toLocaleString() }} </span><span
                  style="font-size: 12px;font-weight: bold;">(税込)</span>
              </div>
              <img v-if="item.productLink" src="../assets/images/Frame7.png" @click="godowns(item)">
            </div>
          </div>
        </div>
      </div>

      <div class="bg" v-if="diables">
        <div class="confirm_cardss">
          <img src="../assets/images/frame20.png" class="closeImg" @click="closeDia">
          <div class="subD">
            <img src="../assets/images/frame21.png" v-if="esimSelection == 0" class="sel" @click="selectChoose('esimSelection',1)">
            <img src="../assets/images/frame22.png" v-if="esimSelection == 1" class="sel" @click="selectChoose('esimSelection',0)">
            <span style="letter-spacing: 2px;">eSIM対応端末です</span>
          </div>
          <div class="subD">
            <img src="../assets/images/frame21.png" v-if="simSelection == 0" class="sel" @click="selectChoose('simSelection',1)">
            <img src="../assets/images/frame22.png" v-if="simSelection == 1" class="sel" @click="selectChoose('simSelection',0)">
            <span style="letter-spacing: 2px;">SIM ロック解除済み端末です</span>
          </div>
          <div class="confirmBtn" @click="goShopify">
            <img src="../assets/images/frame24.png" class="com">
          </div>
        </div>
      </div>

      <div class="bg" v-if="showTip">
          <div class="confirm_cards">
            <div class="subTit">おっと!</div>
            <div class="subDs">
              チェックしてください
            </div>
            <div class="subBtn" @click="closeShowTip">了解</div>
          </div>
      </div>
    </div>
</template>

<script>
import { lineSearchProductList, lineUser } from '@/api/tablation'
export default {
    data(){
        return{
            queryParams: {},
            hotList: [],
            data: {},
            diables: false,
            simSelection: 0,
			esimSelection: 0,
            showTip: false
        }
    },
    async created(){
        await this.parseQueryParams();
        this.getHotProduct()
    },
    methods:{
        async parseQueryParams() {
            const params = new URLSearchParams(window.location.search);
            for (let [key, value] of params.entries()) {
                this.queryParams[key] = value;
            }
        },
        async getHotProduct() {
            const data = {
                platformIds: '3',
                pageSize: 4, 
                ...this.queryParams
            }
            const res = await lineSearchProductList(data)
            if (res.rows.length > 0) {
                this.hotList = res.rows
            }
        },
        godowns(item) {
			this.data = item
            this.diables = true
		},
        closeDia() {
			this.simSelection = 0
			this.esimSelection = 0
			this.diables = false
		},
        selectChoose(key,val) {
			if(key == 'esimSelection') {
				this.esimSelection = val
			}else {
				this.simSelection = val
			}
		},
        goShopify() {
			if(this.simSelection == 0 || this.esimSelection == 0) {
				this.showTip = true
				return
			}
			if (this.data.productLink) {
				lineUser({ userId: this.userId}).then(res => {
					const variantId = this.data.productLink.split('variant=')[1]
                    window.location.href = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`
				})
			}
		},
        closeShowTip() {
			this.showTip = false
		},
    }
}
</script>
<style lang="scss" scoped>
.content {
    width: 100%;
    padding: 20px;

    .hotProduct {
      color: #000;
      font-size: 18px;
      font-weight: bold;
      height: 60px;
      line-height: 60px;
      width: 100%;
      text-align: center;
    }

    .esimCard {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      // margin: 30px auto;

      .esimCardItem {
        flex-basis: 48%;
        box-sizing: border-box;
        background-image: url(../assets/images/frame15.png);
        background-size: 100%, 100%;
        width: 155px;
        height: 250px;
        object-fit: cover;
        margin-bottom: 20px;
        position: relative;
        padding: 15px 10px;
        background-repeat: no-repeat;
        .cont {
          position: absolute;
          width: 90%;

          .imgdiv {
            width: 57px;
            height: 42.84px;
            border: 1px solid #EFF3F8;
            border-radius: 10px;
            margin-bottom: 20px;

            .nationalIcon {
              width: 55px;
              height: 42.84px;
              object-fit: cover;
            }
          }

          .card_title {
            font-size: 16px;
            font-weight: bold;
            color: #000;
          }

          .card_desc {
            font-size: 12px;
            color: #4E637E;
            display: flex;
            align-items: center;

            img {
              width: 16px;
              height: 16px;
              margin-right: 6px;

            }
          }

          .card_sub {
            font-size: 12px;
            color: #1A1A1A;
            height: 30px;
          }

          .unlimited {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 5px;
            width: 100%;

            .unides {
              font-size: 16px;
              font-weight: bold;
              color: #000;
              // margin-right: 30px;
            }

            img {
              width: 30px;
              height: 30px;
            }
          }
        }

      }
    }
    .bg {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 75, 132, .2);
    }
    .confirm_cardss {
        width: 340px;
        background: #FAFCFE;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -66%);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        // align-items: center;
        .closeImg {
            position: absolute;
            top: -5px;
            right: -5px;
        }
        .subTit {
            font-size: 20px;
            color: #1A1A1A;
            text-align: center;
            font-weight: bold;
        }

        .subD {
            font-size: 16px;
            font-weight: bold;
            color: #6B7280;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 60px;
            .sel {
                margin-right: 10px;
                width: 23px;
                height: 23px;
            }
        }
        .confirmBtn {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            .com {
                width: 75%;
        object-fit: cover;
            }
        }
    }
    .confirm_cards {
    width: 340px;
    background: #FAFCFE;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -66%);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      margin-top: 10px;
    }

    .subTit {
      font-size: 20px;
      color: #1A1A1A;
      text-align: center;
      font-weight: bold;
    }

    .subDs {
      font-size: 14px;
      color: #1A1A1A;
      margin-top: 20px;
      text-align: center;
    }

    .subBtn {
      cursor: pointer;
      width: 100%;
      height: 42px;
      border-radius: 21px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      background: #004B84;
      color: #FAFCFE;
      margin-top: 30px;
    }
  }
  }
</style>
