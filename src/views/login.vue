<template>
  <div class="container" v-loading="loading">
    <div v-if="isshow">
      <div class="hero">
        <img src="../assets/images/frame16.png" class="topImg">
        <img src="../assets/images/frame1.png" class="tim">
        <div class="titleBox">
          <div class="title">最適なプランを探す</div>
        </div>
        <div class="autocomplete" >
            <el-input
              type="text"
              v-model="queryParams.parentProductName"
              @input="onInput"
              @blur="handleBlur"
              @focus="handlefocus"
              placeholder="目的地検索"
            />
            <span class="icon" @click="getSearchList"></span>
            <div v-if="suggestions.length > 0" class="suggestions">
              <div
                v-for="suggestion in suggestions"
                :key="suggestion.id"
                @click="selectSuggestion(suggestion)"
                class="suggestion">
                <div>{{ suggestion.productName }}</div>
                <div>{{ suggestion.symbol }} {{ suggestion.unitPrice }}</div>
              </div>
            </div>
            <div v-if="suggestions.length == 0 && isSHowEmpty" class="suggestions">
              <div class="jiaz">ロード中、しばらくお待ちください...</div>
            </div>
          </div>
      </div>
      <div class="content" v-if="!diable">
        <div class="popular">
          <img src="../assets/images/frame9.png">
          <span>人気の目的地</span>
        </div>
        <div class="card">
          <div class="cardItem" v-for="(item, index) in cardList" :key="item.id" @click="godays(item)">
            <img v-if="item.flagImage" :src="item.flagImage" class="pimg">
            <div class="name">{{ item.parentProductName }}</div>
            <!-- <div class="name">シンガポールシンガポール</div> -->
          </div>
        </div>
        <div class="history" v-if="historyList.length > 0">購入履歴</div>
        <div class="hisBox" v-if="historyList">
          <div class="hisCard" v-for="(item,index) in historyList" :key="index">
            <div class="left">
              <img :src="item.flagImage" class="himg">
            </div>
            <div class="proDuct">
              <div class="name">{{ item.country }} eSIM</div>
              <div class="card_desc">
                <img src="../assets/images/Frame8.png">
                <span>{{ item.days}}日間</span>
              </div>
              <div class="desc">{{ item.productName }}</div>
            </div>
            <div class="proPrice">
              <div class="price">
                <div class="pr">{{ item.symbol }}  {{ item.unitPrice }}  </div>
                <div class="rc">(税込)</div>
              </div>
              <div class="pdesc">購入日:{{ item.purchaseTime }}</div>
            </div>
            <div class="box" @click="godown(item)">
              <img src="../assets/images/Frame7.png">
              <div class="bb">再購入</div>
            </div>
          </div>
        </div>
      </div>

    <div class="content1" v-if="parentProductName && hotList.length > 0">
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
              <img v-if="item.productLink" src="../assets/images/Frame7.png" @click="godown(item)">
            </div>
          </div>
        </div>
      </div>
    </div>

      <div class="confirm_card" v-if="diable">
        <div class="subD">「{{ keyWords }}（国・地域）」でご利用可能なeSIMのプランは現在準備中です。</div>
        <div class="subD">発売予定については、LINE公式カスタマーサービスにてお問い合わせください。</div>
        <div class="subBtn" @click="goback">戻  る</div>
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

    <!-- 组件 -->
    <days v-if="isDays" :parentProductIds="parentProductIds" :flagImage="flagImage" :keys="keys" :userId="userId"  @productTypeSon="getProductTypeVal"/>
    <!-- <productType v-if="isProductType" :dayForm="dayForm" @productTypeSon="getProductTypeVal"/> -->
    <products v-if="isProduct" :productTypeForm="productTypeForm" />
  </div>

</template>

<script>
import { countryManageList, parentlistAnonymous,lineSearchProductList,lineUser,buyHistory,lineUserInfo,getHotCountry } from '@/api/tablation'
import days from './days.vue';
import productType from './productType.vue'
import products from './products.vue'
export default {
  components: { days,productType,products },
  data() {
    return {
      countryList: [],
      cardList: [

      ],
      queryParams: {
        pageNum: 1,
        pageSize: 2000,
        parentProductName: '',
        country: '',
        userId: ''
        // orderByColumn: 'isHot',
        // isAsc: 'desc'
      },
      diable: false,
      keyWords: '',
      userId: '',
      // loading: true,
      loading: false,
      parentProductIds: '',
      flagImage: '',
      keys: '',
      isshow: true,
      isDays: false,
      isProductType: false,
      isProduct: false,
      dayForm: {},
      productTypeForm: {},
      suggestions: [],
      historyList: [],
      data: {},
			simSelection: 0,
			esimSelection: 0,
			showTip: false,
      diables: false,
      isSHowEmpty: false,
      hotList: [],
      parentProductName: '',
      days: ''
    };
  },
  created() {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let decodedString = decodeURIComponent(params);
    const parentProductName = decodedString.match(/parentProductName=([^&]*)/);
    const userId = decodedString.match(/userId=([^&]*)/);
    const days = decodedString.match(/days=([^&]*)/);
    if(parentProductName){
      this.parentProductName = parentProductName[1]
    }
    if(userId){
      this.userId = userId[1]
    }
    if(days){
      this.days = days[1]
    }
    this.init()
    this.getHotCountryList()
    this.getHotProduct()
    // this.getbuyHistoryList()
  },

  methods: {
    async init() {
      console.log('liff')
      // 正式环境LineId:2003804589-8E07K6bN 2003804589-Y3o4OJG9
      // 测试环境LineId:2003687931-w55JjYzE
      await liff.init({ liffId: '2003804589-Y3o4OJG9' })
      const res = liff.getContext()
      console.log('liff',liff)
      this.userId = res.userId
      this.queryParams.userId = res.userId
      if(this.userId) {
        this.getbuyHistoryList(this.userId)
      }
    },
    async getHotProduct() {
            const data = {
                platformIds: '3',
                pageSize: 4,
                userId: this.userId,
                parentProductName: this.parentProductName,
                days: this.days
            }
            const res = await lineSearchProductList(data)
            if (res.rows.length > 0) {
                this.hotList = res.rows
            }
        },
    getHotCountryList() {
      getHotCountry({}).then(res => {
        res.data.forEach(item => {
          item.parentProductName = item.japaneseName
        })
        let arr = [
          {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "id": 9,
            "englishName": "Korea",
            "chineseName": "韩国",
            "parentProductName": "韓国",
            "region": "亚洲",
            "flagImage": "https://mp.desim.tech/api/profile/flag/2024/04/12/kr_20240412072514A002.png",
            "isHot": 1
          },
          {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "id": 4,
            "englishName": "Taiwan",
            "chineseName": "中国台湾",
            "parentProductName": "台湾",
            "region": "亚洲",
            "flagImage": "https://mp.desim.tech/api/profile/flag/2024/05/11/tw.webp_20240511101619A001.jpg",
            "isHot": 1
          },
          {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "id": 20,
            "englishName": "Thailand",
            "chineseName": "泰国",
            "parentProductName": "タイ",
            "region": "亚洲",
            "flagImage": "https://mp.desim.tech/api/profile/flag/2024/04/12/th_20240412074529A007.png",
            "isHot": 1
          },
          {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "id": 223,
            "englishName": "USA",
            "chineseName": "美国",
            "parentProductName": "アメリカ",
            "region": "美洲",
            "flagImage": "https://mp.desim.tech/api/profile/flag/2024/05/11/us.webp_20240511101635A002.jpg",
            "isHot": 1
          }
        ]
        this.cardList = [...arr,...res.data]
      })
    },
    async getSearchList() {
      const res = await parentlistAnonymous(this.queryParams)
      const list = res.rows
      const arr = []
      if (list && list.length > 0) {
        list.forEach(item => {
          arr.push(item.id)
        })
        this.parentProductIds = arr.join(',')
        this.flagImage = ''
        this.keys = this.queryParams.parentProductName
        this.isshow = false
        this.isDays = true
        // this.queryParams.parentProductName = ''
        // this.suggestions = []
      } else {
        this.diable = true
        this.keyWords = this.queryParams.parentProductName
      }

    },
    async getbuyHistoryList() {
      const res = await buyHistory({ userId: this.userId })
      if(res.data.length > 0) {
        this.historyList = res.data
      }
    },
    async onInput(value) {
      const query = this.queryParams.parentProductName.toLowerCase();
      const res = await lineSearchProductList({ platformIds: '3',parentProductName: this.queryParams.parentProductName,pageSize: 5,userId: this.userId })
      this.suggestions = res.rows
      if(this.suggestions.length > 0 || value == '') {
        this.isSHowEmpty = false
      }else {
        this.isSHowEmpty = true
      }
    },
    async handlefocus() {
      // console.log(this.queryParams.parentProductName)
      if(this.queryParams.parentProductName) {
        const query = this.queryParams.parentProductName.toLowerCase();
        const res = await lineSearchProductList({ platformIds: '3',parentProductName: this.queryParams.parentProductName,pageSize: 5,userId: this.userId })
        this.suggestions = res.rows
        if(this.suggestions.length > 0 || value == '') {
          this.isSHowEmpty = false
        }else {
          this.isSHowEmpty = true
        }
      }
    },
    handleBlur() {
      this.isSHowEmpty = false
      let that = this
      setTimeout(() => {
        // that.queryParams.parentProductName = ''
        that.suggestions = []
      },500)

    },
    selectSuggestion(suggestion) {
      this.data = suggestion
      this.diables = true
      // this.queryParams.parentProductName = ''
      this.suggestions = [];
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
    godown(item) {
      this.data = item
      this.diables = true

		},
		goShopify() {
			if(this.simSelection == 0 || this.esimSelection == 0) {
				this.showTip = true
				return
			}
			if (this.data.productLink) {
				lineUser({ userId: this.userId}).then(res => {
          this.queryParams.parentProductName = ''
					const variantId = this.data.productLink.split('variant=')[1]
					const url= `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`
          // const variantId = '46534566510824'
          // console.log(this.userId, this.simSelection, this.esimSelection)
					// const url= `https://test78607.myshopify.com/cart/${variantId}:1?storefront=true&note=${this.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`
          // alert(url)
					window.location.href = url
				})
			}
		},
    godays(item) {
      this.queryParams.parentProductName = item.parentProductName
      parentlistAnonymous(this.queryParams).then(res => {
        const list = res.rows
        const arr = []
        if (list && list.length > 0) {
          list.forEach(item => {
            arr.push(item.id)
          })
          this.parentProductIds = arr.join(',')
          this.flagImage = item.flagImage
          this.keys = item.parentProductName
          this.isshow = false
          this.isDays = true
        } else {
          this.diable = true
          this.keyWords = item.parentProductName
        }
      })
    },
    goback() {
      this.diable = false
      this.keyWords = ''
      this.queryParams.parentProductName = ''
    },
    // 获取子组件的值
    getDayVal(obj) {
      this.isshow = false
      this.isDays = false
      this.isProductType = true
      this.dayForm = obj
      // console.log('days页面传递值为---',obj)
    },
    getProductTypeVal(obj) {
      this.isshow = false
      this.isDays = false
      this.isProductType = false
      this.isProduct = true
      this.productTypeForm = obj
      if(this.userId) {
        this.productTypeForm.userId = this.userId
      }
      // console.log('productType页面传递值为---',obj)
    },
    fatherMethod() {
      this.isDays = true
      this.isshow = false

    },
    fatherMethods() {
      this.isDays = false
      this.isshow = true
      this.queryParams.parentProductName = ''
      // this.suggestions = []
    },
    fatherTypeMethod() {
      this.isProductType = false
      this.isshow = true
    },
    fatherProductTypeMethod() {
      this.isDays = true
      this.isProductType = false
    },
    fatherProductMethod() {
      this.isDays = true
      this.isProduct = false
    },
    // isShowProductType() {
    //   this.isshow = false
    //   this.isDays = false
    //   this.isProductType = true
    // },
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  background: #EDF1F7;
  font-family: 'kozuka';
  // padding-bottom: 20px;
  .hero {
    width: 100%;
    height: 200px;
    background-color: #FFD457;
    border-radius: 0 0 16px 16px;
    padding-top: 50px;
    position: relative;
    .titleBox {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;

      .title {
        color: #000000;
        font-size: 24px;
        font-weight: bold;
      }
    }
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
    .autocomplete {
      position: relative;
      // display: inline-block;
      padding: 0 20px;
    }

    // input {
    //   width: 300px;
    //   padding: 10px;
    //   font-size: 16px;
    // }

    .suggestions {
      position: absolute;
      border: 1px solid #d4d4d4;
      border-top: none;
      z-index: 99;
      top: 90%;
      left: 0;
      right: 0;
      background-color: white;
      width: 90%;
      margin: 0 auto;
      border-radius: 0 0 10px 10px;
      padding: 0 10px;
    }

    .suggestion {
      padding: 5px;
      cursor: pointer;
      font-size: 16px;
      color: #9CA3AF;
      display: flex;
      justify-content: space-between;
    }
    .jiaz {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #9CA3AF;
    }
    .suggestion:hover {
      background-color: #e9e9e9;
    }
    .input-with-icon {
      position: relative;
      padding: 0 20px;
    }

    .insty {
      padding-right: 30px;
      /* 留出图标的空间 */
      width: 100%;
      height: 44px;
      border: none;
      border-radius: 10px;
      margin-top: 10px;
      padding-left: 10px;
      font-size: 16px;
      display: flex;
      justify-content: center;
      color: #9CA3AF;
      outline: none;
      box-shadow: 0 2px 4px #FBEB63;
    }
    ::v-deep .el-input--medium .el-input__inner {
      height: 44px;
      line-height: 44px;
      padding-right: 30px;
      width: 100%;
      border-radius: 10px;
      color: #9CA3AF;
      outline: none;
      box-shadow: 0 2px 4px #FBEB63;
      margin-top: 10px;
      padding-left: 10px;
    }
    ::placeholder {
      font-size: 16px;
      color: #9CA3AF;
    }

    .icon {
      content: "";
      position: absolute;
      top: 57%;
      right: 30px;
      transform: translateY(-50%);
      background-image: url("../assets//images/search.png");
      /* 图标的路径 */
      background-size: 24px;
      background-repeat: no-repeat;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
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
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .cardItem {
        width: 48%;
        height: 60px;
        border-radius: 8px;
        margin-bottom: 16px;
        padding-left: 10px;
        display: flex;
        align-items: center;
        background-image: url('../assets/images/frame13.png');
        background-size: 100% 100%;
        cursor: pointer;

        .pimg {
          width: 38.11px;
          height: 30px;
          margin-right: 10px;
          // border-radius: 10px;
          object-fit: cover;
        }

        .name {
          color: #6B7280;
          font-size: 14px;
          font-weight: bold;
          margin-top: -5px;
        }
      }
    }
    .history {
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
    .hisBox {
      width: 100%;
      padding-bottom: 20px;
      .hisCard {
        padding: 0 10px 10px 10px;
        box-sizing: border-box;
        background: #fff;
        // box-shadow: 0 2px 4px #FFD457;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        // justify-self: flex-start;
        background-image: url('../assets/images/frame13.png');
        background-size: 100% 100%;
        // align-items: center;
        margin-bottom: 15px;
        .left {
          margin-top: 10px;
          img {
            width: 38px;
            height: 30px;
            border: 1px solid #ccc;
          }
        }
        .proDuct {
          margin-left: 10px;
          .name {
            color: #000;
            font-size: 16px;
            font-weight: bold;
          }
          .card_desc {
            font-size: 14px;
            color: #4E637E;
            display: flex;
            align-items: center;
            height: 25px;
            img {
              width: 16px;
              height: 16px;
              margin-right: 6px;

            }
          }
          .desc {
            font-size: 12px;
            color: #4E637E;
            height: 20px;
          }
        }
        .proPrice {
          margin-left: 10px;
          .price {
            color: #000;
            font-weight: bold;
            display: flex;
            align-items: center;
            margin-top: 25px;
            .pr {
              font-size: 16px;
            }
            .rc {
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .pdesc {
            font-size: 12px;
            color: #4E637E;
          }
        }
        .box {
          width: 45px;
          height: 55px;
          background: #000;
          border-radius: 5px;
          margin-left: 10px;
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
          }
          .bb {
            font-size: 10px;
            color: #fff;
            font-weight: bold;
            margin-top: -10px;
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
  transform: translate(-50%, -66%);
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
    text-align: center;
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
  .content1 {
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
      border-top: 1px solid #d5d6da;
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
  }
</style>
