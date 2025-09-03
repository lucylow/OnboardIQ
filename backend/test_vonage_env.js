#!/usr/bin/env node
/**
 * Test script to verify Vonage API key loading from config.env
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from config.env
function loadEnvFile() {
    const envPath = path.join(__dirname, 'config.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=');
                    process.env[key] = value;
                }
            }
        });
        
        console.log('✅ Environment variables loaded from config.env');
    } else {
        console.log('❌ config.env file not found');
    }
}

function testVonageConfig() {
    console.log('\n============================================================');
    console.log('  Vonage API Key Configuration Test');
    console.log('============================================================');
    
    // Load environment variables
    loadEnvFile();
    
    // Test the API key
    const apiKey = process.env.VONAGE_API_KEY;
    const apiSecret = process.env.VONAGE_API_SECRET;
    const expectedApiKey = '09bf89e3';
    
    console.log('\n📋 Configuration Test Results:');
    console.log(`VONAGE_API_KEY: ${apiKey || 'NOT SET'}`);
    console.log(`VONAGE_API_SECRET: ${apiSecret ? 'SET' : 'NOT SET'}`);
    
    if (apiKey === expectedApiKey) {
        console.log('✅ VONAGE_API_KEY is correctly set to the Lovable/Supabase value');
    } else if (apiKey) {
        console.log(`❌ VONAGE_API_KEY mismatch. Expected: ${expectedApiKey}, Got: ${apiKey}`);
    } else {
        console.log('❌ VONAGE_API_KEY is not set');
    }
    
    if (apiSecret && apiSecret !== 'your-vonage-api-secret-here') {
        console.log('✅ VONAGE_API_SECRET is set');
    } else {
        console.log('❌ VONAGE_API_SECRET needs to be set to your actual Vonage API secret');
    }
    
    // Test other Vonage variables
    const vonageVars = [
        'VONAGE_VIDEO_API_KEY',
        'VONAGE_VIDEO_API_SECRET', 
        'VONAGE_BRAND_NAME',
        'VONAGE_SENDER_ID'
    ];
    
    console.log('\n📋 Other Vonage Configuration:');
    vonageVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            console.log(`${varName}: ${value}`);
        } else {
            console.log(`${varName}: Not set (optional)`);
        }
    });
    
    console.log('\n============================================================');
    console.log('  Summary');
    console.log('============================================================');
    
    if (apiKey === expectedApiKey) {
        console.log('✅ Vonage API key is properly configured!');
        console.log('📝 Next steps:');
        console.log('   1. Set VONAGE_API_SECRET to your actual Vonage API secret');
        console.log('   2. Start the backend server to test the integration');
        console.log('   3. Test SMS verification with a real phone number');
    } else {
        console.log('❌ Vonage API key configuration needs attention');
        console.log('📝 Please check the config.env file and ensure VONAGE_API_KEY is set correctly');
    }
}

// Run the test
testVonageConfig();
