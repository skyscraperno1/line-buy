<template>
    <div class="container">
      <div class="hero">
        <div class="desc">現地での滞在日数<br>は？</div>
        <img src="../assets/images/flag4.png" class="himg">
      </div>
      <div class="content">
        <div class="popular">滞在日数 (2/4)</div>
        <div class="card">
          <div class="cardItem" v-for="(item, index) in cardList" :key="item.id" @click="godown(item)">
            <div class="name">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        country: '',
        flagImage: '',
        cardList: [
          {id:1,name: '3日間以内',startDays:1,endDays:3},
          {id:2,name: '7日間以内',startDays:4,endDays:7},
          {id:3,name: '15日間以内',startDays:8,endDays:15},
          {id:4,name: '30日間以内',startDays:16,endDays:30}
        ]
      };
    },
    created() {
      this.country = this.$route.query.country
      this.flagImage = this.$route.query.flagImage
      // console.log(this.country)
    },
    methods: {
      godown(item) {
        this.$router.push({
          path: './productType',
          query: { 
            'country': this.country,
            'flagImage': this.flagImage,
            'startDays': item.startDays,
            'endDays': item.endDays
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
          justify-content: center;
          box-shadow: 0 2px 4px #6EBFFF;
          cursor: pointer;
          .name {
            color: #6B7280;
            font-size: 18px;
          }
        }
      }
    }
  }
  </style>