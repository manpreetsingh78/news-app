# Use the official PHP 8.2 CLI image
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zip unzip git curl \
    && docker-php-ext-install pdo pdo_mysql gd

# Set the working directory inside the container
WORKDIR /backend

# Copy application files
COPY . .

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev

# Set permissions for Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose the Laravel development server port
EXPOSE 8000

# The CMD is overridden by docker-compose.yml, so it's optional
# CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
