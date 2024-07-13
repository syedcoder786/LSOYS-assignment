declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: string;
        MONGO_URI: string;
        jwtSecret: string;
        RAZORPAY_SECRET: string;
        RAZORPAY_KEY_ID: string;
        // Add other environment variables here as needed
    }
}
  