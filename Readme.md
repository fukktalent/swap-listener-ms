## Installation

```bash
lerna bootstrap
```
Also need to add envs to each project

## Usage

```bash
# address - router contract address
# queue - rabbitmq queue name to capture
npm run swap-listener -- --address 0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640 --queue test

# queue - rabbitmq queue name to listen
npm run db-saver -- --queue test

npm run api
```
