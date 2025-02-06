# ⌨️ Typing-Space

**打字训练平台** - 通过精准反馈提升打字节奏与准确性

[在线体验](https://ts.webt.club) | [问题反馈](https://github.com/puzdjX/Typing-Space/issues)

---

## 项目预览图像

<div align="center">
  <img src="./assets/GIF 2024-9-26 15-45-46.gif" alt="界面预览" width="70%">
</div>

## ✨ 核心功能

1. **用户认证**：
   - 支持注册和登录功能。
   - 登录后用户数据会被安全存储在本地缓存中。
2. **打字训练**：
   - 提供不同类型的文章（英文、中文等）。
   - 支持限时模式和自由模式。
   - 实时统计打字速度、正确率、进度等数据。
3. **比赛功能**：
   - 用户可以参与多人比赛，查看比赛结果和排名。
4. **小游戏**：
   - 提供趣味小游戏，增加打字练习的趣味性。
5. **数据分析**：
   - 使用 ECharts 提供练习数据的可视化展示，包括速度曲线图和热力图。
   - 支持查看个人和全局的最佳成绩、平均成绩等。
6. **排行榜**：
   - 每日排行榜，展示用户的打字成绩和排名。
7. **渐进式 Web 应用（PWA）**：
   - 支持离线访问和安装到主屏幕。

## 📦 技术依赖

- **Vue 3**：用于构建用户界面。
- **Vue Router**：实现单页面应用的路由管理。
- **Pinia**：轻量级状态管理工具。
- **GSAP**：实现流畅的动画效果。
- **ECharts**：数据可视化图表。
- **Vite**：快速构建工具，支持现代前端开发。

## 🚀 快速开始

本地开发

```bash
git clone https://github.com/puzdjX/Typing-Space.git
cd Typing-Space
npm install
npm run dev
```

生产构建

```bash
npm run build
npm run preview
```

## 🤝 贡献

欢迎任何形式的贡献！如果您有任何建议或发现了问题，请提交 Issue 或 Pull Request。

## 📜 许可证

本项目使用 MIT 许可证。