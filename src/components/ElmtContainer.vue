<template>
  <div id="elmtContainer" @click.self="cleanActive()">
    <div
      :class="['elmt-item', activeElement.id == item.id ? 'active' : '']"
      v-for="(item, idx) in elmts"
      :id="item.id"
      :style="{
        left: item.props.x + 'px',
        top: item.props.y + 'px',
        width: item.props.width + 'px',
        height: item.props.height + 'px',
        background: item.color
      }"
      @click="onActiveElmt(item.id)"
    >
      {{ idx + 1 }}
    </div>

    <div
      class="guide-line-h"
      :style="item.style"
      :key="'h' + idx"
      v-for="(item, idx) in guideLineH"
    >
      <span> {{ item.value ? item.value + 'px' : '' }}</span>
    </div>
    <div
      class="guide-line-v"
      :style="item.style"
      :key="'v' + idx"
      v-for="(item, idx) in guideLineV"
    >
      <span>{{ item.value ? item.value + 'px' : '' }}</span>
    </div>
  </div>
</template>
<script setup>
  import interact from 'interactjs';
  import { ref, onMounted, computed } from 'vue';
  import { getGuideLine, setNearDistance } from '../libs/distanceTipLine';
  //设置附近的最大距离
  setNearDistance(100);
  const activeElement = computed(() => {
    if (active.value) {
      return elmts.value.find((item) => item.id == active.value);
    }
    return {};
  });
  //选中元素id
  const active = ref();
  //元素list
  const elmts = ref([]);
  //横向辅助线
  const guideLineH = ref([]);
  //纵向辅助线
  const guideLineV = ref([]);
  //更新list里面对应元素的数据
  const setElement = (rect) => {
    let elmtIndex = elmts.value.findIndex((item) => item.id == active.value);
    let item = elmts.value[elmtIndex];
    item.props = rect;
    elmts.value.splice(elmtIndex, 1, item);
  };
  //激活元素
  const onActiveElmt = (id) => {
    active.value = id;

    createGuideLine();
  };
  //计算辅助线
  let isLock = false;
  const createGuideLine = () => {
    if (!isLock) {
      isLock = true;
      setTimeout(() => {
        let { h, v } = getGuideLine(activeElement.value, elmts.value, '#elmtContainer');
        guideLineH.value = h;
        guideLineV.value = v;
        isLock = false;
      }, 50);
    }
  };
  //清空辅助线
  const cleanActive = () => {
    active.value = '';
    guideLineH.value = [];
    guideLineV.value = [];
  };
  onMounted(() => {
    //随机生成界面元素
    let list = [];
    let container = document.getElementById('elmtContainer');
    for (let i = 0; i < 10; i++) {
      list.push({
        id: 'el' + i,
        color: `rgba(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(
          Math.random() * 255
        )},0.2)`,
        props: {
          x: Math.round(Math.random() * container.offsetWidth),
          y: Math.round(Math.random() * container.offsetHeight),
          width: 200 + i * 10,
          height: 300 - i * 10
        }
      });
    }
    elmts.value = list;

    const position = { x: 0, y: 0 };
    //移动位置
    interact('.elmt-item').draggable({
      listeners: {
        start(event) {
          let dom = event.target;
          position.x = parseInt(dom.style.left) || 0;
          position.y = parseInt(dom.style.top) || 0;
          onActiveElmt(dom.id);
        },
        move(event) {
          let dom = event.target;

          position.x += event.dx;
          position.y += event.dy;
          dom.style.left = position.x + 'px';
          dom.style.top = position.y + 'px';

          let newRect = {
            x: parseInt(dom.style.left),
            y: parseInt(dom.style.top),
            height: parseInt(dom.style.height),
            width: parseInt(dom.style.width)
          };
          setElement(newRect);
          createGuideLine();
        },
        end(event) {
          let dom = event.target;

          let newRect = {
            x: parseInt(dom.style.left),
            y: parseInt(dom.style.top),
            height: parseInt(dom.style.height),
            width: parseInt(dom.style.width)
          };
          setElement(newRect);
          createGuideLine();
        }
      }
    });
    // const sizePos = {
    //   x: 0,
    //   y: 0
    // };
    //改变大小
    interact('.elmt-item').resizable({
      edges: {
        top: false,
        left: false,
        bottom: true,
        right: true
      },
      listeners: {
        start(event) {
          let dom = event.target;
          // sizePos.x = parseInt(dom.style.left) || 0;
          // sizePos.y = parseInt(dom.style.top) || 0;
          onActiveElmt(dom.id);
        },
        move: (event) => {
          let dom = event.target;
          console.log(event);

          // sizePos.x += event.dx;
          // sizePos.y += event.dy;
          // dom.style.left = `${parseInt(sizePos.x)}px`;
          // dom.style.top = `${parseInt(sizePos.y)}px`;
          dom.style.height = `${parseInt(event.rect.height)}px`;
          dom.style.width = `${parseInt(event.rect.width)}px`;
          let newRect = {
            x: parseInt(dom.style.left),
            y: parseInt(dom.style.top),
            height: parseInt(event.rect.height),
            width: parseInt(event.rect.width)
          };
          setElement(newRect);
          createGuideLine();
        },
        end: (event) => {
          let dom = event.target;
          let newRect = {
            x: parseInt(dom.style.left),
            y: parseInt(dom.style.top),
            height: parseInt(dom.style.height),
            width: parseInt(dom.style.width)
          };
          setElement(newRect);
          createGuideLine();
        }
      }
    });
  });
</script>

<style scoped>
  .guide-line-h,
  .guide-line-v {
    z-index: 9999;
    pointer-events: none;
    display: inline-flex;
    position: absolute;
    align-items: center;
    justify-content: center;
  }
  .guide-line-h > span,
  .guide-line-v > span {
    display: inline-block;
    font-size: 16px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.5);
  }
  .guide-line-h {
    border-bottom: solid 1px dodgerblue;
  }
  .guide-line-v {
    border-left: solid 1px dodgerblue;
  }
  #elmtContainer {
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    position: absolute;
  }
  .elmt-item {
    border: dashed 2px gray;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    font-size: 48px;
  }
  .elmt-item.active {
    border: solid 2px rgb(30, 144, 255);
  }
</style>
