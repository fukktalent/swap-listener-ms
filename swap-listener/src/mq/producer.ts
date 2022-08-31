import amqp, { Connection, Channel } from 'amqplib'

export async function createMQProducer(amqpUrl: string, queueName: string) {
  const connection: Connection = await amqp.connect(amqpUrl);
  const channel: Channel = await connection.createChannel();
  return function(msg: string) {
    channel.sendToQueue(queueName, Buffer.from(msg));
  }
}