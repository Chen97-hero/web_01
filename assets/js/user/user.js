$(function () {
  var form = layui.form
  var layer = layui.layer
  form.verify({
    // 拿到用户昵称的值
    nickname: function (value) {
      if (value.length > 6) {
        return '长度必须在1~6个字符之间'
      }
    }
  })
  // 获取用户的基本信息
  initUserinfo()
  function initUserinfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      // 当事件执行完以后再调用响应回来的数据
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败')
        }
        // 快速为表单form表单赋值
    
        form.val("formUserInfo", res.data)
      }
    })
  }
  // 设置重置按钮并获取到用户的基本信息
  $('#btnReset').on('click', function (e) {
    e.preventDefault();
    initUserinfo()
  })

  // 监听提交按钮事件
  $('.layui-form').on('submit', function (e) { 
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data:$(this).serialize(),
      success: function (res) { 
        if (res.status !== 0) { 
          return layer.msg('更新信息失败')
        }
        layer.msg('更新信息成功')
        window.parent.getList()
      }
    })
  })
})
