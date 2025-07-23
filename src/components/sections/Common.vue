<template>
  <div class="common-card">
    <img v-if="vector" :src="getVectorUrl(vector)" alt="icon" class="common-icon" />
    <div class="common-content">
      <slot>소식 내용</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Common',
  props: {
    one: {
      type: String,
      default: ''
    },
    vector: {
      type: String,
      default: ''
    }
  },
  methods: {
    getVectorUrl(filename: string) {
      // Vite recommends using new URL for static assets
      return filename ? new URL(`../../assets/${filename}`, import.meta.url).href : '';
    }
  }
});
</script>

<style scoped>
.common-card {
  display: flex;
  align-items: center;
  background: #f7f9fb;
  border-radius: 1.2rem;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 2px 12px 0 rgba(80,80,120,0.06);
  margin-bottom: 1.2rem;
}
.common-icon {
  width: 48px;
  height: 48px;
  margin-right: 1.2rem;
}
.common-content {
  flex: 1;
  color: #222;
  font-size: 1.1rem;
}
</style>
