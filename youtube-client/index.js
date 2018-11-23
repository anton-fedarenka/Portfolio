let request;
function someFunc(e) {
	e.preventDefault();
    request = document.getElementById("search").value;

loadVideos().then( (data) => {
    getVideoInfo(data, videoInfo);
    getVideoStatistics(videoInfo)/*.then ( (data) => {
        videoInfo.viewCount = data.items[0].statistics.viewCount;
        videoInfo.dislikeCount = data.items[0].statistics.dislikeCount;
        videoInfo.likeCount = data.items[0].statistics.likeCount;
    });*/
    let url = videoInfo.videoThumbnail[0];
    console.log(videoInfo);
    document.getElementById('first').innerHTML = `<img src=${url} alt = video-preview>`;
});
}
document.getElementById("btn").onclick = someFunc;
let videoInfo = {};

function loadVideos() {
    let url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&type=video&maxResults=8&part=snippet&q=${request}`;
	return fetch(url)
		.then(response => response.json())
}

function getVideoInfo(data, objInfo) {
    objInfo.videoThumbnail = [];
    objInfo.publicationDate = [];
    objInfo.videoTitle = [];
    objInfo.videoDescription = [];
    objInfo.videoAuthor = [];
    objInfo.id = [];
    objInfo.videoUrl = [];
    objInfo.viewCount = [];
    objInfo.dislikeCount = [];
    objInfo.likeCount = [];
    for(let i = 0; i < 8; i++) {
        objInfo.videoThumbnail[i] = data.items[i].snippet.thumbnails.medium.url;
        objInfo.publicationDate[i] = data.items[i].snippet.publishedAt;
        objInfo.videoTitle[i] = data.items[i].snippet.title;
        objInfo.videoDescription[i] = data.items[i].snippet.description;
        objInfo.videoAuthor[i] = data.items[i].snippet.channelTitle;
        objInfo.id[i] = data.items[i].id.videoId;
        objInfo.videoUrl[i] = `https://www.youtube.com/watch?v=${objInfo.id[i]}`;
    }
    /*objInfo.videoThumbnail = data.items[0].snippet.thumbnails.medium.url;
    objInfo.publicationDate = data.items[0].snippet.publishedAt;
    objInfo.videoTitle = data.items[0].snippet.title;
    objInfo.videoDescription = data.items[0].snippet.description;
    objInfo.videoAuthor = data.items[0].snippet.channelTitle;
    objInfo.id = data.items[0].id.videoId;*/
}

function getVideoStatistics(objInfo) {
    for(let i = 0; i < 8; i++) {
        let url = `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&part=statistics&id=${objInfo.id[i]}`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            objInfo.viewCount[i] = data.items[0].statistics.viewCount;
            objInfo.dislikeCount[i] = data.items[0].statistics.dislikeCount
            objInfo.likeCount[i] = data.items[0].statistics.likeCount;
            console.log(i);
        })
    }

    /*let url = `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&part=statistics&id=${objInfo.id[i]}`;
    return fetch(url)
    .then(response => response.json())
    .then(data => objInfo.data.push(data))*/
}
