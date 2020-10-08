$(function () {
  var layer = layui.layer
  var form = layui.form
  getNewsList()
  // 获取并渲染列表
  function getNewsList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {

        var htmlStr = template('tlp_table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加按钮绑定点击事件 函数是用来做某件事情或者实现某种功能
  var index = null
  $('#btnAddCate').on('click', function () {
    index = layer.open({
      type: 1,
      area: ['500px', '280px'],
      title: '添加文章分类',
      content: $('#btnAdd').html()
    });
  })

  // 添加列表
  $('body').on('submit', '#form_add', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('添加文章失败')
        }
        layer.msg('添加文章成功')
        getNewsList()
        layer.close(index)
      }
    })
  })

  // 修改列表
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '280px'],
      title: '修改文章分类',
      content: $('#btnEdit').html()
    })
    // 获取自定义属性
    var id = $(this).attr('data-id')
    $.ajax({
      mthod: 'GET',
      // 携带参数
      url: '/my/article/cates/' + id,
      success: function (res) {
        // 将数据赋值给文本框
        form.val('form_edit', res.data)
      }
    })
  })

  // 更新列表
  $('body').on('submit', '#form_edit', function (e) {
    e.preventDefault()
    var data = $(this).serialize()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: data,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('更改文章信息失败')
        }
        layer.msg('更改文章信息成功')
        getNewsList()
        layer.close(indexEdit)
      }
    })
  })

  // 删除列表
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    layer.confirm('确定需要删除吗', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败')
          }
          layer.msg('删除文章成功')
          layer.close(index);
          getNewsList()
        }
      })
    });
  })



})

