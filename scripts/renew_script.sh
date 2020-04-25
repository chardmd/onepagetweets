#
# Run this script for renewing certificate
# Please remove the dry-run after testing.
#
/usr/bin/docker run -it --rm --name certbot \
        -v "/etc/letsencrypt:/etc/letsencrypt" \
        -v "/tmp/letsencrypt/www:/var/www" \
        certbot/certbot:latest \
                renew --dry-run && docker service update app_proxy
