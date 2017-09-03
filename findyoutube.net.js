// ==UserScript==
// @name      Download Youtube videos and subtitles
// @namespace  https://www.findhao.net
// @version    0.2.9
// @description  获取youtube视频和字幕的下载链接
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://s.ytimg.com/yts/jsbin/html5player*
// @match https://s.ytimg.com/yts/jsbin/html5player*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @copyright  2017+, Find
// @author FindHao
// ==/UserScript==
$(document).ready(function () {

    var BUTTON_TEXT = {
        'ar': 'تنزيل',
        'cs': 'Stáhnout',
        'de': 'Herunterladen',
        'en': 'Download',
        'es': 'Descargar',
        'fr': 'Télécharger',
        'hi': 'डाउनलोड',
        'hu': 'Letöltés',
        'id': 'Unduh',
        'it': 'Scarica',
        'ja': 'ダウンロード',
        'ko': '내려받기',
        'pl': 'Pobierz',
        'pt': 'Baixar',
        'ro': 'Descărcați',
        'ru': 'Скачать',
        'tr': 'İndir',
        'zh': '下载',
        'zh-TW': '下載'
    };
    var BUTTON_TOOLTIP = {
        'ar': 'تنزيل هذا الفيديو',
        'cs': 'Stáhnout toto video',
        'de': 'Dieses Video herunterladen',
        'en': 'Download this video',
        'es': 'Descargar este vídeo',
        'fr': 'Télécharger cette vidéo',
        'hi': 'वीडियो डाउनलोड करें',
        'hu': 'Videó letöltése',
        'id': 'Unduh video ini',
        'it': 'Scarica questo video',
        'ja': 'このビデオをダウンロードする',
        'ko': '이 비디오를 내려받기',
        'pl': 'Pobierz plik wideo',
        'pt': 'Baixar este vídeo',
        'ro': 'Descărcați acest videoclip',
        'ru': 'Скачать это видео',
        'tr': 'Bu videoyu indir',
        'zh': '下载此视频',
        'zh-TW': '下載此影片'
    };
    var RANDOM = 7489235179; // Math.floor(Math.random()*1234567890);
    var CONTAINER_ID = 'download-youtube-video' + RANDOM;

    function isMaterial() {
        var temp;
        temp = document.querySelector("ytd-app, [src*='polymer'],link[href*='polymer']");
        if (temp && !document.getElementById("material-notice")) {
            return true;
        }
        return false;
    }

    function init() {
        unsafeWindow.caption_array = [];
        inject_our_script();
        first_load = false;

    }

    function inject_our_script() {
        var div_www_findyoutube_net = document.createElement('div'),
            buttonElement = document.createElement('button');
        controls = document.getElementById('watch7-headline');  // Youtube video title DIV
        div_www_findyoutube_net.setAttribute('style', "display: table;margin-top:4px;border: 1px solid rgb(0, 183, 90);cursor: pointer; color: rgb(255, 255, 255);             border-top-left-radius: 3px;border-top-right-radius: 3px;border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; background-color: #00B75A;padding: 4px;padding-right: 8px;");

        var form1 = document.createElement("form");
        form1.id = "post";
        form1.name = "post";
        form1.method = "post";
        form1.target = "_blank";
        form1.action = "http://www.findyoutube.net/";
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "url";
        input.value = window.location.href;
        document.body.appendChild(form1);
        form1.appendChild(input);
        buttonElement.id = "www-findyoutube-net-button";
        buttonElement.className = "style-scope ytd-button-renderer style-default";
        buttonElement.innerHTML = "Download video and subtitles";
        buttonElement.setAttribute('style', "width:300px;height:30px;");
        div_www_findyoutube_net.id = 'youtube-downloader-by-findyoutube-net';
        buttonElement.addEventListener('click', function () {
            form1.submit();
        }, false);

        div_www_findyoutube_net.appendChild(buttonElement);
        // put <select> into <div>

        // put the div into page: new material design
        var title_element = document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer');
        if (title_element) {
            $(title_element[0]).after(div_www_findyoutube_net);
        }
        // put the div into page: old version
        if (controls) {
            controls.appendChild(div_www_findyoutube_net);
        }


    }

    if (isMaterial()) {

        init();

    } else {


        start();

        function start() {
            var pagecontainer = document.getElementById('page-container');
            if (!pagecontainer) return;
            if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) run();
            var isAjax = /class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
            var logocontainer = document.getElementById('logo-container');
            if (logocontainer && !isAjax) { // fix for blocked videos
                isAjax = (' ' + logocontainer.className + ' ').indexOf(' spf-link ') >= 0;
            }
            var content = document.getElementById('content');
            if (isAjax && content) { // Ajax UI
                var mo = window.MutationObserver || window.WebKitMutationObserver;
                if (typeof mo !== 'undefined') {
                    var observer = new mo(function (mutations) {
                        mutations.forEach(function (mutation) {
                            if (mutation.addedNodes !== null) {
                                for (var i = 0; i < mutation.addedNodes.length; i++) {
                                    if (mutation.addedNodes[i].id == 'watch7-main-container') { // || id=='watch7-container'
                                        run();
                                        break;
                                    }
                                }
                            }
                        });
                    });
                    observer.observe(content, {childList: true, subtree: true}); // old value: pagecontainer
                } else { // MutationObserver fallback for old browsers
                    pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
                }
            }
        }

        function run() {
            var args = null;
            var usw = (typeof this.unsafeWindow !== 'undefined') ? this.unsafeWindow : window; // Firefox, Opera<15
            if (usw.ytplayer && usw.ytplayer.config && usw.ytplayer.config.args) {
                args = usw.ytplayer.config.args;
            }
            var videoID = null;
            if (args) {
                videoID = args['video_id'];
            }
            var language = document.documentElement.getAttribute('lang');
            // find parent container
            var newWatchPage = false;
            var parentElement = document.getElementById('watch7-action-buttons');
            if (parentElement == null) {
                parentElement = document.getElementById('watch8-secondary-actions');
                if (parentElement == null) {
                    console.log('DYVAM Error - No container for adding the download button. YouTube must have changed the code.');
                    return;
                } else {
                    newWatchPage = true;
                }
            }
            // get button labels
            var buttonText = (BUTTON_TEXT[language]) ? BUTTON_TEXT[language] : BUTTON_TEXT['en'];
            var buttonLabel = (BUTTON_TOOLTIP[language]) ? BUTTON_TOOLTIP[language] : BUTTON_TOOLTIP['en'];

            // generate download code for regular interface
            var mainSpan = document.createElement('span');

            if (newWatchPage) {
                var spanIcon = document.createElement('span');
                spanIcon.setAttribute('class', 'yt-uix-button-icon-wrapper');
                var imageIcon = document.createElement('img');
                imageIcon.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
                imageIcon.setAttribute('class', 'yt-uix-button-icon');
                imageIcon.setAttribute('style', 'width:20px;height:20px;background-size:20px 20px;background-repeat:no-repeat;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABG0lEQVRYR+2W0Q3CMAxE2wkYAdiEEWADmIxuACMwCmzABpCTEmRSO7YTQX+ChECV43t2nF7GYeHPuLD+0AKwC/DnWMAp/N5qimkBuAfBdRTF/+2/AV6ZYFUxVYuicAfoHegd6B3oHfhZB+ByF+JyV8FkrAB74pqH3DU5L3iGoBURhdVODIQF4EjEkWLmmhYALOQgNIBcHHke4buhxXAAaFnaAhqbQ5QAOHHkwhZ8balkx1ICCiEBWNZ+CivdB7REHIC2ZjZK2oWklDDdB1NSdCd/Js2PqQMpSIKYVcM8kE6QCwDBNRCqOBJrW0CL8kCYxL0A1k6YxWsANAiXeC2ABOEWbwHAWrwxpzgkmA/JtIqnxTOElmPnjlkc4A3FykAhA42AxwAAAABJRU5ErkJggg==);');
                spanIcon.appendChild(imageIcon);
                mainSpan.appendChild(spanIcon);
            }

            var spanButton = document.createElement('span');
            spanButton.setAttribute('class', 'yt-uix-button-content');
            spanButton.appendChild(document.createTextNode(buttonText + ' '));
            mainSpan.appendChild(spanButton);

            if (!newWatchPage) { // old UI
                var imgButton = document.createElement('img');
                imgButton.setAttribute('class', 'yt-uix-button-arrow');
                imgButton.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
                mainSpan.appendChild(imgButton);
            }

            var listItems = document.createElement('ol');
            listItems.setAttribute('style', 'display:none;');
            listItems.setAttribute('class', 'yt-uix-button-menu');
            // mainSpan.appendChild(listItems);
            var buttonElement = document.createElement('button');
            if (newWatchPage) {
                buttonElement.setAttribute('class', 'yt-uix-button  yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip');
            } else { // old UI
                buttonElement.setAttribute('class', 'yt-uix-button yt-uix-tooltip yt-uix-button-empty yt-uix-button-text');
                buttonElement.setAttribute('style', 'margin-top:4px; margin-left:' + 5 + 'px;');
            }
            buttonElement.setAttribute('type', 'button');
            buttonElement.setAttribute('role', 'button');
            var form1 = document.createElement("form");
            form1.id = "post";
            form1.name = "post";
            form1.method = "post";
            form1.target = "_blank";
            form1.action = "http://www.findyoutube.net/";
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "url";
            input.value = window.location.href;
            document.body.appendChild(form1);
            form1.appendChild(input);

            buttonElement.addEventListener("click", function () {
                form1.submit();
            });
            // buttonElement.addEventListener('click', function () { return false; }, false);
            buttonElement.appendChild(mainSpan);
            var containerSpan = document.createElement('span');
            containerSpan.setAttribute('id', CONTAINER_ID);
            containerSpan.appendChild(document.createTextNode(' '));
            containerSpan.appendChild(buttonElement);
            document.body.appendChild(form1);

            // add the button
            if (!newWatchPage) { // watch7
                parentElement.appendChild(containerSpan);
            } else { // watch8
                parentElement.insertBefore(containerSpan, parentElement.firstChild);
            }
        }
    }

});