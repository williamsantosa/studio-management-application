# Studio Management Application

Created using Svelte 5, SvelteKit, and PostgreSQL. Linode is used for hosting.

## Developer

### Docker PostgreSQL

Persistent Data with Volumes
```
docker volume create postgres-data
docker run --name sma-postgres -e POSTGRES_PASSWORD=password123 -p 5431:5432 -v postgres-data:/var/lib/postgresql/data -d postgres
```

Running PostgreSQL Docker
```
docker run --name sma-postgres -e POSTGRES_PASSWORD=password123 -p 5431:5432 -d postgres
```

List containers
```
docker ps -a
```

Remove container
```
docker stop sma-postgres
docker rm sma-postgres
```
