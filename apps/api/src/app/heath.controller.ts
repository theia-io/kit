import { Controller, Get, Logger } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    this.logger.log('Health check initiated');
    return this.health.check([
      //   () =>
      //     this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.1 }),
      //   () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

      // () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'), // Example: Ping an external URL

      // Check TypeORM database connection (if you're using TypeORM)
      //   () => this.db.pingCheck('database'),

      // Add more health checks for other dependencies:
      // - Redis
      // - Message queues (RabbitMQ, Kafka)
      // - Other microservices
      // - Custom checks (e.g., disk space, specific business logic)
    ]);
  }
}
