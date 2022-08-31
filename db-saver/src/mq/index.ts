import amqp, { Connection, Channel } from 'amqplib'

export async function listenQueue(amqpUrl: string, queueName: string, handler): Promise<void> {
  const connection: Connection = await amqp.connect(amqpUrl);
  const channel: Channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, async message => handler(message), { noAck: true });
  console.log('Listening queue...');
}