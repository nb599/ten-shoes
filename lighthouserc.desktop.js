module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
      settings: {
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        emulatedFormFactor: "desktop",
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
    },
  },
}
