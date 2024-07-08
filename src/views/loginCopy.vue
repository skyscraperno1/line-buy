<template>
    <div class="container" v-loading="loading">
      <div class="hero">
        <div class="titleBox">
          <div class="title">最適なプランを探す</div>
          <img src="../assets/images/frame1.png" class="tim">
        </div>
        <div class="input-with-icon">
          <input type="text" v-model="queryParams.parentProductName" placeholder="目的地検索">
          <span class="icon" @click="getCountryList"></span>
        </div>
      </div>
      <div class="content" v-if="!diable">
        <div class="popular">人気の目的地 (1/4)</div>
        <div class="card">
          <div class="cardItem" v-for="(item, index) in cardList" :key="item.id" @click="godays(item)">
            <img v-if="item.flagImage" :src="item.flagImage" class="pimg">
            <div class="name">{{ item.parentProductName }}</div>
          </div>
        </div>
      </div>
  
      <div class="confirm_card" v-if="diable">
        <div class="subD">「{{ keyWords }}（国・地域）」でご利用可能なeSIMのプランは現在準備中です。</div>
        <div class="subD">発売予定については、LINE公式カスタマーサービスにてお問い合わせください。</div>
        <div class="subBtn" @click="goback">戻る</div>
      </div>
  
      <!-- 组件 -->
      <days v-if="isDays"/>
    </div>
   
  </template>
  
  <script>
  import { countryManageList, parentlistAnonymous } from '@/api/tablation'
  import days from './days.vue';
  export default {
    components:{ days },
    data() {
      return {
        countryList: [],
        cardList: [
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
        ],
        queryParams: {
          pageNum: 1,
          pageSize: 2000,
          parentProductName: '',
          country: '',
          
          // orderByColumn: 'isHot',
          // isAsc: 'desc'
        },
        diable: false,  
        keyWords: '',
        userId: '',
        // loading: true,
        loading: false,
        isDays: false
      };
    },
    created() {
      // this.initializeLiff()
      // this.init()
    },
    methods: {
      async initializeLiff() {
        try {
          // 测试环境 liffId: '2003687931-w55JjYzE'
          // 正式环境 liffId: '2003804589-8E07K6bN'
          await liff.init({ liffId: '2003804589-8E07K6bN' })
          if (!liff.isInClient()) {
            // this.loading = false
            // document.getElementById('status').innerText = '请在 Line 应用中打开此页面'
          } else {
            if (!liff.isLoggedIn()) {
              liff.login()
            } else {
              // const idToken = liff.getDecodedIDToken();
              // alert(idToken.email)
              this.getUserInformation()
            }
          }
        }
        catch (error) {
          console.error(error);
          // this.loading = false
        }
      },
      async init() {
        await liff.init({ liffId: '2003804589-8E07K6bN' })
        const res = liff.getContext()
        // this.loading = false
        this.userId = res.userId
        // const decodedIDToken = liff.getDecodedIDToken();
        // alert(111)
        // alert(decodedIDToken)
        // alert(decodedIDToken.sub)
        // liff.getContext().then(res => {
        //   if(res.userId!='') {
        //     this.loading = false
        //     this.userId = res.userId
        //   }
        // })
      },
      // getUserInformation() {
      //   liff.getProfile().then(res => {
      //     if(res.userId!='') {
            
      //       this.userId = res.userId
      //     }
      //   })
      // },
      async getCountryList() {
        const res = await parentlistAnonymous(this.queryParams)
        const list = res.rows
        const arr = []
        if(list && list.length > 0) {
          list.forEach(item => {
            arr.push(item.id)
          })
          if(this.userId) {
            this.$router.push({
              path: './days',
              query: { 'parentProductIds': arr.join(','), flagImage: '',userId: this.userId,key:this.queryParams.parentProductName  }
            })
          }
        }else {
          this.diable = true
          this.keyWords = this.queryParams.parentProductName
        }
      },
      godays(item) {
        this.queryParams.parentProductName = item.englishName
        parentlistAnonymous(this.queryParams).then(res => {
          const list = res.rows
          const arr = []
          if(list && list.length > 0) {
            list.forEach(item => {
              arr.push(item.id)
            })
            if(this.userId) {
              this.$router.push({
                path: './days',
                query: { 'parentProductIds': arr.join(','), flagImage: item.flagImage,userId: this.userId,key:item.parentProductName }
              })
            }
          }else {
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
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .container {
    width: 100%;
    // height: 100%;
    box-sizing: border-box;
  
    // font-family: 'Conthrax';
    .hero {
      width: 100%;
      height: 200px;
      background-color: #6EBFFF;
      border-radius: 0 0 16px 16px;
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
        font-size: 16px;
        color: #004B84;
        font-weight: bold;
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
            font-size: 16px;
            // font-weight: bold;
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
        background: #eee;
        color: #1A1A1A;
        margin-top: 30px;
      }
    }
  </style>