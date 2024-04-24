<template>
	<div class="container">
		<div class="hero">
			<div class="desc">おすすめプランは<br>こちら</div>
			<!-- <img src="../assets/images/flag4.png" class="himg"> -->
		</div>
		<div class="esimCard">
			<div class="esimCardItem" v-for="(item,index) in cardList" :key="index">
				<div class="cont">
					<div class="imgdiv"><img :src="form.flagImage" class="nationalIcon"></div>
					<div class="card_title">{{ item.country }} eSIM</div>
					<div class="card_desc">
						<img src="../assets/images/Frame8.png" >
						<!-- <span v-if="item.days == 1">1Day</span> -->
						<span>{{ item.days }}日間</span>
					</div>
					<div class="card_sub">{{ item.productName }}</div>
					<div class="unlimited">
						<div class="unides">
							<span style="margin-right: 5px;">{{ item.symbol }}</span>
							<span >{{ item.unitPrice.toLocaleString() }}  (税込)</span>
						</div>
						<img src="../assets/images/Frame7.png" @click="godown(item)">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { lineProductList } from '@/api/tablation'
export default {
	data() {
		return {
			form: {},
			cardList: []
		};
	},
	created() {
		// console.log(this.$route.query)
		this.form = JSON.parse(this.$route.query.data)
		console.log(this.form)
		this.getProducts()
	},
	methods: {
		async getProducts() {
			this.cardList = []
			let queryParams = {
				country: this.form.country,
				startDays: this.form.startDays,
				endDays: this.form.endDays,
				productType: this.form.productType,
				type: 1,
				platformIds: 3
			}
			const res = await lineProductList(queryParams)
			this.cardList = res.rows
		},
		godown(item) {
			window.location.href = item.productLink
		},
	}
};
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	// height: 100%;
	min-height: 100%;
	// padding: 10% 0;
	box-sizing: border-box;
	font-family: 'Conthrax';
	background-color: #EFF3F8;

	.hero {
		width: 100%;
		height: 200px;
		background-color: #6EBFFF;
		border-radius: 0 0 16px 16px;
		padding: 30px 20px 0 20px;
		position: relative;

		.desc {
			color: #FAFCFE;
			font-size: 36px;
		}

		.himg {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 133px;
			height: 160px;
		}
	}
	.esimCard {
		display: flex;
		justify-content: space-between;
		// margin-top: 32px;
		flex-wrap: wrap;
		width: 92%;
		margin: 30px auto;
		.esimCardItem {
			flex-basis: 48%;
  		box-sizing: border-box;
			background-image: url(../assets/images/frame5.png);
			background-size: 100%, 100%;
			width: 155px;
			height: 200px;
			margin-bottom: 20px;
			position: relative;
			padding: 15px 10px;
			.cont {
				position: absolute;
				width: 90%;
				.imgdiv {
					width: 57px;
					height: 42.84px;
					border: 1px solid #EFF3F8;
					border-radius: 10px;
					.nationalIcon {
						width: 55px;
						height: 42.84px;
						object-fit: cover;
					}
				}
				
				.card_title {
					font-size: 14px;
					font-weight: bold;
					color: #1A1A1A;
					margin: 10px 0;
				}
				.card_desc {
					font-size: 12px;
					color: #4E637E;
					display: flex;
					align-items: center;
					img {
						width: 20px;
						height: 20px;
						margin-right: 6px;
						
					}
				}
				.card_sub {
					font-size: 12px;
					color: #1A1A1A;
					// height: 30px;
					// line-height: 15px;
					margin: 10px 0;
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
						color: #111921;
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