// 注意：每次调用$get()或$post()或$ajax()的时候
// 会先调用这ajaxPrefilter这个函数
// 在这个函数可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  options.url = 'http://ajax.frontend.itheima.net' + options.url
  // 检索字符串如果没有就返回-1
  if (options.url.indexOf(/my/) !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 
  // 失败了就会调用该函数就称为回调函数
  options.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
      // 强制清空token值 并不让它继续渲染
      // token值是记录每次的id唯一标识 也是登录的唯一标识 
      // 如果直接访问后台页面没有记录ID访问有权限的接口会获取数据失败  如果获取数据失败 就回执行complete回调函数 并且强制清空 并且跳转到login页面
      localStorage.removeItem('token')
      // 跳转到登录页面
      location.href = 'login.html'
    }
  }
})