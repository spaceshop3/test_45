# WinnerCanadaMaple.ca (Docker)

This directory now ships a `Dockerfile` that packages the existing HTML/PHP frontend under Apache/PHP 8.2 so you can test it locally or deploy it on a container-aware host.

## Build

```bash
cd /mnt/d/WORK/baers/1_winnercanadamaple.ca
docker build -t winnercanadamaple .
```

## Run locally

```bash
docker run --rm -p 8080:80 winnercanadamaple
```

Browse the site at `http://localhost:8080` while the container is running.

## Compose helper

For repeated local testing or deployments, use the provided Docker Compose setup.

```bash
cd /mnt/d/WORK/baers/1_winnercanadamaple.ca
docker compose up --build
```

The Compose workflow rebuilds the same image, forwards port `8080`, and includes a health check so orchestrators know when the site is ready for traffic.

## Deploying

Vercel cannot run arbitrary Docker containers or execute PHP on the edge. If you must stay on Vercel, port the PHP handlers to serverless functions or flatten the site to pure static assets. Otherwise push this image to any Docker-friendly platform and it will serve the site as-is.
