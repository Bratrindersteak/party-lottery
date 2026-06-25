export async function getSafeImageUrl(url: string): Promise<string> {
  try {
    // 1. 用 fetch 把图片当成文件硬啃下来
    const response = await fetch(url);
    const blob = await response.blob();

    // 2. 利用 FileReader 把文件揉成 Base64 字符串
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("兜底转换失败：", error);
    return url; // 失败了就返回原地址
  }
}

// 🚀 改装后的 Canvas 版纯前端图片转 Base64 绝杀函数
export function getSafeImageUrlByCanvas(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();

    // 1. 核心防御：礼貌索要，并且加一发随机时间戳，彻底干掉恶心的 CDN 缓存沙箱污染
    img.crossOrigin = 'anonymous';
    img.src = `${url}?t=${new Date().getTime()}`;

    // 2. 图片成功骗进浏览器后，开始秘密揉碎成 Base64
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 在画布上把图画出来
          ctx.drawImage(img, 0, 0);
          // 强行吐出 Base64 字符串！
          const base64Url = canvas.toDataURL('image/jpeg');
          resolve(base64Url);
          return;
        }
        resolve(url); // 异常兜底：返回原图
      } catch (e) {
        console.error("Canvas 还是被跨域污染了，进入兜底：", e);
        resolve(url);
      }
    };

    // 3. 如果连 img 加载都炸了，无脑返回原 URL
    img.onerror = () => {
      resolve(url);
    };
  });
}
