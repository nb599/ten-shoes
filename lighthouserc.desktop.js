module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready on",
      startServerReadyTimeout: 30000,
      url: [
        "http://localhost:3000",
        "http://localhost:3000/blog/ai-features-in-frontend",
        "http://localhost:3000/blog/agent-ui-patterns",
        "http://localhost:3000/login",
        "http://localhost:3000/register",
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
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
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.9 }],

        // Core Web Vitals (桌面端更严格)
        "first-contentful-paint": ["warn", { maxNumericValue: 1200 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 1500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "total-blocking-time": ["warn", { maxNumericValue: 150 }],

        "speed-index": ["warn", { maxNumericValue: 1500 }],
        interactive: ["warn", { maxNumericValue: 2000 }],
      },
    },
    upload: {
      target: "filesystem", 
      outputDir: ".lighthouseci",
    },
  },
}
