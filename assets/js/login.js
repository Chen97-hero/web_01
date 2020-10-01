$(function () {
  $(function () {
    // 登录页面
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
      $('.login-box').hide()
      $('.reg-box').show()
    })
    // 注册页面
    // 点击“去登录”的链接
    $('#link_login').on('click', function () {
      $('.login-box').show()
      $('.reg-box').hide()
    })
  })


  // 从layue获取form方法
  var form = layui.form
  var layer = layui.layer
  // 通过form.verify自定义校验规则
  // 自定义表达规则
  form.verify({
    // 自定义一个pass密码规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于用户的判断
      // 如果判断失败，则return一个提示消息即可
      var pwd = $('.reg-box [name=password]').val();
      // console.log(pwd);
      if (pwd !== value) {
        return '两次密码输入不一致'
      }
    }
  })
  // 调起接口发起用户注册请求
  // 监听注册表单提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    // var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    var data = $(this).serialize()
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('注册成功，请登录')
      // 登录成功以后模拟点击事件自动点击去登录
      $('#link_login').click();
    })
  })

  // 监听表单登录事件
  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res.token);
        if (res.status !== 0) {
          console.log(res.token);
          return layer.msg('登录失败,请重新登录')
        }
        console.log(res);
        layer.msg('登录成功')
        // 将登录成功得到的token字符串，保存到本地
        // 服务器会发送一个token字符串 后续登录那些有权限的接口都要带了token才能请求成功
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = 'index.html'
      }
    })
  })
})