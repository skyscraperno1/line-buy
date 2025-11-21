<template>
  <div class="arrow-back" @click="onClick">
    <svg
      width="13"
      height="20"
      viewBox="0 0 13 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.49 1.5L1.5 9.45L10.9 17.77"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>
<script>  
export default {
  props: {
    onClick: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped>
.arrow-back {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff7536;
  cursor: pointer;
}
</style>
