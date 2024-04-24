<template>
    <div class="container">
      <div class="hero">
        <div class="titleBox">
          <div class="title">最適なプランを探す</div>
          <img src="../assets/images/frame1.png" class="tim">
        </div>
        <div class="input-with-icon">
          <input type="text" v-model="queryParams.japaneseName" placeholder="目的地検索">
          <span class="icon" @click="getCountryList"></span>
        </div>
      </div>
      <div class="content">
        <div class="popular">人気の目的地 (1/4)</div>
        <div class="card">
          <div class="cardItem" v-for="(item, index) in cardList" :key="item.id" @click="godays(item)">
            <img :src="item.flagImage" class="pimg" >
            <div class="name">{{ item.japaneseName }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import {countryManageList} from '@/api/tablation'
  export default {
    data() {
      return {
        countryList: [],
        cardList: [],
        queryParams: {
          pageNum: 1,
          pageSize: 2000,
          japaneseName: '',
          orderByColumn: 'isHot',
          isAsc: 'desc'
        }
      };
    },
    created() {
      this.getCountryList()
    },
    methods: {
      async getCountryList() {
        const res = await countryManageList(this.queryParams)
        if(this.queryParams.japaneseName == '') {
          this.countryList = res.rows
          this.cardList = this.countryList.splice(0,4)
        }else {
          this.cardList = res.rows
        }
      },
      handleIconClick() {
        console.log(111)
      },
      godays(item) {
        this.$router.push({
          path: './days',
          query: { 'country': item.englishName,flagImage: item.flagImage}
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
    .hero {
      width: 100%;
      height: 200px;
      background-color: #6EBFFF;
      border-radius: 0 0 16px 16px;
      // padding: 30px 20px 0 20px;
      padding-top: 30px;
      .titleBox {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        .title {
          color: #FAFCFE;
          font-size: 36px;
          // margin-right: 10px;
        }
  
        .tim {
          width: 37px;
          height: 50px;
        }
      }
  
      .input-with-icon {
        position: relative;
        padding: 0 20px;
      }
  
      .input-with-icon input {
        padding-right: 30px;
        /* 留出图标的空间 */
        width: 100%;
        height: 44px;
        border: none;
        border-radius: 10px;
        margin-top: 30px;
        padding-left: 10px;
        font-size: 16px;
        display: flex;
        justify-content: center;
        color: #9CA3AF;
        outline: none;
        box-shadow: 0 2px 4px #FBEB63;
      }
      ::placeholder {
        font-size: 16px;
        color: #9CA3AF;
      }
      .icon {
        content: "";
        position: absolute;
        top: 50%;
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
      padding: 30px 20px 0 20px;
      .popular {
        font-size: 20px;
        color: #004B84;
      }
      .card {
        margin-top: 20px;
        .cardItem {
          width: 100%;
          height: 60px;
          background-color: #EFF3F8;
          border-radius: 8px;
          margin-bottom: 16px;
          padding-left: 10px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 4px #6EBFFF;
          cursor: pointer;
          .pimg {
            width: 38.11px;
            height: 30px;
            margin-right: 10px;
            border-radius: 10px;
            object-fit: cover;
          }
          .name {
            color: #6B7280;
            font-size: 18px;
          }
        }
      }
    }
  }
  </style>