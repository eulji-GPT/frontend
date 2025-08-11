<template>
  <div :class="['common-chatinputbox', className]">
    <div v-if="property1 === 'image'" class="div">
      <div class="button-wrapper">
        <div class="button">
          <Icon class="icon-instance" />
        </div>
      </div>
      <div class="div-wrapper">
        <div class="button">
          <Icon class="icon-instance" />
        </div>
      </div>
      <div class="frame-2">
        <div class="button">
          <Icon class="icon-instance" />
        </div>
      </div>
    </div>
    <Common
      class="common-placeholdertext"
      :property1="property1 === 'chat' ? commonProperty1 : 'default'"
      :text="property1 === 'chat' ? commonText : '무엇이든 물어보세요.'"
    />
    <div class="frame-3">
      <Property1ExpandDefault class="instance-node" />
      <Property1SendDefault
        class="instance-node"
        :color="property1 === 'image' ? '#E5E7EB' : property1SendDefaultFill"
        :fill="property1 === 'image' ? '#9CA3AF' : property1SendDefaultColor"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Common } from "./Common";
import { Icon } from "./Icon";
import { Property1ExpandDefault } from "./Property1ExpandDefault";
import { Property1SendDefault } from "./Property1SendDefault";

export default defineComponent({
  name: "CommonChatinputbox",
  components: {
    Common,
    Icon,
    Property1ExpandDefault,
    Property1SendDefault,
  },
  props: {
    property1: {
      type: String,
      validator: value => ["image", "chat"].includes(value),
    },
    className: {
      type: String,
      default: "",
    },
    commonProperty1: {
      type: String,
      default: "default",
    },
    commonText: {
      type: String,
      default: "무엇이든 물어보세요.",
    },
    property1SendDefaultColor: {
      type: String,
      default: "#9CA3AF",
    },
    property1SendDefaultFill: {
      type: String,
      default: "#E5E7EB",
    },
  },
});
</script>

<style>
.common-chatinputbox {
  align-items: flex-start;
  background-color: var(--primary-100);
  border: 1px solid;
  border-color: var(--gray-100);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 17px;
  max-width: 770px;
  overflow: hidden;
  padding: 16px 10px;
  position: relative;
  width: 770px;
}

.common-chatinputbox .div {
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 10px;
  position: relative;
}

.common-chatinputbox .button-wrapper {
  background-image: url(./frame-2147227185.png);
  background-position: 50% 50%;
  background-size: cover;
  border: 1px solid;
  border-color: var(--primary-300);
  border-radius: 20px;
  height: 110px;
  overflow: hidden;
  position: relative;
  width: 110px;
}

.common-chatinputbox .button {
  align-items: center;
  background-color: var(--gray-50);
  border-radius: 100px;
  display: flex;
  gap: 4px;
  height: 23px;
  justify-content: center;
  left: 79px;
  padding: 4px;
  position: relative;
  top: 6px;
  width: 23px;
}

.common-chatinputbox .icon-instance {
  aspect-ratio: 1 !important;
  height: 20px !important;
  margin-bottom: -2.50px !important;
  margin-left: -2.50px !important;
  margin-right: -2.50px !important;
  margin-top: -2.50px !important;
  position: relative !important;
  width: 20px !important;
}

.common-chatinputbox .div-wrapper {
  background-image: url(./frame-2147227186.png);
  background-position: 50% 50%;
  background-size: cover;
  border: 1px solid;
  border-color: var(--primary-300);
  border-radius: 20px;
  height: 110px;
  overflow: hidden;
  position: relative;
  width: 110px;
}

.common-chatinputbox .frame-2 {
  background-image: url(./frame-2147227187.png);
  background-position: 50% 50%;
  background-size: cover;
  border: 1px solid;
  border-color: var(--primary-300);
  border-radius: 20px;
  height: 110px;
  overflow: hidden;
  position: relative;
  width: 110px;
}

.common-chatinputbox .common-placeholdertext {
  flex: 0 0 auto !important;
}

.common-chatinputbox .frame-3 {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  position: relative;
  width: 100%;
}

.common-chatinputbox .instance-node {
  height: 34px !important;
  position: relative !important;
  width: 34px !important;
}
</style>
