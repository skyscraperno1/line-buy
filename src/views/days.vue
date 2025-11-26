<template>
  <div class="container">
    <div class="hero">
      <progress-bar :activeStep="2" />
      <arrow-back
        :onClick="gore"
        style="margin-top: 12px; margin-bottom: -6px"
      />
      <div class="desc">現地での滞在日数は？</div>
      <img src="../assets/images/frame1.png" class="tim" />
    </div>
    <div class="content" v-if="!diable">
      <div class="popular">
        <div class="step-wrapper">STEP2</div>
      </div>
      <div class="chosen-item">
        <img :src="flagImage" />
        <div>{{ keys }}</div>
      </div>
      <div class="unchosen-item">滞在日数</div>
      <div class="card">
        <div class="cardItem">
          <div class="select-container">
            <select
              v-model="selectedDays"
              class="days-select"
              @change="handleDaysChange"
            >
              <option value="" disabled>滞在日数を選択してください</option>
              <option v-for="day in daysList" :key="day" :value="day">
                {{ day }}日間
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="hotProduct" v-if="hotList.length">HOT商品</div>
      <div class="esimCard" v-if="hotList.length">
        <div
          class="esimCardItem"
          v-for="(item, index) in hotList"
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
            <button class="product-btn" @click="godowns(item)">購入</button>
          </div>
        </div>
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
import {
  lineProductList,
  lineSearchProductList,
  getDaysByCountry,
  lineUser,
} from "@/api/tablation";
import ProgressBar from "@/components/ProgressBar/index.vue";
import ArrowBack from "@/components/ArrowBack/index.vue";

export default {
  components: { ProgressBar, ArrowBack },
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
    },
  },
  data() {
    return {
      daysList: [],
      selectedDays: "",
      // parentProductIds: '',
      // flagImage: '',
      cardList: [
        { id: 1, name: "3日間以内", startDays: 1, endDays: 3 },
        { id: 2, name: "7日間以内", startDays: 4, endDays: 7 },
        { id: 3, name: "15日間以内", startDays: 8, endDays: 15 },
        { id: 4, name: "30日間以内", startDays: 16, endDays: 30 },
      ],
      diable: false,
      keyWords: "",
      hotList: [],
      data: {},
      simSelection: 1,
      esimSelection: 1,
    };
  },
  created() {
    // this.parentProductIds = this.$route.query.parentProductIds
    // this.flagImage = this.$route.query.flagImage
    // this.key = this.$route.query.key
    // this.userId = this.$route.query.userId
    // console.log(this.parentProductIds,this.flagImage,this.keys)
    this.getHotProduct();
    this.getDays();
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
    async getHotProduct() {
      const res = await lineSearchProductList({
        platformIds: "3",
        parentProductName: this.keys,
        pageSize: 4,
        userId: this.userId,
      });
      if (res.rows.length > 0) {
        this.hotList = res.rows;
      }
    },
    async getDays() {
      const res = await getDaysByCountry(this.keys);
      this.daysList = res.data;
    },
    gore() {
      this.diable = false
      this.$parent.fatherMethods();
    },
    goback() {
      this.diable = false
      this.$parent.fatherMethod();
    },
   
    godowns(item) {
      this.data = item;
      this.goShopify()
    },
    goShopify() {
      if (this.data.productLink) {
        lineUser({ userId: this.userId }).then((res) => {
          const variantId = this.data.productLink.split("variant=")[1];
          const url = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`;
          // alert(url)
          window.location.href = `https://jp.shop.desim.tech/cart/${variantId}:1?storefront=true&note=${this.userId}&attributes[simSelection]=${this.simSelection}&attributes[esimSelection]=${this.esimSelection}&ref=line`;
        });
      }
    },
    handleDaysChange() {
      const item = {
        startDays: this.selectedDays,
        endDays: this.selectedDays,
        name: `${this.selectedDays}日間`,
      };
      this.godown(item);
    },
    godown(item) {
      const queryParams = {
        parentProductIds: this.parentProductIds,
        startDays: item.startDays,
        endDays: item.endDays,
        type: 1,
        platformIds: 3,
      };
      lineProductList(queryParams).then((res) => {
        if (res.rows && res.rows.length > 0) {
          let obj = {
            parentProductIds: this.parentProductIds,
            flagImage: this.flagImage,
            startDays: item.startDays,
            endDays: item.endDays,
            keyWords: this.keys + item.name,
            userId: this.userId,
          };
          this.$emit("productTypeSon", obj);
        } else {
          this.diable = true;
          this.keyWords = item.name;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

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

    .tim {
      position: absolute;
      bottom: -46px;
      right: 20px;
      width: 58px;
      height: 77px;
    }

    .backClass {
      position: absolute;
      width: 35px;
      height: 35px;
      top: 50px;
      left: 20px;
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
    .unchosen-item {
      margin: 30px 0;
      text-align: center;
      color: #000;
      text-align: center;
      font-family: "Noto Sans JP";
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
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
        border-bottom: 3px solid #FFD457;

        .name {
          color: #6b7280;
          font-size: 16px;
          // font-weight: bold;
        }
      }
    }

    .hotProduct {
      font-family: "Noto Sans JP";
      color: #000;
      font-weight: 700;
      margin-top: 30px;
      padding-top: 30px;
      padding-bottom: 30px;
      width: 100%;
      font-size: 16px;
      text-align: center;
      border-top: 1px solid #c7c7c7;
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
      color: #1a1a1a;
      text-align: center;
      font-weight: bold;
    }

    .subD {
      font-size: 14px;
      color: #1a1a1a;
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
      color: #1a1a1a;
      margin-top: 30px;
      box-shadow: 0 2px 4px #ffd457;
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

.select-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.days-select {
  width: 100%;
  height: 40px;
  font-family: "Noto Sans JP";
  border: none;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 16px;
  color: #6b7280;
  background-color: transparent;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 22px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
}
</style>
