// 元素
var oPreviewContainer = document.createElement('div'); // 预览图整体容器
var oStyle = document.createElement('style'); // 样式
var oMask = document.createElement('div'); // 遮罩层
var oContentBlock = document.createElement('div'); // 内容块
var oPreviewBlock = document.createElement('div'); // 预览图块
var oControlBlock = document.createElement('div'); // 操作块
var oTips = document.createElement('div'); // 下载提示
var oADownload = document.createElement('a'); // 下载按钮
var btnClose = document.createElement('div'); // 关闭按钮

// 样式
oPreviewContainer.classList.add('z-previewContainer');
oMask.classList.add('z-mask');
oContentBlock.classList.add('z-contentBlock');
oPreviewBlock.classList.add('z-previewBlock');
oControlBlock.classList.add('z-controlBlock');
oTips.classList.add('z-downloadTips');
oADownload.classList.add('z-downloadBtn');
btnClose.classList.add('z-btnClose');

oStyle.innerHTML = '.z-previewContainer { display: none; position: fixed; z-index: 9999; top: 0; right: 0; bottom: 0; left: 0;}' +
'.z-previewContainer .z-mask { position: fixed; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0, 0, 0, .6);}' +
'.z-previewContainer .z-contentBlock { position: relative; display: flex; flex-direction: column; justify-content: center; margin: 0 auto; max-width: 80%; height: 100%;}' +
'.z-previewContainer .z-contentBlock .z-previewBlock { position: relative; flex: 0 0 90vh; height: 90vh; overflow: auto;}' +
'.z-previewContainer .z-contentBlock .z-controlBlock { position: relative; margin-top: 15px; min-height: 32px; display: flex; justify-content: flex-start; align-items: center;}' +
'.z-previewContainer .z-contentBlock .z-controlBlock .z-downloadTips { font-weight: bold; font-size: 12px; color: #e64340;}' +
'.z-previewContainer .z-contentBlock .z-controlBlock .z-downloadBtn { cursor: pointer; box-sizing: border-box; margin-left: 15px; border: 1px #bbb solid; border-radius: 3px; padding: 4px 12px; background: #fff; line-height: 1.8; font-size: 12px; color: #333;}' +
'.z-previewContainer .z-contentBlock .z-controlBlock .z-downloadBtn:hover { opacity: .75;}' +
'.z-previewContainer .z-contentBlock .z-controlBlock .z-btnClose { cursor: pointer; position: absolute; top: 50%; margin-top: -15px; right: 0; width: 30px; height: 30px; background: url(../images/close.png) no-repeat center center;}' +
'.z-previewContainer .z-contentBlock .z-controlBlock .z-btnClose:hover { opacity: .75;}';

// 元素添加到页面
oPreviewContainer.appendChild(oStyle);
oPreviewContainer.appendChild(oMask);
oPreviewContainer.appendChild(oContentBlock);
oContentBlock.appendChild(oPreviewBlock);
oContentBlock.appendChild(oControlBlock);
oControlBlock.appendChild(oTips);
oControlBlock.appendChild(oADownload);
oControlBlock.appendChild(btnClose);

oTips.innerHTML = '下载原图功能仅用于测试海报效果，<br>不可直接传播使用。';
oADownload.innerHTML = '下载原图'
btnClose.onclick = function () {
  hideZPreview();
}

document.body.appendChild(oPreviewContainer);

// 操作
function showZPreview (sImgSrc, aQrcode, bShowDownloadBtn) {
  // 预览图整体容器 出现
  oPreviewContainer.style.display = 'block';
  // 初始化图片 二维码
  oPreviewBlock.innerHTML = '';
  var oDiv = document.createElement('div'); // 预览图和二维码容器
  var oImg = document.createElement('img'); // 预览图
  oDiv.appendChild(oImg);
  oImg.src = sImgSrc;
  oImg.onload = function () {
    var scale = oPreviewBlock.clientWidth / oImg.width;
    oDiv.style.width = oImg.width * scale + 'px';
    oDiv.style.height = oImg.height * scale + 'px';
    oDiv.style.transformOrigin = 'top left';
    oDiv.style.transform = 'scale(' + scale + ')';
    oDiv.style.webkitTransform = 'scale(' + scale + ')';
    oPreviewBlock.style.scrollHeight = oPreviewBlock.scrollHeight * scale + 'px';
  };
  aQrcode.forEach(function (item, index) {
    var oImg = document.createElement('img');
    oImg.style.position = 'absolute';
    oImg.style.top = item.y + 'px';
    oImg.style.left = item.x + 'px';
    oImg.style.width = item.w + 'px';
    oImg.style.height = item.w + 'px';
    oImg.src = item.src
    oDiv.appendChild(oImg)
  });
  oPreviewBlock.appendChild(oDiv);
  // 是否显示下载按钮
  if (bShowDownloadBtn) {
    oTips.style.display = 'block';
    oADownload.style.display = 'block';
  } else {
    oTips.style.display = 'none';
    oADownload.style.display = 'none';
  }
}
function hideZPreview () {
  // 预览图整体容器 隐藏
  oPreviewBlock.scrollTop = 0;
  oPreviewContainer.style.display = 'none';
}