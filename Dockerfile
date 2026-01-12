FROM php:8.2-apache

WORKDIR /var/www/html

# Copy everything so Apache/PHP can serve the existing site.
COPY . /var/www/html

# Set safe permissions; Apache already runs as www-data.
RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type d -exec chmod 755 {} \; \
    && find /var/www/html -type f -exec chmod 644 {} \;

EXPOSE 80

CMD ["apache2-foreground"]
