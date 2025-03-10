
To setup the PHP backend:

1. Upload these PHP files to your Hostinger hosting account
2. Create a MySQL database in your Hostinger control panel
3. Update the database configuration in config/database.php with your database credentials
4. Install Composer dependencies by running:
   composer install
5. Run the database setup script:
   php scripts/createTables.php
6. Make sure the .htaccess file is uploaded as well
