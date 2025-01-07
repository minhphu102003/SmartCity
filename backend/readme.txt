Installation Guide
1.Install the required tools: 
    Node.js: Download from nodejs.org.
    MongoDB: Download from mongodb.com.
    Kafka: Refer to Kafka Documentation.
    Cloudinary: Sign up at cloudinary.com.
 * You can store images locally when running the application in a local environment by modifying the upload function in the routes folder of each API.
 * Deployment is possible by hosting the servers if needed.
 * For Kafka, you can install Kafka locally (using the code in src/config/kafka.config.js).
 * If deploying on Confluent Cloud, use the configuration in src/kafkaOnline.config.js.
2. Install packages:
    npm install
3. Set up environment variables:
    Create a .env file in the root directory of the project.
    Refer to .env.example and fill in the required details.
    Example:
        PORT=3000
        MONGODB_URI=mongodb://localhost:27017/mydb
        SECRET=mysecretkey
4. Run the application:
    npm start