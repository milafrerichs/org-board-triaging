# triaging

> A GitHub App built with [Probot](https://github.com/probot/probot) that traging github issues on a org project

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t triaging .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> triaging
```

## Contributing

If you have suggestions for how triaging could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2021 Mila Frerichs <mila.frerichs@gmail.com>
