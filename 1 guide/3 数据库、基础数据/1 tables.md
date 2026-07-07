# HotPush 数据库表结构

## 数据库概述

HotPush 支持 SQLite 和 MySQL 两种数据库，主要用于存储热点数据、推送配置、用户信息等。数据库表会在首次启动时自动创建。

## 表结构总览

| 表名 | 说明 | 主要用途 |
|------|------|----------|
| pushed_items | 已推送记录 | 记录已推送的热点条目，避免重复推送 |
| fetch_records | 抓取记录 | 记录每次抓取的时间和数量 |
| settings | 系统设置 | 存储系统级配置项 |
| push_channels | 推送渠道 | 存储各推送渠道的配置信息 |
| custom_sources | 自定义源 | 存储用户自定义的数据源 |
| push_rules | 推送规则 | 存储推送过滤和匹配规则 |
| push_history | 推送历史 | 记录推送操作的历史日志 |
| users | 用户表 | 存储系统用户信息 |
| hot_item_snapshots | 热搜快照 | 存储热搜排名的历史快照 |

## 详细表结构

### 1. pushed_items - 已推送记录表

记录已推送的热点条目，用于去重和历史查询。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(255) / TEXT | 主键，热点条目唯一标识 |
| source | VARCHAR(100) | 数据源标识（如 weibo、zhihu） |
| title | TEXT | 热点标题 |
| url | TEXT | 热点链接 |
| pushed_at | TIMESTAMP | 推送时间 |

**索引：**
- `idx_pushed_items_source` (source)

---

### 2. fetch_records - 抓取记录表

记录每次数据抓取的时间和获取的条目数量。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| source | VARCHAR(100) | 数据源标识 |
| fetched_at | TIMESTAMP | 抓取时间 |
| item_count | INT | 获取的条目数量 |

---

### 3. settings - 系统设置表

存储系统级配置项，如 AI 模型配置、定时任务配置等。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| key | VARCHAR(100) | 主键，设置项名称 |
| value | TEXT | 设置值 |
| updated_at | TIMESTAMP | 更新时间 |

---

### 4. push_channels - 推送渠道配置表

存储各推送渠道的配置信息，如 Telegram、Discord、邮件等。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(50) | 主键，渠道标识（如 telegram、discord） |
| name | VARCHAR(100) | 渠道名称 |
| enabled | TINYINT | 是否启用（1=启用，0=禁用） |
| config | TEXT | 渠道配置（JSON 格式） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**支持的渠道类型：**
- telegram - Telegram Bot
- discord - Discord Webhook
- email - 邮件推送
- wecom - 企业微信
- feishu - 飞书
- dingtalk - 钉钉

---

### 5. custom_sources - 自定义数据源表

存储用户自定义的数据源配置。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(100) | 主键，源标识 |
| name | VARCHAR(200) | 源名称 |
| url | TEXT | RSS 地址 |
| category | VARCHAR(50) | 分类（默认"自定义"） |
| icon | TEXT | 图标 URL |
| enabled | TINYINT | 是否启用（1=启用，0=禁用） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

---

### 6. push_rules - 推送规则表

存储推送过滤和匹配规则。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| name | VARCHAR(200) | 规则名称 |
| enabled | TINYINT | 是否启用（1=启用，0=禁用） |
| rule_type | VARCHAR(50) | 规则类型（如 keyword、source、rank） |
| rule_config | TEXT | 规则配置（JSON 格式） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**规则类型说明：**
- keyword - 关键词匹配
- source - 数据源过滤
- rank - 排名阈值

---

### 7. push_history - 推送历史表

记录推送操作的历史日志，用于统计和故障排查。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| channel | VARCHAR(50) | 推送渠道 |
| source | VARCHAR(100) | 数据源 |
| title | TEXT | 推送内容标题 |
| item_count | INT | 推送条目数量 |
| status | VARCHAR(20) | 推送状态（success/failed） |
| error_message | TEXT | 错误信息（失败时） |
| pushed_at | TIMESTAMP | 推送时间 |

**索引：**
- `idx_push_history_pushed_at` (pushed_at DESC)

---

### 8. users - 用户表

存储系统用户信息，支持管理员和普通用户角色。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| username | VARCHAR(50) | 用户名（唯一） |
| password_hash | VARCHAR(255) | 密码哈希（bcrypt） |
| role | VARCHAR(20) | 角色（admin/user） |
| created_at | TIMESTAMP | 创建时间 |
| last_login | TIMESTAMP | 最后登录时间 |

**索引：**
- `idx_users_username` (username)

**默认管理员：**
- 用户名：admin
- 密码：通过环境变量 `ADMIN_PASSWORD` 设置

---

### 9. hot_item_snapshots - 热搜快照表

存储热搜排名的历史快照，用于趋势分析。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| source | VARCHAR(100) | 数据源标识 |
| item_id | VARCHAR(255) | 热点条目 ID |
| title | TEXT | 热点标题 |
| url | TEXT | 热点链接 |
| rank | INT | 排名 |
| hot_score | VARCHAR(100) | 热度值 |
| snapshot_time | TIMESTAMP | 快照时间 |

**索引：**
- `idx_snapshots_source_time` (source, snapshot_time)
- `idx_snapshots_item` (item_id, snapshot_time)

**数据保留策略：**
- 默认保留 7 天
- 可通过配置调整保留天数

---

## 数据库配置

### MySQL 配置

```env
# 数据库连接 URL
DATABASE_URL=mysql://root:123456@localhost:3306/hotpush

# 连接池配置
DB_POOL_SIZE=5
DB_POOL_RECYCLE=3600
```

### Redis 配置（可选）

```env
# Redis 连接 URL
REDIS_URL=redis://localhost:6379/0

# 缓存 TTL（秒）
REDIS_CACHE_TTL=300
```

## 数据库初始化

### MySQL 初始化

```sql
-- 创建数据库
CREATE DATABASE hotpush CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE hotpush;
```

### 自动建表

数据库表会在应用首次启动时自动创建，无需手动执行 SQL 脚本。

## 数据清理策略

### 自动清理

- **已推送记录**：保留最近 7 天
- **抓取记录**：保留最近 7 天
- **推送历史**：保留最近 30 天
- **热搜快照**：保留最近 7 天

### 手动清理

```sql
-- 清理旧的已推送记录
DELETE FROM pushed_items WHERE pushed_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- 清理旧的推送历史
DELETE FROM push_history WHERE pushed_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 清理旧的热搜快照
DELETE FROM hot_item_snapshots WHERE snapshot_time < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

## 备份建议

### MySQL 备份

```bash
# 备份数据库
mysqldump -u root -p hotpush > hotpush_backup.sql

# 恢复数据库
mysql -u root -p hotpush < hotpush_backup.sql
```

### 自动备份脚本

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p hotpush > /backup/hotpush_$DATE.sql
find /backup -name "hotpush_*.sql" -mtime +7 -delete
```

## 性能优化建议

1. **索引优化**：确保常用查询字段有索引
2. **连接池**：合理配置连接池大小
3. **定期清理**：按保留策略清理历史数据
4. **分区表**：对于大表可考虑按时间分区
5. **读写分离**：高并发场景可考虑主从复制

## 常见问题

### Q: 如何修改数据库配置？

A: 编辑 `.env` 文件中的 `DATABASE_URL` 配置项。

### Q: 如何查看数据库表结构？

A: 使用数据库管理工具连接数据库，或执行 `DESCRIBE table_name;` 命令。

### Q: 数据库表创建失败怎么办？

A: 检查数据库用户权限，确保有 CREATE TABLE 权限。查看应用日志获取详细错误信息。