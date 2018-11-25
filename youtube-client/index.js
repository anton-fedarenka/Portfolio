document.body.innerHTML = "<div class='search-form'><form><button type='submit' id='btn'></button><input type='search' placeholder='Video search' id='search'></form></div><section id='section'></section>";

document.getElementById("btn").onclick = loadVideos;

function loadVideos(e) {
	e.preventDefault();
    let request = document.getElementById("search").value;

    getVideoData(request)
    .then( data => {
            let videoInfo = getVideoSnippets(data);
            return videoInfo;
        })
        .then(videoInfo => {
            getVideos(videoInfo);
            return videoInfo;
        })
        .then( videoInfo => {
            let videoNum = addSectionDiv();
            addVideo(videoInfo, 0, videoNum);
            addSlider(videoInfo, videoNum);
        })
}

function getVideoData(request) {
    let url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&type=video&maxResults=8&part=snippet&q=${request}`;
	return fetch(url)
		.then(response => response.json())
}

function getVideoSnippets(data) {
    let videoInfo = {
        videoThumbnail: [],
        publicationDate: [],
        videoTitle: [],
        videoDescription: [],
        videoAuthor: [],
        id: [],
        videoUrl: [],
        viewCount: [],
        likeCount: []
    };
    for(let i = 0; i < 8; i++) {
        videoInfo.videoThumbnail[i] = data.items[i].snippet.thumbnails.medium.url;
        videoInfo.publicationDate[i] = data.items[i].snippet.publishedAt;
        videoInfo.videoTitle[i] = data.items[i].snippet.title;
        videoInfo.videoDescription[i] = data.items[i].snippet.description;
        videoInfo.videoAuthor[i] = data.items[i].snippet.channelTitle;
        videoInfo.id[i] = data.items[i].id.videoId;
        videoInfo.videoUrl[i] = `https://www.youtube.com/watch?v=${videoInfo.id[i]}`;
    }
    return videoInfo;
}

function getVideos(videoInfo) {
    let arr = [];
    for(let i = 0; i < 8; i++) {
        arr[i] = getVideoStatistics(videoInfo, i);
    }
    Promise.all(arr);
}

function getVideoStatistics(videoInfo, i) {
    let url = `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&part=statistics&id=${videoInfo.id[i]}`;
    return fetch(url)
    .then(response => response.json())
    .then(data => {
        videoInfo.viewCount[i] = data.items[0].statistics.viewCount;
        videoInfo.likeCount[i] = data.items[0].statistics.likeCount;
    })
}

function addSectionDiv() {
    if (document.documentElement.clientWidth <= 1200 && document.documentElement.clientWidth > 700) {
        document.getElementById("section").innerHTML = "<div class='video-load'><div class='video' id='video0'></div><div class='video' id='video1'></div></div><div class='video-slider' id='slider'></div>";
        return 2;
    } else if (document.documentElement.clientWidth <= 700) {
        document.getElementById("section").innerHTML = "<div class='video-load'><div class='video' id='video0'></div></div><div class='video-slider' id='slider'></div>";
        return 1;
    } else {
        document.getElementById("section").innerHTML = "<div class='video-load'><div class='video' id='video0'></div><div class='video' id='video1'></div><div class='video' id='video2'></div><div class='video' id='video3'></div></div><div class='video-slider' id='slider'></div>";
        return 4;
    }

}

function addVideo(videoInfo, start, end) {
    for(let i = start; i < end; i++) {
        if (videoInfo.videoDescription[i] == '') {videoInfo.videoDescription[i] = "No video description"};
        let data = videoInfo.publicationDate[i].substr(0, 10);
        videoList = document.getElementsByClassName('video');
        videoList[(i - start)].innerHTML =  `<figure><img src=${videoInfo.videoThumbnail[i]} alt = video-preview><figcaption><a href=${videoInfo.videoUrl[i]}>${videoInfo.videoTitle[i]}</a></figcaption></figure>
        <table class="video-info"><tr><td><i class="fa fa-male"></i></td><td>${videoInfo.videoAuthor[i]}</td></tr>
        <tr><td><i class="fa fa-calendar"></i></td><td>${data}</td></tr>
        <tr><td><i class="fa fa-eye"></i></td><td>${videoInfo.viewCount[i]}</td></tr>
        <tr><td><i class="fa fa-thumbs-up"></i></td><td>${videoInfo.likeCount[i]}</td></tr>
        </table><div class="video-description"><p>${videoInfo.videoDescription[i]}</p></div>`;
    }
}

function addSlider(videoInfo, videoNum) {
    if (videoNum === 4) {
        document.getElementById("slider").innerHTML = "<div class='video-info-nav'><a class='current video-nav' href='#' data-slide='0'>1</a><a class='video-nav' href='#' data-slide='1'>2</a></div>";
    } else if (videoNum == 2) {
        document.getElementById("slider").innerHTML = "<div class='video-info-nav'><a class='current video-nav' href='#' data-slide='0'>1</a><a class='video-nav' href='#' data-slide='1'>2</a><a class='video-nav' href='#' data-slide='2'>3</a><a class='video-nav' href='#' data-slide='3'>4</a></div>";
    } else {
        document.getElementById("slider").innerHTML = "<div class='video-info-nav'><a class='current video-nav' href='#' data-slide='0'>1</a><a class='video-nav' href='#' data-slide='1'>2</a><a class='video-nav' href='#' data-slide='2'>3</a><a class='video-nav' href='#' data-slide='3'>4</a><a class='video-nav' href='#' data-slide='4'>5</a><a class='video-nav' href='#' data-slide='5'>6</a><a class='video-nav' href='#' data-slide='6'>7</a><a class='video-nav' href='#' data-slide='7'>8</a></div>";
    }

    let videoSlides = document.getElementsByClassName('video-nav');;
    for (let i = 0; i < videoSlides.length; i++) {
        let n = i*videoNum;
        videoSlides[i].addEventListener('click', e => {
            addVideo(videoInfo, n, (n+videoNum));
            [].forEach.call(videoSlides, item => item.classList.remove('current'));
            videoSlides[i].classList.add('current');
        });
    }
}
