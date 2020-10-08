$(function () {
  // 获取下拉列表数据并渲染
  var layer = layui.layer
  var form = layui.form
  initCate()
  // 初始化富文本编辑器
  initEditor()
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章数据失败')
        }
        // 渲染
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 文本框必加项
        form.render()
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 选择封面按钮上传文件
  $('#btnChoose').on('click', function () {
    $('#file').click()
  })

  $('#file').on('click', function (e) {
    var files = e.target.files
    if (files.length === 0) {
      return
    }
    var newImgURL = URL.createObjectURL(files[0])

    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })
  // 定义文章发布状态
  var art_state = '已发布'
  // 为存为草稿绑定点击事件处理函数
  $('#btnCao').on('click', function () {
    art_state = '草稿'
  })

  // 监听提交事件
  $('#form_cao').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 收集表单数据
    var fd = new FormData($(this)[0])

    // 追加state状态
    fd.append('state', art_state)
    // 循环里面的值

    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
        getList(fd)
      })
  })

  // 提交数据
  function getList(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {

          return layer.msg('发布失败')
        }
        layer.msg('发布成功')
        location.href = '/article/article_list.html'
      }
    })
  }
})