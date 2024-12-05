<template>
    <div class="container">
      <div class="hero">
        <img src="../assets/images/frame18.png" class="topImg">
        <div class="desc">どのようなシーンで<br>インターネットを利用する？</div>
        <img src="../assets/images/frame1.png" class="himg">
				<!-- <div class="popular">好み(3/4)</div> -->
        <!-- <el-button type="primary" icon="el-icon-arrow-left" size="mini" class="backClass" @click="gore"></el-button> -->
        <img src="../assets/images/frame11.png" class="backClass" @click="gore">
      </div>
      <div class="content" v-if="!diable">
        <div class="popular">
          <img src="../assets/images/frame14.png">
          <span>利用シーン</span>
        </div>
        <div class="card">
          <div class="cardItem" v-for="(item, index) in cardList" :key="item.id" @click="godown(item)">
            <div class="name">{{ item.name1 }}</div>
            <div class="name">{{ item.name2 }}</div>
          </div>
        </div>
      </div>
    <div class="confirm_card" v-if="diable">
      <div class="subD">{{ this.form.keyWords }} のeSIM商品は準備中。</div>
      <div class="subD">ご購入ついて</div>
      <div class="subD">カスタマーサービスにお問い合わせしてく</div>
      <div class="subD">ださい。</div>
      <div class="subBtn" @click="goback">戻  る</div>
    </div>
    </div>
  </template>
  
  <script>
  import { lineProductList } from '@/api/tablation'
  export default {
    props: {
      dayForm: {
        type: Object
      }
    },
    data() {
      return {
				form: {},
        cardList: [
          {
						name1: `LINEアプリなどでやりとりがメインなの`,
						name2: `で、最低限のネット環境でOK`,
						productType: 3,
					},
					{
						name1: `地図アプリやネット検索をよく使う`,
						name2: ``,
						productType: 2,
					},
					{
						name1: `SNSに写真をアップしたり、動画も楽しみ`,
						name2: `たい`,
						productType: 1,
					},
				],
        diable: false,
        keyWords: ''
      };
    },
    created() {
			// console.log(this.$route.query)
			// this.form = this.$route.query
      this.form = this.dayForm
			// console.log(this.form,11313)
    },
    methods: {
      gore() {
        this.diable = false
        this.$parent.fatherProductTypeMethod();
      },
      goback() {
        this.diable = false
        // this.$parent.fatherTypeMethod();
      },
      godown(item) {
				this.form.productType = item.productType
        const queryParams = {
          parentProductIds: this.form.parentProductIds,
          startDays: this.form.startDays,
          endDays: this.form.endDays,
          productType: item.productType,
          type: 1,
          platformIds: 3
        }
        lineProductList(queryParams).then(res => {
          if(res.rows && res.rows.length > 0) {
            // this.$router.push({
            //   path: './products',
            //   query: {
            //     data: JSON.stringify(this.form)
            //   }
            // })
            this.$emit('productTypeSon',this.form)
          }else {
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
    height: 100vh;
    box-sizing: border-box;
		background-color: #EFF3F8;
    .hero {
      width: 100%;
      height: 200px;
      background-color: #FFD457;
      border-radius: 0 0 16px 16px;
      padding: 55px 20px 0 20px;
      position: relative;
      .desc {
        color: #000000;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
      }
      .topImg {
        position: absolute;
        top: 20px;
        left: 5%;
        width: 90%;
        height: 5px;
      }
      .himg {
        position: absolute;
        bottom: -40px;
        right: 20px;
        width: 50px;
        height: 73px;
      }
			// .popular {
			// 	position: absolute;
			// 	color: #004B84;
			// 	font-size: 20px;
			// 	right: 25px;
			// 	bottom: 2px;
			// }
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
			.card{
				width: 100%;
			}
			.cardItem {
        background-image: url('../assets/images/frame13.png');
        background-size: 100% 100%;
				// background-image: url("../assets/images/frame2.png");
				width: 100%;
				height: 100px;
				// background-size: 100%;
				// background-repeat: no-repeat;
				margin: 20px auto;
				display: flex;
				flex-direction: column;
				justify-content: center;
        cursor: pointer;
				.name {
					color: #6B7280;
					font-size: 18px;
					text-align: center;
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
  </style>