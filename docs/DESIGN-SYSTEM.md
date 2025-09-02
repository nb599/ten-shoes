# 天书 - 设计系统规范

## 概述

天书采用现代化的深色主题设计系统，灵感来源于 GitHub Dark、VS Code Dark 和 Linear 等优秀产品的设计语言。

## 🎨 色彩系统

### 主色调 (Primary Colors)
\`\`\`css
/* 品牌色 - 温暖的金色系 */
--primary-50: #fffbeb;
--primary-100: #fef3c7;
--primary-200: #fde68a;
--primary-300: #fcd34d;
--primary-400: #fbbf24;
--primary-500: #f59e0b;  /* 主品牌色 */
--primary-600: #d97706;
--primary-700: #b45309;
--primary-800: #92400e;
--primary-900: #78350f;
\`\`\`

### 中性色 (Neutral Colors)
\`\`\`css
/* 深色主题基础色 */
--neutral-50: #fafafa;
--neutral-100: #f5f5f5;
--neutral-200: #e5e5e5;
--neutral-300: #d4d4d4;
--neutral-400: #a3a3a3;
--neutral-500: #737373;
--neutral-600: #525252;
--neutral-700: #404040;
--neutral-800: #262626;
--neutral-900: #171717;
--neutral-950: #0a0a0a;
\`\`\`

### 语义色 (Semantic Colors)
\`\`\`css
/* 成功 */
--success-400: #4ade80;
--success-500: #22c55e;
--success-600: #16a34a;

/* 警告 */
--warning-400: #facc15;
--warning-500: #eab308;
--warning-600: #ca8a04;

/* 错误 */
--error-400: #f87171;
--error-500: #ef4444;
--error-600: #dc2626;

/* 信息 */
--info-400: #60a5fa;
--info-500: #3b82f6;
--info-600: #2563eb;
\`\`\`

### 表面色 (Surface Colors)
\`\`\`css
/* 深色主题表面 */
--surface-primary: #0d1117;      /* 主背景 */
--surface-secondary: #161b22;    /* 卡片背景 */
--surface-tertiary: #21262d;     /* 悬浮背景 */
--surface-quaternary: #30363d;   /* 边框色 */
--surface-overlay: #1c2128;      /* 弹窗背景 */
\`\`\`

### 文本色 (Text Colors)
\`\`\`css
/* 深色主题文本 */
--text-primary: #f0f6fc;         /* 主要文本 */
--text-secondary: #8b949e;       /* 次要文本 */
--text-tertiary: #6e7681;        /* 辅助文本 */
--text-placeholder: #484f58;     /* 占位符文本 */
--text-disabled: #3d444d;        /* 禁用文本 */
--text-inverse: #24292f;         /* 反色文本 */
\`\`\`

## 🔤 字体系统

### 字体族
\`\`\`css
/* 主字体 */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;

/* 等宽字体 */
--font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;

/* 中文字体 */
--font-zh: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', sans-serif;
\`\`\`

### 字体大小
\`\`\`css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
\`\`\`

### 字重
\`\`\`css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
\`\`\`

## 📏 间距系统

### 基础间距
\`\`\`css
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
--space-24: 6rem;        /* 96px */
\`\`\`

## 🔘 组件规范

### 按钮 (Buttons)
\`\`\`css
/* 主要按钮 */
.btn-primary {
  background: var(--primary-500);
  color: var(--text-inverse);
  border: 1px solid var(--primary-600);
}

.btn-primary:hover {
  background: var(--primary-600);
  border-color: var(--primary-700);
}

/* 次要按钮 */
.btn-secondary {
  background: var(--surface-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--surface-quaternary);
}

.btn-secondary:hover {
  background: var(--surface-quaternary);
}

/* 幽灵按钮 */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid transparent;
}

.btn-ghost:hover {
  background: var(--surface-tertiary);
  color: var(--text-primary);
}
\`\`\`

### 输入框 (Inputs)
\`\`\`css
.input {
  background: var(--surface-secondary);
  color: var(--text-primary);
  border: 1px solid var(--surface-quaternary);
  placeholder-color: var(--text-placeholder);
}

.input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.input::placeholder {
  color: var(--text-placeholder);
}
\`\`\`

### 卡片 (Cards)
\`\`\`css
.card {
  background: var(--surface-secondary);
  border: 1px solid var(--surface-quaternary);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.card:hover {
  border-color: var(--surface-quaternary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
\`\`\`

## 🎭 交互状态

### 悬浮状态 (Hover)
- 背景色变化：+10% 亮度
- 边框色变化：+15% 亮度
- 过渡时间：150ms ease-out

### 激活状态 (Active)
- 背景色变化：-5% 亮度
- 缩放：scale(0.98)
- 过渡时间：100ms ease-out

### 焦点状态 (Focus)
- 外发光：0 0 0 3px rgba(primary-color, 0.1)
- 边框色：primary-500

### 禁用状态 (Disabled)
- 透明度：0.5
- 鼠标样式：not-allowed

## 📱 响应式断点

\`\`\`css
/* 移动端 */
@media (max-width: 640px) { /* sm */ }

/* 平板端 */
@media (max-width: 768px) { /* md */ }

/* 桌面端 */
@media (max-width: 1024px) { /* lg */ }

/* 大屏幕 */
@media (max-width: 1280px) { /* xl */ }

/* 超大屏幕 */
@media (max-width: 1536px) { /* 2xl */ }
\`\`\`

## 🌗 深色主题适配

### 原则
1. **对比度优先**：确保文本与背景有足够对比度 (WCAG AA: 4.5:1)
2. **层次清晰**：通过不同深度的灰色建立视觉层次
3. **色彩克制**：主要使用中性色，品牌色作为点缀
4. **护眼优先**：避免纯黑纯白，使用柔和的深色调

### 实现策略
- 使用 CSS 变量实现主题切换
- 组件级别的主题适配
- 图片和图标的深色模式适配

## 🎯 可访问性 (Accessibility)

### 颜色对比度
- 正文文本：至少 4.5:1
- 大文本：至少 3:1
- 非文本元素：至少 3:1

### 焦点管理
- 所有交互元素必须有明显的焦点状态
- 键盘导航顺序合理
- 跳过链接支持

### 语义化
- 使用语义化 HTML 标签
- 适当的 ARIA 标签
- 图片必须有 alt 属性

## 📋 使用指南

### 开发规范
1. 优先使用设计系统中定义的颜色变量
2. 遵循组件的标准样式和交互状态
3. 确保新组件符合可访问性要求
4. 在不同设备上测试响应式效果

### 扩展原则
1. 新增颜色必须考虑深色主题适配
2. 新组件应该复用现有的设计 token
3. 保持设计的一致性和简洁性

---

*最后更新：2025-01-26*
*版本：v1.0*
