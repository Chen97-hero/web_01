$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  var q = {
    // 定义一个查询参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 2, //每页显示几条数据，默认每页显示2条
    cate_id: '', //文章分类的 Id
    state: '',  //文章的状态，可选值有：已发布、草稿
    // 凡是发起请求就要携带Q这个数据  这样服务器就知道你要获取第几页数据了 
  }

  template.defaults.imports.dataFormat = function () {
    var dt = new Date()

    var y = dt.getFullYear()
    var m = time(dt.getMonth() + 1)
    var d = time(dt.getDate())

    var hh = time(dt.getHours())
    var mm = time(dt.getMinutes())
    var ss = time(dt.getSeconds())

    return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
  }

  function time(n) {
    return n > 9 ? n : '0' + n
  }
  // 获取文章数据并渲染
  getList()
  // 获取下拉选择框并渲染
  getSelect()
  function getList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章失败')
        }
        var htmlStr = template('tlp_table', res)
        $('tbody').html(htmlStr)
        // 当渲染完页面后 拿到总页数
        renderPage(res.total)
      }
    })
  }

  // 渲染文章分类下拉选择框
  function getSelect() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {

        if (res.status !== 0) {
          return layer.msg('获取下拉列表失败')
        }
        var htmlStr = template('tpl_cate', res)
        $('#select').html(htmlStr)
        form.render()
      }
    })
  }
  // 为submit按钮绑定点击事件
  $('#form_search').on('submit', function (e) {
    e.preventDefault();
    // 拿到状态所有分类和所有状态的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    //为查询q对象中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // // 根据最新的条件 重新渲染表格数据
    getList()
  })

  function renderPage(total) {
    // 用总页数除以每页两条数据 也就是说当前假如8条数据除以2就等于四页 因为每页显示两条数据
    laypage.render({
      elem: 'pagebox',//用于存放分页的容器
      count: total, //总数据条数 
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum,  //默认第一页显示
      // 用总数据条数除以每页显示的数据 就可以得到多少分页
      // 根据jump函数拿到最新的页码值
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        // 拿到用户选择页码值赋值给默认页码值 就可以得到最新的页码值 然后在发起请求得到最新的数据 在渲染页面即可
        q.pagenum = obj.curr
        // 根据最新的q获取对应的数据列表，并渲染列表
        // 根据最新的数据条赋值给赋值给默认显示几条数据 然后在渲染数据即可
        q.pagesize = obj.limit
        if (!first) {
          // 触发jump方式有两种:
          // 点击页码的时候就会触发jump函数
          // 只要调用renderPage方法 就会触发jump回调
          // 1.可以通过first的值来判断是通过哪种方式,触发junp回调
          // 2.如果first为true就说明是通过第二种方式触发的
          getList()
        }
      }
    })
  }

  // 根据对应的id删除对应的数据
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    var length = $('.btn-delete').length
    console.log(length);
    // 拿到对应的id那条数据
    var id = $(this).attr('data-id')
    // 发请求
    layer.confirm('确定要删除吗？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败')
          }
          layer.msg('删除文章成功')
          // 当数据删除完成后，需要判断当前一页中，是否还有剩余的数据
          // 如果没有剩余的数据了，则让页码值-1之后
          // 再重新调用getlist()方法
          if (length === 1) {
            // 如果length的长度等于1，则证明删除完毕之后，页面上没有任何数据了
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          getList()
        }
      })
      layer.close(index);
    });
  })
})