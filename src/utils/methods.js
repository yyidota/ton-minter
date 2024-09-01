import React from "react";
/**
 * 数组对象扁平化
 * @param list 数组
 * @param key 子集数组 key
 * @returns Array
 */
export function arrayObjectToflat(list, key, hasKey = false) {
  let res = [];
  list.forEach((el) => {
    el[key] && res.push(...arrayObjectToflat(el[key], key));
    if (!hasKey) {
      delete el[key];
    }
    res.push(el);
  });
  return res;
}
/**获取节点内容 */
export function getTextFromReactNode(node) {
  if (typeof node === "string" || typeof node === "number") {
    return `${node}`;
  }
  if (Array.isArray(node)) {
    return node.map(getTextFromReactNode).join("");
  }
  if (typeof node === "object" && node !== null && !React.isValidElement(node)) {
    // 假设node是一个对象，但不是React元素
    // 可以在这里添加更多处理逻辑，例如处理React.Fragment或自定义组件
    return "";
  }
  if (React.isValidElement(node)) {
    const childrenText = React.Children.map(node.props.children, getTextFromReactNode)
      ?.filter(Boolean)
      ?.join("");
    return childrenText;
  }
}
