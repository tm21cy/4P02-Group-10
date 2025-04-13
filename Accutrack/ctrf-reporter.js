const fs = require('fs');

class CTRFReporter {
  constructor(options) {
    this.outputFile = options.outputFile || 'test-results.json';
    this.results = {
      results: {
        tool: { name: 'playwright' },
        summary: {
          tests: 0, passed: 0, failed: 0, pending: 0, skipped: 0, other: 0,
          start: Date.now(), stop: null
        },
        tests: []
      }
    };
  }

  onTestEnd(test, result) {
    this.results.results.summary.tests++;
    this.results.results.summary[result.status]++;

    this.results.results.tests.push({
      name: test.title,
      duration: result.duration,
      status: result.status,
      rawStatus: result.status,
      type: 'unit',
      filePath: test.location?.file,
      retries: result.retry,
      flaky: result.flaky,
      suite: test.titlePath().slice(0, -1).join(' > ')
    });
  }

  async onEnd() {
    this.results.results.summary.stop = Date.now();
    fs.writeFileSync(this.outputFile, JSON.stringify(this.results, null, 2));
  }
}

module.exports = CTRFReporter;
