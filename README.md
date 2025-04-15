# Studio Management Application

Created using Svelte 5, SvelteKit, and PostgreSQL. Linode is used for hosting.

- Svelte 5
- SvelteKit
- PocketBase
- Linode

## Developer

### Linode/PocketBase

Setting up Linode and PocketBase

1. Sign up and login to linode.com website.
2. Create an Ubuntu Linode and specify the root password.
3. Open terminal and `ssh root@<ip_address>`, use root password.
4. Create `pb` directory in `~` for root.
5. Download and unzip Linux version of PocketBase to local machine.
6. Use `scp <local_path_to_pocketbase> <root@<ip_address>:/root/pb` to copy PocketBase to Linode.
7. Serve by doing ```./pocketbase serve --http="<ip_address>:80" --https="<ip_address>:443``` or something similar.

Create first superuser

```./pocketbase superuser upsert <email> <password>```

Mount volume (it's a persistent file system that can be moved around to different servers)

1. Create volume on Linode website, run the commands they suggest by pressing "show config" afte prressing the 3 dots.
2. Run `mount "dev/disk/..." "/root/pb/pb_data"`.

Domains

1. Should search this up later ```./pocketbase serve --http="<domain_name>:80" --https="<domain_name>:443```.

SystemDService

Look on the PocketBase documentation to run it whenever the server restarts.