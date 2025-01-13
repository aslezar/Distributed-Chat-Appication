# VibeTalk

## Tasks

- Add every member to the official VibeTalk group.
- Add channel cache.
- Deploy to Azure.
- Benchmark RabbitMQ.
- Invalidate cache when group settings change.

## Resume

- Can simultaneously handle 10K online users. Benchmarks are available on GitHub.
- Uses Prometheus and Grafana for real-time monitoring of systems.
- Deployed on AWS.
- Used bucketing strategy to store, retrieve, and send messages faster and more efficiently.
- Configured Nginx as a load balancer to handle WebSockets connections.

## Features

- This design is for 10K online users.
- Autoscaling.

## Learnings

- To configure long polling connection, set timeout in Nginx configuration and also add polling in transport in Socket.io configuration.

### Monitoring and Logging
- Prometheus: Metrics collection (pull-based, Graphite is push-based).
- Loki: Log collection.
- Grafana: For visualization.

### Quorum Queues and Classic Queues

- Quorum queues are durable by default and are replicated among nodes, so if the main node goes down, other nodes serve the queue.
- Classic queues are limited by the node capacity itself and are not replicated to other nodes unless mirroring is explicitly configured.
- Quorum queues have slightly more latency than classic queues.

## Notes

- Use Discord message schema.

```bash
docker compose up --scale restaurant-service=2
```

### Load Testing Tools

- [k6](https://k6.io/)
- [Artillery](https://www.artillery.io/docs/reference/engines/socketio)
- [Gatling Socket.io](https://dranidis.github.io/posts/gatling-socketio/)
- [Socket.io Performance Tuning](https://socket.io/docs/v4/performance-tuning/)
- [Socket.io Load Testing](https://socket.io/docs/v4/load-testing/)

### Performance Key Indicators

- Latency and throughput.

### Dashboards

- Prometheus: [http://localhost:9090/](http://localhost:9090/)
- Grafana: [http://localhost:3000/](http://localhost:3000/)
- Redis: [http://localhost:8001/](http://localhost:8001/)
- RabbitMQ: [http://localhost:15672/](http://localhost:15672/)
- Socket.io: [https://admin.socket.io/](https://admin.socket.io/)

## Tech

- WebSocket
- RabbitMQ
- Prometheus
- Grafana

## Problems

- For bucketing to work properly, servers need to sync time.

## Journey - Timeline

**Dec 29 - Jan 4**

- Started researching different technologies used in distributed systems, and learned about:
    - Kafka
    - Redis
    - RabbitMQ
    - Nginx

**Jan 4 - Jan 5**

- Set up Docker environment for fast setup
- Read Discord blogs to understand how they work
- Read about WhatsApp's use of ejabberd
- Tried RabbitMQ with a queue for each user [**Failed 1**][Having so many queues caused significant delays during RabbitMQ node restarts.]

**Jan 6**

- Found possible approaches to solve the first two problems
- Prepared architecture diagram
- Studied Discord message schema
- Explored compound keys
- Learned about MongoDB IDs being sortable and their composition

**Jan 7**

- Tried RabbitMQ for message and user updates [**Failed 2**][Not ideal if a node goes down, it becomes unaware of who is online]

**Jan 8**

- Used RabbitMQ for message delivery and Redis for "Server to User" map [**Failed 3**][Complexity is too high to handle each user's presence. Redis will become a single point of failure and it will require three different stacks (Server, RabbitMQ, Redis) to scale up together]

**Jan 9**

- Created a queue for each server and bound it to exchange based on userID
  [**Green Go** - Only problem is having so many bindings, solved this by creating multiple exchanges and partitioning users to them by a simple hash function.]

**Jan 11**  
Configured Nginx and WebSockets connection to Nginx, provided server unique ID to make them identifiable.

**Jan 12**  
Learned about Prometheus-Grafana-Loki for metrics collection, logging, and visualization.

## Tweets

**Tweet #0**  
Message schema inspired by Discord  
[How Discord Stores Billions of Messages](https://discord.com/blog/how-discord-stores-billions-of-messages)  
[How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

**Tweet**  
My implementation of bucket in JS. I am using Unix epoch to reduce complexity.

**Tweet #1**  
My chat app schema: users -> channels -> group.

**Tweet #2**  
After trying different approaches, now I have 5 failed approaches. 5 ways to not implement it and 1 correct way.

**Tweet #3**  
Read this, it will help you to understand how to design schema efficiently:  
[Schema Design Process](https://www.mongodb.com/docs/manual/data-modeling/schema-design-process/#apply-design-patterns)  
[Schema Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)

**Tweet #4**  
Learned about HTTP long polling transport, it holds the request until a message arrives.

1. Client sends the request to the server.
2. Server holds the request until a message arrives.
3. Server sends the message to the client.
4. Client immediately sends a new request to the server.

**Tweet #5**  
Now using Prometheus, Grafana, and Loki to monitor logs.

After 3 failed attempts, I have a working and scalable architecture for my distributed web application. Just curious what new challenges will come ahead.

After trying 3 failed approaches to use RabbitMQ for a chat app, my chat app is now finally working.  
3 different ways to use RabbitMQ, now I have one finally working solution.

I’ve simply discovered three approaches on how not to use RabbitMQ.
