import * as amqplib from 'amqplib';
import { serverId } from '../server-id'

export interface RabbitMQ {
    connection: amqplib.Connection;
    messageChannel: amqplib.Channel;
}

export const queueName = serverId;
const rabbitMQURL = process.env.RABBITMQ_URL || 'amqp://localhost'

// Establish a connection to RabbitMQ
let rabbitMQ: RabbitMQ | null = null;

// Establish a connection to RabbitMQ
const connect = async () => {
    try {
        if (rabbitMQ) return rabbitMQ;
        const connection = await amqplib.connect(rabbitMQURL);
        console.log('RabbitMQ connected');

        const [messageChannel] = await Promise.all([
            connection.createChannel(),
        ]);

        await messageChannel.prefetch(1);

        messageChannel.assertExchange("messages", "direct", { durable: true });
        messageChannel.assertQueue(queueName, { exclusive: true, durable: true, autoDelete: true })

        connection.on("close", () => {
            console.error("RabbitMQ Connection Closed");
            process.exit(1);
        });

        rabbitMQ = { connection, messageChannel };
        return rabbitMQ;

    } catch (error) {
        console.error("RabbitMQ Connection Error", error);
        throw error;
    }
};

export default connect;
