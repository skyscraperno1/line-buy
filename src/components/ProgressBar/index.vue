<template>
  <div class="progress-bar">
    <div
      class="progress-bar-item"
      v-for="step in steps"
      :key="step.step"
      :class="{ active: activeStep === step.step }"
    >
      <div class="progress-bar-item-text">
        <p>{{ step.step }}</p>
        <p>{{ step.name }}</p>
      </div>
      <div class="progress-bar-item-line"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    activeStep: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      steps: [
        {
          step: 1,
          name: "国名",
        },
        {
          step: 2,
          name: "滞在日数",
        },
        {
          step: 3,
          name: "商品",
        },
        {
          step: 4,
          name: "内容確認",
        },
        {
          step: 5,
          name: "注文完了",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.progress-bar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 0 25px;
  margin-bottom: 9px;

  .progress-bar-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    .progress-bar-item-text {
      text-align: center;
      p {
        color: #6b7280;
        text-align: center;
        font-family: "Noto Sans JP";
        font-size: 8px;
        font-style: normal;
        font-weight: 300;
        line-height: normal;
        margin-block-start: 0;
        margin-block-end: 0;
        &:last-child {
          font-size: 8px;
          margin: 3px 0;
        }
      }
    }
    .progress-bar-item-line {
      width: 100%;
      height: 5px;
      background-color: #ffac57;
    }
    &.active {
      .progress-bar-item-text p {
        color: #000;
      }
      .progress-bar-item-line {
        background-color: #24acf2;
      }
    }
  }
}
</style>
