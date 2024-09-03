<template>
	<div class="container">
		<div class="hero">
			<img src="../assets/images/frame19.png" class="topImg">
			<div class="desc">おすすめプランはこちら</div>
			<!-- <el-button type="primary" icon="el-icon-arrow-left" size="mini" class="backClass" @click="gore"></el-button> -->
			<img src="../assets/images/frame11.png" class="backClass" @click="gore">
			<img src="../assets/images/frame1.png" class="himg">
		</div>
		<div class="esimCard">
			<div class="esimCardItem" v-for="(item, index) in cardList" :key="index">
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
							<span>{{ item.unitPrice.toLocaleString() }} </span><span style="font-size: 12px;font-weight: bold;">(税込)</span>
						</div>
						<img v-if="item.productLink" src="../assets/images/Frame7.png" @click="godown(item)">
					</div>
				</div>
			</div>
		</div>
		<div class="bg" v-if="diable">
			<div class="confirm_card">
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
import { lineProductList, lineUser, lineUserInfo } from '@/api/tablation'
export default {
	props: {
		productTypeForm: {
			type: Object
		}
	},
	data() {
		return {
			form: {},
			cardList: [],
			diable: false,
			email: '',
			channelUserChatId: '',
			data: {},
			simSelection: 0,
			esimSelection: 0,
			showTip: false
		};
	},
	created() {
		this.form = this.productTypeForm
		setTimeout(() => {
			this.getlineUserInfo()
		}, 1000)
		this.getProducts()
	},
	methods: {
		gore() {
			this.diable = false
			this.$parent.fatherProductMethod();
		},
		closeDia() {
			this.simSelection = 0
			this.esimSelection = 0
			this.diable = false
		},
		closeShowTip() {
			this.showTip = false
		},
		async getProducts() {
			this.cardList = []
			let queryParams = {
				parentProductIds: this.form.parentProductIds,
				startDays: this.form.startDays,
				endDays: this.form.endDays,
				productType: this.form.productType,
				type: 1,
				platformIds: 3,
				orderByColumn: 'days,`usage`',
				isAsc: 'asc',
			}
			const res = await lineProductList(queryParams)
			this.cardList = res.rows
		},
		selectChoose(key,val) {
			if(key == 'esimSelection') {
				this.esimSelection = val
			}else {
				this.simSelection = val
			}
		},
		getlineUserInfo() {
			lineUserInfo({ userId: this.form.userId }).then(res => {
				if (res.code == 200) {
					if (res.rows && res.rows.length > 0) {
						this.email = res.rows[0].email
						this.channelUserChatId = res.rows[0].channelUserChatId
						// alert(this.channelUserChatId,11111)
						if (this.channelUserChatId == '' || this.channelUserChatId == null) {
							// liff.sendMessages([{ type: "text", text: "スタート" }]).then(() => { console.log("message sent") }).catch((err) => { console.log("error", err) });
							// liff.sendMessages([
							// 	{
							// 		type: "image",
							// 		originalContentUrl: "https://mp.desim.tech/api/profile/qrcodes/c54dd4e6-636b-4a45-9947-dbe5ec3b4ea7.png",
							// 		previewImageUrl: "https://mp.desim.tech/api/profile/qrcodes/c54dd4e6-636b-4a45-9947-dbe5ec3b4ea7.png"
							// 	}
							// ]).then(() => { console.log("message sent") }).catch((err) => { console.log("error", err) });
						}
					} else {
						if (this.channelUserChatId == '' || this.channelUserChatId == null) {
							// liff.sendMessages([{ type: "text", text: "スタート" }]).then(() => { console.log("message sent") }).catch((err) => { console.log("error", err) });
						}

					}

				}
			})
		},
		godown(item) {
			this.data = item
			this.diable = true
      // lineUserInfo({ userId: this.form.userId }).then(res => {
      //   if(res.rows[0].esimSelection == 1 && res.rows[0].simSelection == 1) {
			// 		this.diable = false
      //     const variantId = this.data.productLink.split('variant=')[1]
			// 		window.location.href = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.form.userId}&attributes[line]=line&attributes[userId]=${this.form.userId}&ref=line`
      //   }else {
      //     this.diable = true
      //   }
      // })
		},
		goShopify() {
			if(this.simSelection == 0 || this.esimSelection == 0) {
				this.showTip = true
				return
			}
			if (this.data.productLink) {
				lineUser({ userId: this.form.userId}).then(res => {
					this.diable = false
					const variantId = this.data.productLink.split('variant=')[1]
					const url = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.form.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`
					// alert(url)
					window.location.href = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.form.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`
				})
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	min-height: 100vh;
	box-sizing: border-box;
	background-color: #EFF3F8;

	.hero {
		width: 100%;
		height: 200px;
		background-color: #FFD457;
		border-radius: 0 0 16px 16px;
		padding: 70px 20px 0 20px;
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

		.backClass {
			position: absolute;
			width: 35px;
			height: 35px;
			top: 50px;
			left: 20px; 
		}

		::v-deep .el-icon-arrow-left {
			font-size: 20px;
		}
	}

	.esimCard {
		display: flex;
		justify-content: space-between;
		// margin-top: 32px;
		flex-wrap: wrap;
		width: 92%;
		margin: 30px auto 0 auto;

		.esimCardItem {
			flex-basis: 48%;
			box-sizing: border-box;
			background-image: url(../assets/images/frame15.png);
			background-size: 100%, 100%;
			width: 155px;
			min-height: 250px;
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
						font-size: 14px;
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

.bg {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 75, 132, .2);
}

.confirm_card {
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
	// .subBtn {
	// 	cursor: pointer;
	// 	width: 60%;
	// 	height: 42px;
	// 	border-radius: 21px;
	// 	display: flex;
	// 	justify-content: center;
	// 	align-items: center;
	// 	font-size: 16px;
	// 	font-weight: bold;
	// 	background: #eee;
	// 	color: #1A1A1A;
	// 	margin-top: 30px;
	// }
}

// .inputSty {
// 	width: 100%;
// 	height: 40px;
// 	border-radius: 5px;
// 	border: 1px solid #1A1A1A;
// 	padding-left: 12px;
// 	margin: 10px 0;
// }

// .inputSty:focus {
// 	border: none;
// 	outline: 1px solid red;
// }
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