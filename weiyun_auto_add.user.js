// ==UserScript==
// @name         Weiyun Auto Add Task 微云自动填写离线下载链接
// @namespace    https://jortana.top/
// @version      0.1
// @description  自动粘贴剪贴板中的内容到微云的离线下载
// @author       Jortana
// @match        https://www.weiyun.com/disk*
// @icon         https://www.google.com/s2/favicons?domain=weiyun.com
// @homepageURL  https://github.com/Jortana/weiyun-auto-add/
// @license      MIT
// @grant        none
// @note         初版发布
// ==/UserScript==

function setURL() {
  // 等待 textarea 完成加载后填入剪贴板的内容，并点击下一步按钮
  const textareaSelector =
    'body > div.modal.modal-show > div.modal-dialog.modal-dialog-480.modal-dialog-bt.modal-dialog-tab > div.modal-dialog-bd > div > ul > li.tab-cont-item.online.act > div.input-wrapper > textarea'
  let textarea = document.querySelector(textareaSelector)
  // 等待 textarea 完成加载
  const waitLoad = setInterval(() => {
    textarea = document.querySelector(textareaSelector)
    if (textarea !== null) {
      clearInterval(waitLoad)
      // 获取剪贴板中的内容并将其填入 textarea 中
      navigator.clipboard.readText().then((clipText) => {
        textarea.value = clipText
        // 构造 input 事件对象
        const event = new InputEvent('input')
        // 触发 input 事件，如果不触发无法让“下一步”按钮可以被点击
        textarea.dispatchEvent(event)
        // 点击下一步按钮
        document
          .querySelector(
            'body > div.modal.modal-show > div.modal-dialog.modal-dialog-480.modal-dialog-bt.modal-dialog-tab > div.modal-dialog-bd > div > ul > li.tab-cont-item.online.act > div.modal-dialog-ft.clearfix.btn-group > button.btn.btn-active'
          )
          .click()
      })
    }
  }, 100)
}

;(function () {
  window.onload = () => {
    // 在页面上添加一个自动完成添加的按钮
    // 这里写了三层 div，主要是想和官网上的样式一样，直接套用 class，所以结构也得抄
    const lastButton = document.querySelector(
      '#app > div > div.layout-body > div > div.layout-main-wrap > div.layout-toolbar > div > div > div.mod-action-wrap.mod-action-wrap-create.clearfix'
    )
    // 最外层的 container
    const autoButtonContainer = document.createElement('div')
    autoButtonContainer.setAttribute(
      'class',
      'mod-action-wrap mod-action-wrap-create clearfix'
    )
    // 中间一层
    const buttonWrap = document.createElement('div')
    buttonWrap.setAttribute('class', 'action-item')
    autoButtonContainer.appendChild(buttonWrap)
    // 按钮
    const autoButton = document.createElement('div')
    autoButton.setAttribute('class', 'action-item-con')
    autoButton.innerText = '自动添加'
    buttonWrap.appendChild(autoButton)
    // 添加点击的监听器
    buttonWrap.addEventListener('click', () => {
      // 先点击 离线下载 按钮，触发对话框
      const newTask = document.querySelector(
        '#app > div > div.layout-body > div > div.layout-main-wrap > div.layout-toolbar > div > div > div.mod-action-wrap.mod-action-wrap-create.clearfix > div > div > div > div:nth-child(4) > div > ul > li'
      )
      newTask.click()
      // 链接下载 按钮的选择器
      const subTabSelector =
        'body > div.modal.modal-show > div.modal-dialog.modal-dialog-480.modal-dialog-bt.modal-dialog-tab > div.modal-dialog-bd > nav > ul > li:nth-child(2)'
      // 被点击后，等待跳出的对话框完成加载后，点击 链接下载 按钮，并填入剪贴板中的内容
      let tabButton = document.querySelector(subTabSelector)
      // 等待对话框完成加载
      const waitButton = setInterval(() => {
        tabButton = document.querySelector(subTabSelector)
        if (tabButton !== null) {
          tabButton.click()
          // 填入剪贴板中的内容
          setURL()
          clearInterval(waitButton)
        }
      }, 100)
    })
    // 添加到 新建 按钮的后面
    lastButton.parentNode.insertBefore(
      autoButtonContainer,
      lastButton.nextElementSibling
    )
  }
})()
