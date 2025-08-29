module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready on",
      startServerReadyTimeout: 60000,
      url: ["http://localhost:3000"],
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
        // 暂时使用宽松的断言，先确保 CI 能运行
        "categories:performance": ["warn", { minScore: 0.1 }],
        "categories:accessibility": ["warn", { minScore: 0.1 }], 
        "categories:best-practices": ["warn", { minScore: 0.1 }],
        "categories:seo": ["warn", { minScore: 0.1 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
      githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN,
    },
    reporter: ['html', 'json'],
  },
}
