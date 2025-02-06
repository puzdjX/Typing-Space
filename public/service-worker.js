// sw.js
// self.addEventListener('install', event => {
//   console.log('installed')
// })
// sw.js
console.log("Service Worker loaded "); // 打印日志，表示 Service Worker 已加载

const VERSION = "v1.0.4"; // 定义版本号，每次更新时改变这个值
const API_CACHE_NAME = `api-cache-${VERSION}`; // 定义 API 资源的缓存名称，包含版本号

// 当 Service Worker 首次安装时，它会被下载并存储在本地存储中。
self.addEventListener("install", (event) => {
  event.waitUntil(
    // 确保在 Service Worker 安装完成前，预缓存文件已被添加到缓存中
    caches.open(API_CACHE_NAME).then((cache) => {
      console.log("Cache opened");
    })
  );
});

// 当 Service Worker 激活时，它将接管网站的控制权。
self.addEventListener("activate", (event) => {
  console.log("activated");
  // 在这里可以进行一些激活操作，比如清理旧缓存。
  event.waitUntil(
    // 确保在 Service Worker 激活完成前，清理旧缓存
    caches.keys().then((cacheNames) => {
      // 获取所有缓存名称
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 清理旧版本的缓存
          if (cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 确保新的 Service Worker 能够立即接管
  return self.clients.claim();
});

// 监听 fetch 事件，拦截网络请求
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url); // 解析请求的 URL

  // 只缓存特定的文章数据接口
  if (
    requestUrl.origin === "https://ts.webt.club" && // 检查请求的域名
    requestUrl.pathname.startsWith("/api/v1/article/") && // 检查请求的路径是否以特定 API 路径开始
    event.request.method === "GET" // 检查请求方法是否为 GET
  ) {
    event.respondWith(
      // 对请求作出响应
      caches.match(event.request).then((cachedResponse) => {
        // 检查请求是否已经在缓存中
        if (cachedResponse) {
          return cachedResponse; // 如果在缓存中，则返回缓存的响应
        }
        return fetch(event.request) // 如果不在缓存中，则从网络获取
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const responseToCache = networkResponse.clone(); // 克隆响应，因为响应流只能被消费一次
              caches.open(API_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache); // 将响应存储到缓存中
              });
            }
            return networkResponse; // 返回网络响应
          })
          .catch(() => {
            // 如果网络请求失败，尝试返回缓存中的响应或者一个错误信息
            return (
              caches.match(event.request) ||
              new Response("No internet connection", {
                status: 503,
                statusText: "Service Unavailable",
              })
            );
          });
      })
    );
  } else {
    // 对于非文章数据接口的请求，直接通过网络获取，不进行缓存
    event.respondWith(fetch(event.request));
  }
});

// 再次监听 activate 事件，通知所有客户端 Service Worker 已更新
self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      return self.clients.matchAll().then((clients) => {
        // 获取所有客户端，并向它们发送消息以刷新页面
        clients.forEach((client) => client.postMessage({ action: "refresh" }));
      });
    })
  );
});

// 每次您想要更新 Service Worker 和缓存资源时，您都需要更改 VERSION 变量。这样做是为了确保：

// 新的 Service Worker 与旧的 Service Worker 不同，这样浏览器才会安装新的 Service Worker。
// 使用版本号作为缓存名称的一部分，可以确保每次更新时都会创建新的缓存，而旧的缓存可以被清理掉。
// 更改 VERSION 变量的方法可以是简单的递增数字（如 “v1” 到 “v2”），或者是使用更复杂的版本控制系统（如时间戳、哈希值等），这取决于您的具体需求和更新频率。

// 每次更新 Service Worker 时，按照以下步骤操作：

// 更改 VERSION 变量。
// 重新部署包含新 Service Worker 的网站。
// 当用户下次访问网站时，浏览器会检测到 Service Worker 文件的更改，并安装新的 Service Worker。
// 新的 Service Worker 安装后，会触发 install 事件，并使用新的缓存名称预缓存资源。
// 当新的 Service Worker 激活时，会触发 activate 事件，清理旧的缓存。
// 确保在更新 Service Worker 时遵循这些步骤，以保持应用的最新状态并避免用户遇到旧版本的问题。
