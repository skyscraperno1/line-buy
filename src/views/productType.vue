<template>
    <div class="container">
      <div class="hero">
        <div class="desc">どのようなシーンで<br>インターネットを利<br>用する？</div>
        <img src="../assets/images/frame1.png" class="himg">
				<div class="popular">好み(3/4)</div>
      </div>
      <div class="content">
        <div class="card">
          <div class="cardItem" v-for="(item, index) in cardList" :key="item.id" @click="godown(item)">
            <div class="name">{{ item.name1 }}</div>
            <div class="name">{{ item.name2 }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
				form: {},
        cardList: [
					{
						name1: `LINEアプリなどでやりとりがメイン`,
						name2: `なので、最低限のネット環境でOK`,
						productType: 3,
					},
					{
						name1: `地図アプリやネット検索をよく使う`,
						name2: ``,
						productType: 2,
					},
					{
						name1: `SNSに写真をアップしたり、`,
						name2: `動画も楽しみたい`,
						productType: 1,
					}
				]
      };
    },
    created() {
			// console.log(this.$route.query)
			this.form = this.$route.query
			console.log(this.form)
    },
    methods: {
      godown(item) {
				this.form.productType = item.productType
        this.$router.push({
          path: './products',
          query: {
						data: JSON.stringify(this.form)
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
    // padding: 10% 0;
    box-sizing: border-box;
    font-family: 'Conthrax';
		background-color: #EFF3F8;
    .hero {
      width: 100%;
      height: 200px;
      background-color: #6EBFFF;
      border-radius: 0 0 16px 16px;
      padding: 20px 20px 0 20px;
      position: relative;
      .desc {
        color: #FAFCFE;
        font-size: 34px;
				line-height: 50px;
      }
      .himg {
        position: absolute;
        right: 40px;
        bottom: 40px;
        width: 37px;
        height: 50px;
      }
			.popular {
				position: absolute;
				color: #004B84;
				font-size: 20px;
				right: 25px;
				bottom: 2px;
			}
    }
		.content {
			width: 100%;
			
			.card{
				width: 100%;
			}
			.cardItem {
				background-image: url("../assets/images/frame2.png");
				width: 90%;
				height: 120px;
				background-size: 100%;
				background-repeat: no-repeat;
				margin: 20px auto;
				display: flex;
				flex-direction: column;
				justify-content: center;
        cursor: pointer;
				.name {
					color: #004B84;
					font-size: 20px;
					text-align: center;
				}
			}
		}
  }
  </style>