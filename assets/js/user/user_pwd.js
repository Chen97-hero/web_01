$(function () {
  var form = layui.form
  var layer=layui.layer
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    samePwd: function (value) { 
      if (value === $('[name=oldPwd]').val()) { 
        return "新旧密码不能一致,请重新输入"
      }
    },
    rePwd: function (value) { 
      if (value !== $('[name=newPwd]').val()) { 
        return "两次密码不一致请重新输入"
      }
    }
  })

  // 修改密码绑定提交事件
  $('.layui-form').on('submit', function (e) { 
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      // 回调就是主函数的任务执行完，在调用传进来的那个参数 函数本身就是做某件事情的
      success: function (res) { 
        if (res.status !== 0) { 
          return layer.msg('更新用户信息失败')
        }
        layer.msg('更新用户信息成功')
        $('.layui-form')[0].reset();
      }
    })
  })
})