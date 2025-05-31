// VULNERABILITY: Multiple hardcoded secrets and weak configurations
module.exports = {
    database: {
        host: 'prod-db.example.com',
        username: 'admin',
        password: 'admin123!@#',  // Hardcoded database password
        port: 3306
    },
    
    api: {
        key: 'pk_live_51234567890abcdef',  // Hardcoded API key
        secret: 'sk_live_0987654321fedcba',  // Hardcoded API secret
        webhook_secret: 'whsec_very_secret_webhook_key'
    },
    
    jwt: {
        secret: 'my-super-secret-jwt-key',  // Hardcoded JWT secret
        algorithm: 'HS256'
    },
    
    encryption: {
        key: 'this-is-a-32-byte-encryption-key!',  // Hardcoded encryption key
        iv: '1234567890123456'  // Hardcoded IV
    },
    
    third_party: {
        aws_access_key: 'AKIAIOSFODNN7EXAMPLE',  // Hardcoded AWS key
        aws_secret: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        stripe_key: 'sk_test_51234567890abcdef',
        github_token: 'ghp_1234567890abcdefghijklmnopqrstuvwxyz'
    }
};