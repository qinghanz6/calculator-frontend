# 算一下 · 计算器前端

HTML + CSS + 原生 JavaScript，无需 Node.js 构建。包含数字/运算符按键、输入框、结果、错误提示、历史列表和单条删除。核心计算由 Java 后端完成。

## 本地运行

1. 本地开发时将 `config.js` 的地址改为 `http://127.0.0.1:8080`，启动后端，确认 `http://127.0.0.1:8080/api/hello` 可访问。发布到 GitHub Pages 前恢复线上地址。
2. 使用 VS Code Live Server 打开 index.html，端口 5500。
3. 在网页输入 `(1+2)*3`，结果应为 9，历史自动更新。

也可在安装 Python 后运行 `python -m http.server 5500 --bind 127.0.0.1`。不要通过 file:// 打开。

## 配置

当前配置的线上后端为 `https://calculator-backend-n0sa.onrender.com`。Render 免费服务可能休眠，前端请求最多等待 120 秒，并显示等待提示。超时后先刷新历史确认是否保存，避免重复提交。

`config.js` 中的 CALCULATOR_API_BASE 指定后端地址。本地为 `http://127.0.0.1:8080`；独立公网前端改成后端 HTTPS 地址，并在后端 ALLOWED_ORIGINS 中加入前端的源（协议+域名+端口，不带路径）。前后端同域反向代理时设为空字符串。

HTTPS 前端不可请求 HTTP 后端。浏览器中的 localhost 指访问者自己的电脑，发布时不能继续指向本地地址。

## 文件

- index.html：页面结构。
- styles.css：桌面和手机布局。
- app.js：请求、显示、历史刷新和删除；不执行数学表达式计算。
- config.js：本地/独立托管配置。
- Dockerfile、nginx.conf、config.container.js：同域容器部署模板。

删除先要求确认，再请求后端，成功后刷新数据库查询结果。Enter 计算，Esc 清空。结果采用后端 resultText，避免浏览器大整数精度损失。DOM 数据显示使用 textContent。

## 部署与验证

静态文件可托管在 GitHub Pages；Java 后端仍须单独托管，H2 要使用持久磁盘。同一服务器部署可使用 Dockerfile 配合后端容器；nginx 将 /api/ 代理至 calculator-backend:8080。

验证加减乘除、优先级、括号、负数、小数、除零、非法输入、刷新历史、删除后刷新及后端断开提示。实际公网地址、后端仓库链接需在发布后填写。
