<template>
  <div class="container">
    <div class="hero">
      <progress-bar :activeStep="3" />
      <arrow-back
        :onClick="gore"
        style="margin-top: 12px; margin-bottom: -6px"
      />
      <div class="desc">おすすめプランはこちら</div>
      <img src="../assets/images/frame1.png" class="himg" />
    </div>
    <div class="content">
      <div class="popular">
        <div class="step-wrapper">STEP3</div>
      </div>
      <div class="chosen-item">
        <img :src="flagImage" />
        <div>{{ keys }}</div>
      </div>
      <div class="chosen-item" style="margin-top: 5px">
        <div class="choose-label">滞在日数</div>
        <div class="choose-value">{{ form.startDays }}日間</div>
      </div>
      <div class="hotProduct" v-if="cardList.length">HOT商品</div>
      <div class="esimCard" v-if="cardList">
        <div
          class="esimCardItem"
          v-for="(item, index) in cardList.slice(0, 3)"
          :key="index"
          :class="{ 'unlimited-card': index === 0 }"
        >
          <div class="left-image">
            <img :src="getShowImage(item)" @error="handleImageError($event, item)"/>
          </div>
          <div class="right-text">
            <div class="product-title">{{ item.productName }}</div>
            <div class="product-days">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M13.5499 7.08988C13.5499 10.6599 10.6599 13.5499 7.08989 13.5499C3.51989 13.5499 0.629883 10.6599 0.629883 7.08988C0.629883 3.51988 3.51989 0.629883 7.08989 0.629883C10.6599 0.629883 13.5499 3.51988 13.5499 7.08988Z"
                    stroke="#6B7280"
                    stroke-width="1.26"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.47961 8.29986L6.84961 6.72986V3.34985"
                    stroke="#6B7280"
                    stroke-width="1.26"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div>{{ item.days }}日間</div>
            </div>
            <div class="product-price">
              {{ item.symbol }}{{ item.unitPrice.toLocaleString() }}
              <span>(税込)</span>
            </div>
            <button class="product-btn" @click="godown(item)">購入</button>
          </div>
        </div>
        <div class="hotProduct otherProduct" v-if="cardList.length">
          その他のプラン
        </div>
        <div class="otherProductList" v-if="cardList">
          <div
            class="otherProductItem"
            v-for="(item, index) in cardList.slice(3)"
            :key="index"
          >
            <div class="otherProductItem-image">
              <img :src="item.flagImage" />
            </div>
            <div class="otherProductItem-title">{{ item.productName }}</div>
            <div class="otherProductItem-days">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M13.5499 7.08988C13.5499 10.6599 10.6599 13.5499 7.08989 13.5499C3.51989 13.5499 0.629883 10.6599 0.629883 7.08988C0.629883 3.51988 3.51989 0.629883 7.08989 0.629883C10.6599 0.629883 13.5499 3.51988 13.5499 7.08988Z"
                    stroke="#6B7280"
                    stroke-width="1.26"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.47961 8.29986L6.84961 6.72986V3.34985"
                    stroke="#6B7280"
                    stroke-width="1.26"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div>{{ item.days }}日間</div>
            </div>
            <div class="product-price otherProductItem-price">
              {{ item.symbol }}{{ item.unitPrice.toLocaleString() }}
              <span>(税込)</span>
            </div>
            <div class="product-btn" @click="godown(item)">購入</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lineProductList, lineUser, lineUserInfo } from "@/api/tablation";
import ProgressBar from "@/components/ProgressBar/index.vue";
import ArrowBack from "@/components/ArrowBack/index.vue";
export default {
  components: { ProgressBar, ArrowBack },
  props: {
    productTypeForm: {
      type: Object,
    },
    flagImage: {
      type: String,
    },
    keys: {
      type: String,
    },
  },
  data() {
    return {
      form: {},
      cardList: [],
      email: "",
      channelUserChatId: "",
      data: {},
      simSelection: 1,
      esimSelection: 1,
    };
  },
  created() {
    this.form = this.productTypeForm;
    setTimeout(() => {
      this.getlineUserInfo();
    }, 1000);
    this.getProducts();
  },
  methods: {
    handleImageError(e, item) {
      e.target.src = item.flagImage
    },
    getShowImage(item) {
      if (item.productImage) {
        if (item.productImage.includes(',')) {
          return item.productImage.split(',')[0]
        } else {
          return item.productImage
        }
      } else {
        return item.flagImage
      }
    },
    gore() {
      this.$parent.fatherProductMethod();
    },
  
    async getProducts() {
      this.cardList = [];
      let queryParams = {
        parentProductIds: this.form.parentProductIds,
        startDays: this.form.startDays,
        endDays: this.form.endDays,
        productType: this.form.productType,
        type: 1,
        platformIds: 3,
        orderByColumn: "productType, days,`usage`",
        isAsc: "asc",
      };
      const res = await lineProductList(queryParams);
      this.cardList = res.rows;
    },
    getlineUserInfo() {
      lineUserInfo({ userId: this.form.userId }).then((res) => {
        if (res.code == 200) {
          if (res.rows && res.rows.length > 0) {
            this.email = res.rows[0].email;
            this.channelUserChatId = res.rows[0].channelUserChatId;
            // alert(this.channelUserChatId,11111)
            if (
              this.channelUserChatId == "" ||
              this.channelUserChatId == null
            ) {
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
            if (
              this.channelUserChatId == "" ||
              this.channelUserChatId == null
            ) {
              // liff.sendMessages([{ type: "text", text: "スタート" }]).then(() => { console.log("message sent") }).catch((err) => { console.log("error", err) });
            }
          }
        }
      });
    },
    godown(item) {
      this.data = item;
      this.goShopify()
    },
    goShopify() {
      debugger
      if (this.data.productLink) {
        lineUser({ userId: this.form.userId }).then((res) => {
          const variantId = this.data.productLink.split("variant=")[1];
          const url = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.form.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`
					// alert(url)
          window.location.href = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.form.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #eff3f8;

  .hero {
    width: 100%;
    height: 161px;
    background-color: #ffd457;
    border-radius: 0 0 16px 16px;
    padding: 18.75px 20px 0 20px;
    position: relative;

    .desc {
      color: #000;
      text-align: center;
      font-family: "Noto Sans JP";
      font-size: 25px;
      font-weight: 700;
      line-height: normal;
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
      bottom: -46px;
      right: 20px;
      width: 58px;
      height: 77px;
    }

    ::v-deep .el-icon-arrow-left {
      font-size: 20px;
    }
  }

  .content {
    width: 100%;
    padding: 20px 20px 0 20px;

    .popular {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 30px;
      .step-wrapper {
        display: flex;
        width: 100px;
        height: 27px;
        padding: 6px 27px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        border-radius: 7px;
        background: #24acf2;
        color: #fff;
        text-align: center;
        font-family: "Noto Sans JP";
        font-size: 13.75px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }

    .chosen-item {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      min-height: 50px;
      padding: 8px 9px;
      width: 100%;
      background: #fff;
      .choose-label {
        color: #6b7280;
        font-family: "Noto Sans JP";
        font-size: 10px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        position: absolute;
        left: 9px;
      }
      .choose-value {
        color: #000;
        font-family: "Noto Sans JP";
        font-size: 15px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      img {
        position: absolute;
        width: 50px;
        height: 34px;
        object-fit: cover;
        border: 0.5px solid #e3e3e3;
        left: 9px;
      }
      div {
        color: #000;
        font-family: "Noto Sans JP";
        font-size: 15px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
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
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: 100% 100%;
        cursor: pointer;
        border-bottom: 3px solid #ffd457;

        .name {
          color: #6b7280;
          font-size: 16px;
          // font-weight: bold;
        }
      }
    }

    .esimCard {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      gap: 15px;
      padding-bottom: 30px;
      .esimCardItem {
        width: 100%;
        padding: 15px 10px;
        display: flex;
        background: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 15px;

        .left-image {
          width: 140px;
          height: 140px;
          img {
            width: 140px;
            height: 140px;
            object-fit: cover;
          }
        }
        .right-text {
          color: #000;
          font-family: "Noto Sans JP";
          display: flex;
          flex-direction: column;
          gap: 11px;
          flex: 1;
          .product-title {
            font-size: 12px;
            line-height: 14px;
            font-weight: 700;
          }
          .product-days {
            color: #6b7280;
            font-size: 12px;
            font-weight: 500;
            line-height: 15px;
            display: flex;
            gap: 5px;
            align-items: center;
            div {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
    .product-price {
      font-size: 22px;
      line-height: 26px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      span {
        font-size: 10px;
        line-height: 12px;
      }
    }
    .product-btn {
      width: 100%;
      cursor: pointer;
      color: #fff;
      border-radius: 5px;
      font-family: "Noto Sans JP";
      font-size: 12px;
      font-weight: 700;
      background: #e3222a;
      border: none;
      border-bottom: 3.32px solid #900000;
      display: flex;
      height: 41.64px;
      padding: 12px 26px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      align-self: stretch;
      &:active {
        border-bottom: 1px solid #900000;
      }
    }
    .unlimited-card {
      position: relative;
      border: 1px solid #e3222a;
      border-radius: 0 0 8px 8px;
      margin-top: 40px;
      &::before {
        text-align: center;
        color: #fff;
        line-height: 40px;
        color: #fff;
        font-family: Inter;
        font-size: 14px;
        font-weight: 700;
        content: "データ無制限だから好きなだけ使える！";
        position: absolute;
        top: -40px;
        left: -1px;
        width: calc(100% + 2px);
        height: 40px;
        background: #e3222a;
        border-radius: 16px 16px 0 0;
      }
      &::after {
        background-image: url("../assets/images/crown.svg");
        position: absolute;
        content: "";
        width: 34.23px;
        height: 27px;
        top: -56px;
        right: 0;
      }
    }
  }

  .hotProduct {
    font-family: "Noto Sans JP";
    color: #000;
    font-weight: 700;
    padding-top: 30px;
    padding-bottom: 30px;
    width: 100%;
    font-size: 16px;
    text-align: center;
  }

  .otherProduct {
    border-top: 1px solid #c7c7c7;
    padding-bottom: 15px;
  }

  .otherProductList {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    .otherProductItem {
      width: calc(50% - 7.5px);
      padding: 10px 11px;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      .otherProductItem-image {
        width: 100%;
        height: 140px;
        img {
          width: 100%;
          height: 140px;
        }
      }
      .otherProductItem-title {
        color: #6b7280;
        line-height: 15px;
        font-family: "Noto Sans JP";
        font-size: 12px;
        min-height: 33px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        width: 100%;
      }
      .otherProductItem-days {
        display: flex;
        align-items: center;
        height: 15px;
        gap: 5px;
        width: 100%;
        color: #6b7280;
        line-height: 15px;
        font-family: "Noto Sans JP";
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        div {
          height: 15px;
        }
      }
      .otherProductItem-price {
        width: 100%;
        font-family: "Noto Sans JP";
      }
    }
  }
  .esimCard {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    gap: 15px;
    padding-bottom: 30px;
    .esimCardItem {
      width: 100%;
      padding: 15px 10px;
      display: flex;
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 15px;

      .left-image {
        width: 140px;
        height: 140px;
        img {
          width: 140px;
          height: 140px;
          object-fit: cover;
        }
      }
      .right-text {
        color: #000;
        font-family: "Noto Sans JP";
        display: flex;
        flex-direction: column;
        gap: 11px;
        flex: 1;
        .product-title {
          font-size: 12px;
          line-height: 14px;
          font-weight: 700;
        }
        .product-days {
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
          line-height: 15px;
          display: flex;
          gap: 5px;
          align-items: center;
          div {
            display: flex;
            align-items: center;
          }
        }
        .product-price {
          font-size: 22px;
          line-height: 26px;
          font-style: normal;
          font-weight: 900;
          line-height: normal;
          span {
            font-size: 10px;
            line-height: 12px;
          }
        }
        .product-btn {
          width: 100%;
          color: #fff;
          border-radius: 5px;
          background: #e3222a;
          border: none;
          border-bottom: 3.32px solid #900000;
          display: flex;
          height: 41.64px;
          padding: 12px 26px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          align-self: stretch;
          &:active {
            border-bottom: 1px solid #900000;
          }
        }
      }
    }
  }
  .unlimited-card {
    position: relative;
    border: 1px solid #e3222a;
    border-radius: 0 0 8px 8px;
    margin-top: 40px;
    &::before {
      text-align: center;
      color: #fff;
      line-height: 40px;
      color: #fff;
      font-family: Inter;
      font-size: 14px;
      font-weight: 700;
      content: "データ無制限だから好きなだけ使える！";
      position: absolute;
      top: -40px;
      left: -1px;
      width: calc(100% + 2px);
      height: 40px;
      background: #e3222a;
      border-radius: 16px 16px 0 0;
    }
    &::after {
      background-image: url("../assets/images/crown.svg");
      position: absolute;
      content: "";
      width: 34.23px;
      height: 27px;
      top: -56px;
      right: 0;
    }
  }
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 75, 132, 0.2);
}

.confirm_card {
  width: 340px;
  //height: 220px;
  background: #fafcfe;
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
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }

  .subD {
    font-size: 16px;
    font-weight: bold;
    color: #6b7280;
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
  background: rgba(0, 75, 132, 0.2);
}

.confirm_cards {
  width: 340px;
  //height: 220px;
  background: #fafcfe;
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
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }

  .subDs {
    font-size: 14px;
    color: #1a1a1a;
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
    background: #004b84;
    color: #fafcfe;
    margin-top: 30px;
  }
}
</style>
