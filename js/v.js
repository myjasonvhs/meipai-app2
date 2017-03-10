var arrTypes = [{
    id:"nvshen",
    name:"女神"
},{
    id:"wudao",
    name:"舞蹈"
}]

// 模板引擎渲染数据 左侧导航
var strHtmlType = template('tplNav',{types:arrTypes})
$('#navList').html(strHtmlType)

// 为左侧导航添加click效果
$('#navList .list-group-item').click(function(){
    // 设置样式
    $('#navList .list-group-item').removeClass('active')
    $(this).addClass('active')

    // 根据分类id获取数据
    var tid = $(this).data('tid')
    getData(tid)
})
/**
 * 获取数据
 */
function getData(tid){
    $.getJSON(`/data/video_${tid}.json`,function(res){
        initHtml(res)
    })
}
/**
 * 拼接字符串
 */
function initHtml(data){
    var strHtml = ''
    // 渲染书籍数据
    strHtml = template('tplContentList',{listData:data})
    $('#contentContainer').html(strHtml)
    // $('video').each(function(index){
    //     var u = $(this).find('source').attr('src')
    //     var v = {}
    //     v = videojs.getPlayers(`video-${index}`)
    //     if(!v.hasOwnProperty('src')){
    //         v = videojs(`video-${index}`)
    //     }
    //     v.src(u)
    //     v.load(u)
    // })
}
