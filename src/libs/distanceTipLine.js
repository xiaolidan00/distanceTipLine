//附近距离
let nearD = 160;
export function setNearDistance(d) {
  nearD = d;
}
/**
 * 检查组件是否在选框范围内
 * @param {Object} props 组件位置大小数据
 * @returns {Boolean}
 */
function checkNear(props, rect) {
  let xD = getXDistance(props, rect);
  let yD = getYDistance(props, rect);
  if (Math.min(...xD) <= nearD || Math.min(...yD) <= nearD) {
    return true;
  }

  return false;
}
function getXDistance(props, rect) {
  return [
    Math.abs(rect.x - props.x),
    Math.abs(rect.x + rect.width - props.x),
    Math.abs(rect.x - (props.x + props.width)),
    Math.abs(rect.x + rect.width - (props.x + props.width))
  ];
}
function getYDistance(props, rect) {
  return [
    Math.abs(rect.y - props.y),
    Math.abs(rect.y + rect.height - props.y),
    Math.abs(rect.y - (props.y + props.height)),
    Math.abs(rect.y + rect.height - (props.y + props.height))
  ];
}

const XLine = {
  0: (props, rect) => {
    return Math.min(rect.x, props.x);
  },
  1: (props, rect) => {
    return Math.min(rect.x + rect.width, props.x);
  },
  2: (props, rect) => {
    return Math.min(rect.x, props.x + props.width);
  },
  3: (props, rect) => {
    return Math.min(rect.x + rect.width, props.x + props.width);
  }
};

const YLine = {
  0: (props, rect) => {
    return Math.min(rect.y, props.y);
  },
  1: (props, rect) => {
    return Math.min(rect.y + rect.height, props.y);
  },
  2: (props, rect) => {
    return Math.min(rect.y, props.y + props.height);
  },
  3: (props, rect) => {
    return Math.min(rect.y + rect.height, props.y + props.height);
  }
};
/**
 *
 * @param {Object} activeElement 参考元素
 * @param {Array} elmts 元素list
 * @param {DOM} el 父元素id
 * @returns {Object} {h:横向辅助线，v:纵向辅助线}
 */
export function getGuideLine(activeElement, elmts, el) {
  let { x: left, y: top, width, height } = activeElement.props;
  let container = document.querySelector(el);
  let screenWidth = container.offsetWidth;
  let screenHeight = container.offsetHeight;
  let posH = [
    //左距离
    {
      style: {
        left: 0,
        top: top + height * 0.5 - 16 + 'px',
        width: left + 'px'
      },
      value: left
    },
    //右距离
    {
      style: {
        right: 0,
        top: top + height * 0.5 - 16 + 'px',
        width: screenWidth - (left + width) + 'px'
      },
      value: screenWidth - (left + width)
    },
    //宽度
    {
      style: {
        left: left + 'px',
        top: top + height * 0.5 - 16 + 'px',
        width: width + 'px',
        justifyContent: 'flex-start',
        border: 'none',
        paddingLeft: '10px'
      },
      value: height
    },
    //上边界
    {
      style: {
        left: 0,
        top: top + 'px',
        width: '100%',
        borderBottom: 'dashed 1px rgb(37, 124, 245)'
      }
    },
    //下边界
    {
      style: {
        left: 0,
        top: top + height + 'px',
        width: '100%',
        borderBottom: 'dashed 1px rgb(37, 124, 245)'
      }
    }
  ];
  let posV = [
    //上距离
    {
      style: {
        left: left + width * 0.5 + 'px',
        top: 0,
        height: top + 'px'
      },
      value: top
    },
    //下距离
    {
      style: {
        left: left + width * 0.5 + 'px',
        bottom: 0,
        height: screenHeight - (top + height) + 'px'
      },
      value: screenHeight - (top + height)
    },
    //高度
    {
      style: {
        left: left + width * 0.5 + 'px',
        top: top + 'px',
        height: height + 'px',
        alignItems: 'flex-start',
        border: 'none',

        paddingTop: '10px'
      },
      value: height
    },
    //左边界
    {
      style: {
        left: left + 'px',
        top: 0,
        height: '100%',
        borderLeft: 'dashed 1px rgb(37, 124, 245)'
      }
    },
    //右边界
    {
      style: {
        left: left + width + 'px',
        top: 0,
        height: '100%',
        borderLeft: 'dashed 1px rgb(37, 124, 245)'
      }
    }
  ];
  let nearLineH = [];
  let nearLineV = [];
  elmts.forEach((elmt) => {
    if (elmt.id != activeElement.id && checkNear(elmt.props, activeElement.props)) {
      //横向距离
      let xD = getXDistance(elmt.props, activeElement.props);

      let isLeft1 = false;
      let isLeft2 = false;
      for (let i = 0; i < xD.length; i++) {
        let d = xD[i];
        if (i == 2 && isLeft1) {
          continue;
        }
        if (i == 3 && isLeft2) {
          continue;
        }
        if (d > 0 && d <= nearD) {
          let s = XLine[i](elmt.props, activeElement.props, d);
          if (i == 0) {
            isLeft1 = true;
          }
          if (i == 1) {
            isLeft2 = true;
          }
          nearLineH.push({
            style: {
              left: s + 'px',
              top: elmt.props.y + elmt.props.height * 0.5 - 16 + 'px',
              width: d + 'px'
            },
            value: d
          });
        }
      }

      let yD = getYDistance(elmt.props, activeElement.props);

      let isTop1 = false;
      let isTop2 = false;
      for (let i = 0; i < yD.length; i++) {
        let d = yD[i];
        if (i == 2 && isTop1) {
          continue;
        }
        if (i == 3 && isTop2) {
          continue;
        }
        if (d > 0 && d <= nearD) {
          let s = YLine[i](elmt.props, activeElement.props, d);
          if (i == 0) {
            isTop1 = true;
          }
          if (i == 1) {
            isTop2 = true;
          }
          nearLineV.push({
            style: {
              left: elmt.props.x + elmt.props.width * 0.5 + 'px',
              top: s + 'px',
              height: d + 'px'
            },
            value: d
          });
        }
      }
    }
  });

  return {
    h: posH.concat(nearLineH),
    v: posV.concat(nearLineV)
  };
}
