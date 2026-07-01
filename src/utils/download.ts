export async function triggerDownload(fileUrl: string, defaultName: string) {
  try {
    // 用 fetch 把资源当成二进制大对象（Blob）硬拽下来
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // 动态打入 <a> 标签引爆下载
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = defaultName;
    document.body.appendChild(link);
    link.click();

    // 🧼 擦屁股释放内存
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    // 兜底：万一 fetch 跨域或失败，退回普通新窗口打开
    window.open(fileUrl, '_blank');
  }
}
