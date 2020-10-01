$(function () {
  getList()
  var layer = layui.layer
  // 实现页面退出功能
  $('#btnlogout').on('click', function () {
    layer.confirm('确认退出', { icon: 3, title: '提示' }, function (index) {
      //do something
      //  清除本地存储
      // 必须清空数据 因为会保留之前的数据
      localStorage.removeItem('token')
      // 跳转到login界面
      location.href = 'login.html'
      layer.close(index);
    });
  })
})



function getList() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      renderAvater(res.data)
    },
    // 无论成功还是失败都会执行complete回调函数
    // complete: function (res) {
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
    //     // 强制清空token值 并不让它继续渲染
    //     // token值是记录每次的id唯一标识 也是登录的唯一标识 
    //     // 如果直接访问后台页面没有记录ID访问有权限的接口会获取数据失败  如果获取数据失败 就回执行complete回调函数 并且强制清空 并且跳转到login页面
    //     localStorage.removeItem('token')
    //     // 跳转到登录页面
    //     location.href = 'login.html'
    //   }
    // }
  })
}



// 渲染用户的头像
function renderAvater(user) {
  // 获取用户的名称
  var name = user.nickname || user.username
  // 设置欢迎文本
  $('.welcome').html(`欢迎${name}`)
  // 渲染图片头像
  if (user.user_pic !== null) {
    // 渲染用户头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avater').hide();
  } else {
    //  先隐藏用户头像
    //  渲染用户头像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avater').html(first).show();
  }
}