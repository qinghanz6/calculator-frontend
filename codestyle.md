# 前端代码规范

参考来源：[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)。采用其命名、const/let 和清晰作用域原则，以下为本项目约定。

- UTF-8；JavaScript 使用 2 空格缩进、分号和双引号。
- 优先 const，需要重新赋值时用 let；变量/函数使用 lowerCamelCase。
- HTML、CSS、行为脚本和 API 配置分文件保存。
- 前端只收集表达式和显示后端结果，不使用 eval 计算。
- 使用 async/await 发请求，处理 HTTP 错误、断网和超时。
- 用户输入、历史记录使用 textContent 显示，不拼入 innerHTML。
- 按钮有清晰文字或可访问名称；支持键盘与手机布局。
