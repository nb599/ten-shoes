module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready on",
      startServerReadyTimeout: 60000,
      url: [
        "http://localhost:3000",
        "http://localhost:3000/blog/ai-features-in-frontend",
        "http://localhost:3000/blog/agent-ui-patterns",
        "http://localhost:3000/login",
        "http://localhost:3000/register",
      ],
      numberOfRuns: 3,
      settings: {
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 562.5,
          downloadThroughputKbps: 1474.56,
          uploadThroughputKbps: 675,
        },
        emulatedFormFactor: "mobile",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.9 }],

        // Core Web Vitals (移动端)
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],

        // 其他重要指标
        "speed-index": ["warn", { maxNumericValue: 3000 }],
        interactive: ["warn", { maxNumericValue: 3000 }],

        // 可访问性
        "color-contrast": "error",
        "image-alt": "error",
        label: "error",
        "link-name": "error",

        // 最佳实践
        "uses-https": "error",
        "uses-http2": "warn",
        "no-vulnerable-libraries": "error",
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
}
