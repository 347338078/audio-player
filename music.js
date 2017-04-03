
var log = function(){
    console.log.apply(console, arguments)
}

var e = function(slector) {
    return document.querySelector(slector)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var bindAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

var songNumber = {
     0:"0.mp3",
     1:"1.mp3",
     2:"2.mp3",
     number:3,
}

// 播放器
var a = e('#id-audio-player')

// 播放 暂停
var bindPlay = function() {
    var play = e('.play')
    play.addEventListener('click', function() {
        console.log('click');
        if (a.paused) {
            console.log('123');
            play.setAttribute('src', 'images/pause.png')
            a.play()
        }else {
            play.setAttribute('src', 'images/play.png')
            a.pause()
        }
    })
}

// 监听播放状态
var monitorPlay = function() {
    var play = e('.play')
    if (a.paused) {
        play.setAttribute('src', 'images/play.png')
    }else {
        play.setAttribute('src', 'images/pause.png')
    }
}

// 判断是否 autoplay(自动播放)，改变播放图标
var autoPlay = function(){
    //查看是否拥有autoplay
    var auto = a.getAttribute('autoplay')
    //如果有，就判断播放状态，改变图标
    if (auto != null) {
        monitorPlay()
    }
}

// 列表循环
var listPlay = function() {
    bindEvent(a, 'ended', nextMusic)
}

// 单曲循环
var singleCycle = function() {
    bindEvent(a, 'ended', a.play)
}

// 随机播放
// 随机播放函数
var randomPlay = function() {
    // 创建所有路径的数组
    var list = ["0.mp3", "1.mp3", "2.mp3"]
    // 生成 0-2 的随机数
    var random = parseInt(Math.random()*3, 3)
    console.log(random);
    // 选择当前播放路径 并改变他的src
    var songs = e('.song')
    songs.setAttribute('src', list[random])
    a.load()
    a.play()
}

// 随机播放事件
var bindRandomPlay = function() {
    bindEvent(a, 'ended',randomPlay )
}

// 播放模式切换
var bindpattern = function() {
    var patterns = e('.pattern')
    var b = singleCycle()
    bindEvent(patterns, 'click', function() {
        console.log('click');
        if (patterns.innerText == '单曲循环') {
            patterns.innerText = '列表循环'
            b = listPlay()
            // log('singleCycle', singleCycle())
        } else if (patterns.innerText == '列表循环') {
            patterns.innerText = '随机播放'
            b = bindRandomPlay()
            // log('bindRandomPlay', bindRandomPlay())

        } else {
            patterns.innerText = '单曲循环'
            b = singleCycle()
            // log('listPlay', listPlay())
        }
        return b
    })
}


//  下一首歌曲
var nextMusic = function () {
    // console.log('click');
    // 选择当前播放歌曲
    var songs = e('.song')
    // console.log(songs);
    // 获得当前播放歌曲的src
    var url = songs.getAttribute('src')
    var index = url.slice(0,1)
    // console.log(index,url);
    // 得到下一个歌曲的下标
    var newIndex = (index + 1) % (songNumber.number)
    // 对象添加一个新的key
    var newUrl = songNumber[`${newIndex}`]
    console.log(newUrl,newIndex);
    // 替换src 并播放
    songs.setAttribute('src', newUrl)
    a.load()
    a.play()
    monitorPlay()
}

//  上一首歌曲
var topMusic = function () {
    // console.log('click');
    // 选择当前播放歌曲
    var songs = e('.song')
    // console.log(songs);
    // 获得当前播放歌曲的src
    var url = songs.getAttribute('src')
    var index = url.slice(0,1)
    // console.log(index,url);
    // 得到上一个歌曲的下标
    var newIndex = (index - 1 + (songNumber.number)) % (songNumber.number)
    // 对象添加一个新的key
    var newUrl = songNumber[`${newIndex}`]
    // console.log(newUrl,newIndex);
    // 替换src 并播放
    songs.setAttribute('src', newUrl)
    a.load()
    a.play()
    monitorPlay()
}

// 下一首按钮
var bindNextMusic = function(){
    var next = e('.next')
    bindEvent(next, 'click', function(){
        nextMusic()
        bindpattern()
    })
}

// 上一首按钮
var bindTopMusic = function () {
    var top = e('.top')
    bindEvent(top, 'click', topMusic)
}

// 绑定歌单点击事件
var bindlister = function(){
    bindAll('song', 'click', function (event) {
        // 找到被点击本身 并得到 value
        var self = event.target
        var songName = self.innerHTML
        // 选中 source 改变他的 src 属性
        var songs = e('.song')
        songs.setAttribute('src', songName)
        // 加载 并 播放
        a.load()
        a.play()
        monitorPlay()
    })
}

// 时间格式转换
var count = function(time) {
    var h = String (parseInt(time / 3600))
    var m =  String(parseInt(time % 3600 / 60))
    var s = String(parseInt(time % 60))
    if (h.length == 1) {
        h = '0' + h
    }
    if (m.length == 1) {
        m = '0' + m
    }
    if (s.length == 1) {
        s = '0' + s
    }
    var time = `${h}:${m}:${s}`
    if (h == '00') {
        time = `${m}:${s}`
    }
    return time
}


//获取当前时间
var currentTime = function() {
    var span = e('.now-time')
    var time = count(a.currentTime)
    span.innerText = time
}

// 获取歌曲总时长
var duration = function() {
    var span = e('.total-time')
    var time = count(a.duration)
    span.innerText = time
}

// 圆点 跟随 滑条
var setTimeInputDot = function() {
    var inp = e('.progress')
    var len = inp.value / 100 * 485
    var img = e('.images-progress-bar')
    img.style.cssText = `margin-left:${len}px;`
}

// 填充条 跟随 滑条
var setTimeInputProgress = function() {
    var inp = e('.progress')
    var len = inp.value / 100 * 496 + 11
    var img = e('.images-progress-finish')
    img.style.cssText = `width:${len}px;`
}


// 当播放时间改变时  调用 currentTime setTimeInputDot 函数
var bindNowTime = function() {
    bindEvent(a, 'timeupdate', function() {
        currentTime()
        setTimeInputDot()
        setTimeInputProgress()
    })
}

// 当歌曲已加载完成时 调用 duration 函数
var bindTotalTime = function() {
    bindEvent(a, 'loadedmetadata', duration)
}

//  歌曲进度条 播放时间改变 进度条百分比改变
var progressBar = function() {
    var progress = e('.progress')
    progress.value = a.currentTime / a.duration * 100
}

var bindProgressBar = function() {
    bindEvent(a, 'timeupdate', progressBar)
}

// 歌曲进度条 进度条改变 播放时间改变
var setTimeInput = function() {
    var progress = e('.progress')
    a.currentTime = progress.value * a.duration / 100
}

var bindsetTimeInput = function() {
    var progress = e('.progress')
    bindEvent(progress, 'input', function() {
        setTimeInput()
        setTimeInputDot()
        setTimeInputProgress()
    })
}

// 音量调节条
// 获得 input value 的值
var volume = function() {
    var volume = e('.volume')
    volume.value = a.volume * 100
}
// a.volume 改变时 调用 volume 函数
var bindVolume = function() {
    bindEvent(a, 'input', volume)
}
// 获得播放器音量的值为 0 - 1 的浮点数
var setVolume = function() {
    var volume = e('.volume')
    a.volume = volume.value / 100
}
// input 改变时 调用 setVolume 函数
var bindSetVolume = function() {
    var volume = e('.volume')
    bindEvent(volume, 'input', setVolume)
}

// 圆点 跟随 滑条
var setVloumeInputDot = function() {
    var volume = e('.volume')
    var len = volume.value / 100 * 447 - 125
    var img = e('.images-volume-bar')
    img.style.cssText = `margin-left:${len}px;`
}

// 填充条 跟随 滑条
var setVloumeInputProgress = function() {
    var volume = e('.volume')
    var len = volume.value / 100 * 460 + 32
    var img = e('.images-volume-max')
    img.style.cssText = `width:${len}px;`
}
// input 改变是 圆点 填充条 跟着改变
var bindChangeVloume = function() {
    var volume = e('.volume')
    bindEvent(volume, 'input', function() {
        setVloumeInputDot()
        setVloumeInputProgress()
    })
}


var _mian = function(){
    bindPlay()
    bindlister()
    bindNextMusic()
    bindTopMusic()
    bindNowTime()
    bindTotalTime()
    bindpattern()
    bindProgressBar()
    bindsetTimeInput()
    bindSetVolume()
    bindVolume()
    bindChangeVloume()
}

_mian()
