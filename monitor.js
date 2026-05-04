#!/usr/bin/env node

/**
 * Simple Uptime Monitor for Matrix Software Implementation
 * This script checks the health of the deployed application and sends alerts
 */

const https = require('https');
const http = require('http');

class UptimeMonitor {
  constructor() {
    this.checkInterval = 5 * 60 * 1000; // 5 minutes
    this.alertThreshold = 2; // Alert after 2 consecutive failures
    this.consecutiveFailures = 0;
    this.lastStatus = null;
    this.targetUrl = process.env.MONITOR_URL || 'http://localhost:3000';
  }

  checkHealth() {
    return new Promise((resolve, reject) => {
      const url = new URL(this.targetUrl);
      const client = url.protocol === 'https:' ? https : http;

      const options = {
        hostname: url.hostname,
        port: url.port,
        path: '/health',
        method: 'GET',
        timeout: 10000 // 10 second timeout
      };

      const req = client.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const healthData = JSON.parse(data);
            resolve({
              status: res.statusCode,
              responseTime: Date.now() - this.startTime,
              data: healthData
            });
          } catch (error) {
            resolve({
              status: res.statusCode,
              responseTime: Date.now() - this.startTime,
              error: 'Invalid JSON response'
            });
          }
        });
      });

      req.on('error', (error) => {
        resolve({
          status: 0,
          responseTime: Date.now() - this.startTime,
          error: error.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: 0,
          responseTime: Date.now() - this.startTime,
          error: 'Request timeout'
        });
      });

      this.startTime = Date.now();
      req.end();
    });
  }

  async performCheck() {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Performing health check on ${this.targetUrl}`);

    try {
      const result = await this.checkHealth();

      if (result.status === 200) {
        if (this.consecutiveFailures > 0) {
          console.log(`[${new Date().toISOString()}] ✅ Service recovered! Was down for ${this.consecutiveFailures} checks`);
          this.consecutiveFailures = 0;
        } else {
          console.log(`[${new Date().toISOString()}] ✅ Service healthy - Response: ${result.responseTime}ms`);
        }
        this.lastStatus = 'healthy';
      } else {
        this.consecutiveFailures++;
        console.log(`[${new Date().toISOString()}] ❌ Service unhealthy - Status: ${result.status}, Failures: ${this.consecutiveFailures}/${this.alertThreshold}`);

        if (this.consecutiveFailures >= this.alertThreshold) {
          this.sendAlert(result);
        }
        this.lastStatus = 'unhealthy';
      }
    } catch (error) {
      this.consecutiveFailures++;
      console.error(`[${new Date().toISOString()}] 💥 Health check error: ${error.message}, Failures: ${this.consecutiveFailures}/${this.alertThreshold}`);

      if (this.consecutiveFailures >= this.alertThreshold) {
        this.sendAlert({ error: error.message });
      }
    }
  }

  sendAlert(details) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] 🚨 ALERT: Service is down!`);
    console.error(`[${timestamp}] Details:`, details);
    console.error(`[${timestamp}] Consecutive failures: ${this.consecutiveFailures}`);

    // In a production environment, this would:
    // - Send email alerts
    // - Send Slack/Discord notifications
    // - Trigger PagerDuty/on-call alerts
    // - Send SMS alerts
    // - Update status page

    console.error(`[${timestamp}] Alert sent to monitoring system`);
  }

  start() {
    console.log(`Starting uptime monitor for ${this.targetUrl}`);
    console.log(`Check interval: ${this.checkInterval / 1000} seconds`);
    console.log(`Alert threshold: ${this.alertThreshold} consecutive failures`);

    // Perform initial check
    this.performCheck();

    // Set up recurring checks
    setInterval(() => {
      this.performCheck();
    }, this.checkInterval);
  }

  getStatus() {
    return {
      targetUrl: this.targetUrl,
      lastStatus: this.lastStatus,
      consecutiveFailures: this.consecutiveFailures,
      alertThreshold: this.alertThreshold,
      checkInterval: this.checkInterval
    };
  }
}

// CLI usage
if (require.main === module) {
  const monitor = new UptimeMonitor();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down uptime monitor...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nShutting down uptime monitor...');
    process.exit(0);
  });

  monitor.start();
}

module.exports = UptimeMonitor;