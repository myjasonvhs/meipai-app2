var fs = require('fs') //引入文件系统模块
var Crawler = require('crawler') //引入数据抓取模块
// 读取文件或目录状态
fs.stat('./data', function (err, stats) {
    if (err) { //不存在的时候执行
        //console.log(err)
        fs.mkdir('./data')
        console.log('创建文件夹成功')
    }
    else {//存在的时候执行
        //console.log(stats)
        console.log('文件夹已存在')
    }
})
//创建实例
var c = new Crawler({
    maxConnections: 10
})

var videoList = [{
    url:'http://www.meipai.com/square/19',
    name:'女神',
    code:'nvshen',
    pageCount:'5'
},{
    url:'http://www.meipai.com/square/63',
    name:'舞蹈',
    code:'wudao',
    pageCount:'5'
}]
videoList.forEach(item=>{
    getVideos(item.code,item.url,item.pageCount)
})

/**
 * 获取不同的分类的书籍信息
 *
 */
function getVideos(type, url, pageCount) {
    getVideoData(url,1,pageCount)
    var videos = [] //存储当前的书籍数据
    /**
     * baseUrl      基础地址 用于拼接实际的地址时使用
     * page         当前页码
     * pageCount    总页数
     */
    function getVideoData(baseUrl, page, pageCount) {
        var url = baseUrl + "?p=" +page //实际取数据的地址
        c.queue([
            {
                uri: url,//'http://bang.dangdang.com/books/newhotsales/01.00.00.00.00.00-recent7-0-0-1-1',
                callback: function (error, res, done) {
                    if (error) {
                        console.log(error);
                    } else {
                        var $ = res.$;
                        $('#mediasList li').each(function () {
                            //解析数据存储在数组中
                            videos.push(convertToObject($(this)))
                        })
                        if (page <= pageCount) {
                            //递归调用取数 直到最后一页
                            getVideoData(baseUrl, page + 1, pageCount)
                        }
                        else {
                            //console.log(books)
                            fs.writeFileSync(`./data/video_${type}.json`, JSON.stringify(videos))
                            console.log(`写入文件完成...video_${type}.json`)
                        }
                    }
                    done();
                }
            }
        ])
    }
}


/**
 *把html节点转换为book对象
 * */
function convertToObject(tagHtml) {
    var obj = {}
    obj.title = tagHtml.find('strong[itemprop="description"]').text()
    obj.img = tagHtml.find('img.pai').attr('src')
    obj.video = tagHtml.find('div[data-video]').attr('data-video')
    return obj
}

