<template>
  <div class="container">
    <div class="hero">
      <img src="../assets/images/frame17.png" class="topImg">
      <div class="desc">現地での滞在日数は？</div>
      <img src="../assets/images/frame1.png" class="tim">
      <!-- <el-button type="primary" icon="el-icon-arrow-left" size="mini" class="backClass" @click="gore"></el-button> -->
      <img src="../assets/images/frame11.png" class="backClass" @click="gore">
    </div>
    <div class="content" v-if="!diable">
      <div class="popular">
        <img src="../assets/images/frame12.png">
        <span>滞在日数</span>
      </div>
      <div class="card">
        <div class="cardItem" v-for="(item, index) in cardList" :key="item.id" @click="godown(item)">
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
      <div class="hotProduct" v-if="hotList">HOT商品</div>
      <div class="esimCard" v-if="hotList">
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

    <div class="confirm_card" v-if="diable">
      <!-- <div class="subD">「{{ keys }}{{ keyWords }}」以内のeSIM商品は準備中。</div> -->
      <div class="subD">{{ keyWords }}のeSIM商品は準備中。</div>
      <div class="subD">ご購入ついて</div>
      <div class="subD">カスタマーサービスにお問い合わせしてく</div>
      <div class="subD">ださい。</div>
      <div class="subBtn" @click="goback">戻 る</div>
    </div>
  </div>
</template>

<script>
import { lineProductList, lineSearchProductList,lineUserInfo,lineUser } from '@/api/tablation'
export default {
  props: {
    parentProductIds: {
      type: String,
    },
    flagImage: {
      type: String,
    },
    keys: {
      type: String,
    },
    // parentProductName: {
    //   type: String,
    // },
    userId: {
      type: String,
    }
  },
  data() {
    return {
      // parentProductIds: '',
      // flagImage: '',
      cardList: [
        { id: 1, name: '3日間以内', startDays: 1, endDays: 3 },
        { id: 2, name: '7日間以内', startDays: 4, endDays: 7 },
        { id: 3, name: '15日間以内', startDays: 8, endDays: 15 },
        { id: 4, name: '30日間以内', startDays: 16, endDays: 30 }
      ],
      diable: false,
      keyWords: '',
      hotList: [],
      data: {},
			simSelection: 0,
			esimSelection: 0,
			showTip: false,
      diables: false
    };
  },
  created() {
    // this.parentProductIds = this.$route.query.parentProductIds
    // this.flagImage = this.$route.query.flagImage
    // this.key = this.$route.query.key
    // this.userId = this.$route.query.userId
    // console.log(this.parentProductIds,this.flagImage,this.keys)
    this.getHotProduct()
  },
  methods: {
    async getHotProduct() {
      const res = await lineSearchProductList({ platformIds: '3', parentProductName: this.keys,pageSize: 4, userId: this.userId })
      if (res.rows.length > 0) {
        this.hotList = res.rows
      }
    },
    gore() {
      // console.log(111)
      this.diable = false
      this.$parent.fatherMethods();
    },
    goback() {
      this.diable = false
      this.$parent.fatherMethod();
    },
    closeDia() {
			this.simSelection = 0
			this.esimSelection = 0
			this.diables = false
		},
		closeShowTip() {
			this.showTip = false
		},
    selectChoose(key,val) {
			if(key == 'esimSelection') {
				this.esimSelection = val
			}else {
				this.simSelection = val
			}
		},
    godowns(item) {
			this.data = item
      this.diables = true
      // lineUserInfo({ userId: this.userId }).then(res => {
      //   if(res.rows[0].esimSelection == 1 && res.rows[0].simSelection == 1) {
      //     this.diables = false
      //     const variantId = this.data.productLink.split('variant=')[1]
			// 		window.location.href = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.userId}&attributes[line]=line&attributes[userId]=${this.userId}&ref=line`
      //   }else {

      //     this.diables = true
      //   }
      // })
		},
		goShopify() {
			if(this.simSelection == 0 || this.esimSelection == 0) {
				this.showTip = true
				return
			}
			if (this.data.productLink) {
				lineUser({ userId: this.userId}).then(res => {
					const variantId = this.data.productLink.split('variant=')[1]
					const url = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`
					// alert(url)
          window.location.href = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`
				})
			}
		},
    godown(item) {
      const queryParams = {
        parentProductIds: this.parentProductIds,
        startDays: item.startDays,
        endDays: item.endDays,
        type: 1,
        platformIds: 3
      }
      lineProductList(queryParams).then(res => {
        if (res.rows && res.rows.length > 0) {
          // this.$router.push({
          //   path: './productType',
          //   query: { 
          //     'parentProductIds': this.parentProductIds,
          //     'flagImage': this.flagImage,
          //     'startDays': item.startDays,
          //     'endDays': item.endDays,
          //     // 'userId': this.userId,
          //     'keyWords': this.key + item.name
          //   }
          // })
          // this.$parent.isShowProductType();
          let obj = {
            'parentProductIds': this.parentProductIds,
            'flagImage': this.flagImage,
            'startDays': item.startDays,
            'endDays': item.endDays,
            'keyWords': this.keys + item.name,
            'userId': this.userId
          }
          this.$emit('daySon', obj)
        } else {
          this.diable = true
          this.keyWords = item.name
        }
      })

    },

  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .hero {
    width: 100%;
    height: 200px;
    background-color: #FFD457;
    border-radius: 0 0 16px 16px;
    padding: 80px 20px 0 20px;
    position: relative;

    .desc {
      color: #000000;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
    }

    // .himg {
    //   position: absolute;
    //   right: 0;
    //   bottom: 0;
    //   width: 133px;
    //   height: 160px;
    // }
    .topImg {
      position: absolute;
      top: 20px;
      left: 5%;
      width: 90%;
      height: 5px;
    }

    .tim {
      position: absolute;
      bottom: -40px;
      right: 20px;
      width: 50px;
      height: 73px;
    }

    .backClass {
      position: absolute;
      width: 35px;
      height: 35px;
      top: 50px;
      left: 20px;
    }

    // ::v-deep .el-icon-arrow-left {
    //   font-size: 20px;
    // }
  }

  .content {
    width: 100%;
    padding: 20px 20px 0 20px;

    .popular {
      font-size: 16px;
      color: #000000;
      font-weight: bold;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      img {
        width: 60px;
        height: 25px;
        margin-right: 10px;
      }

      span {
        margin-top: -5px;
      }
    }

    .card {
      margin-top: 20px;

      .cardItem {
        width: 100%;
        height: 60px;
        background-color: #fff;
        border-radius: 8px;
        margin-bottom: 16px;
        padding-left: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url('../assets/images/frame13.png');
        background-size: 100% 100%;
        cursor: pointer;

        .name {
          color: #6B7280;
          font-size: 16px;
          // font-weight: bold;
        }
      }
    }

    .hotProduct {
      color: #000;
      font-size: 18px;
      font-weight: bold;
      margin-top: 40px;
      height: 60px;
      line-height: 60px;
      width: 100%;
      text-align: center;
      border-top: 1px solid #C7C7C7;
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
        height: 245px;
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
            // height: 30px;
            // line-height: 30px;
            // margin: 10px 0;
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
            line-height: 30px;
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
  }

  .confirm_card {
    width: 100%;
    position: fixed;
    left: 50%;
    top: 70%;
    transform: translate(-50%, -85%);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .subTit {
      font-size: 20px;
      color: #1A1A1A;
      text-align: center;
      font-weight: bold;
    }

    .subD {
      font-size: 14px;
      color: #1A1A1A;
      // margin-top: 20px;
      text-align: left;
      letter-spacing: 2px;
    }

    .subBtn {
      cursor: pointer;
      width: 60%;
      height: 42px;
      border-radius: 21px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      background: #fff;
      color: #1A1A1A;
      margin-top: 30px;
      box-shadow: 0 2px 4px #FFD457;
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
	//height: 220px;
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

.bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 75, 132, .2);
  }

  .confirm_cards {
    width: 340px;
    //height: 220px;
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
      // width: 276px;
      // height: 20px;
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
</style>