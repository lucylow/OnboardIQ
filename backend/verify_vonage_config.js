#!/usr/bin/env node
/**
 * Vonage API Key Configuration Verification Script
 * This script verifies that the VONAGE_API_KEY is properly configured and used throughout the application.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

function printHeader(message) {
    console.log('\n' + '='.repeat(60));
    console.log(`  ${message}`);
    console.log('='.repeat(60));
}

function printSuccess(message) {
    console.log(`✅ ${message}`);
}

function printError(message) {
    console.log(`❌ ${message}`);
}

function printInfo(message) {
    console.log(`ℹ️  ${message}`);
}

function checkEnvironmentVariables() {
    printHeader("Environment Variables Check");
    
    // Expected API key from Lovable/Supabase
    const expectedApiKey = "09bf89e3";
    
    // Check VONAGE_API_KEY
    const apiKey = process.env.VONAGE_API_KEY;
    if (apiKey) {
        if (apiKey === expectedApiKey) {
            printSuccess(`VONAGE_API_KEY is set correctly: ${apiKey}`);
        } else {
            printError(`VONAGE_API_KEY mismatch. Expected: ${expectedApiKey}, Got: ${apiKey}`);
        }
    } else {
        printError("VONAGE_API_KEY is not set");
    }
    
    // Check VONAGE_API_SECRET
    const apiSecret = process.env.VONAGE_API_SECRET;
    if (apiSecret) {
        if (apiSecret !== "your-vonage-api-secret-here") {
            printSuccess("VONAGE_API_SECRET is set");
        } else {
            printError("VONAGE_API_SECRET is using placeholder value");
        }
    } else {
        printError("VONAGE_API_SECRET is not set");
    }
    
    // Check other Vonage-related variables
    const vonageVars = [
        'VONAGE_VIDEO_API_KEY',
        'VONAGE_VIDEO_API_SECRET',
        'VONAGE_BRAND_NAME',
        'VONAGE_SENDER_ID'
    ];
    
    vonageVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            printInfo(`${varName}: ${value}`);
        } else {
            printInfo(`${varName}: Not set (optional)`);
        }
    });
}

function checkConfigFiles() {
    printHeader("Configuration Files Check");
    
    const configFiles = [
        'config.env',
        'config.env.example',
        'src/config/enhanced_config.py',
        'src/routes/auth.py',
        'src/services/enhanced_vonage_service.py',
        'src/services/vonage_service.py'
    ];
    
    const expectedApiKey = "09bf89e3";
    
    configFiles.forEach(configFile => {
        const filePath = path.join(__dirname, configFile);
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                if (content.includes(expectedApiKey)) {
                    printSuccess(`${configFile}: Contains correct API key`);
                } else if (content.includes('VONAGE_API_KEY')) {
                    printError(`${configFile}: Contains VONAGE_API_KEY but may not have correct value`);
                } else {
                    printInfo(`${configFile}: No VONAGE_API_KEY reference found`);
                }
            } catch (error) {
                printError(`${configFile}: Error reading file - ${error.message}`);
            }
        } else {
            printError(`${configFile}: File not found`);
        }
    });
}

function checkBackendHealth() {
    printHeader("Backend Health Check");
    
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/health',
            method: 'GET',
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    printSuccess("Backend server is running");
                    
                    try {
                        const healthData = JSON.parse(data);
                        const integrations = healthData.integrations || {};
                        const vonageStatus = integrations.vonage || false;
                        
                        if (vonageStatus) {
                            printSuccess("Vonage integration is connected");
                        } else {
                            printError("Vonage integration is not connected");
                        }
                    } catch (error) {
                        printError("Failed to parse health response");
                    }
                } else {
                    printError(`Backend server responded with status: ${res.statusCode}`);
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            if (error.code === 'ECONNREFUSED') {
                printError("Backend server is not running");
            } else {
                printError(`Backend health check failed: ${error.message}`);
            }
            resolve();
        });
        
        req.on('timeout', () => {
            printError("Backend server request timed out");
            req.destroy();
            resolve();
        });
        
        req.end();
    });
}

function testVonageApiEndpoints() {
    printHeader("Vonage API Endpoints Test");
    
    const baseUrl = "http://localhost:5000/api/vonage";
    const endpoints = [
        "/start-verification",
        "/check-verification", 
        "/send-sms",
        "/account-balance"
    ];
    
    endpoints.forEach(endpoint => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api/vonage${endpoint}`,
            method: 'GET',
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            if (res.statusCode === 200 || res.statusCode === 405) {
                printSuccess(`${endpoint}: Endpoint accessible`);
            } else {
                printError(`${endpoint}: Endpoint returned status ${res.statusCode}`);
            }
        });
        
        req.on('error', (error) => {
            printError(`${endpoint}: Endpoint not accessible - ${error.message}`);
        });
        
        req.on('timeout', () => {
            printError(`${endpoint}: Endpoint request timed out`);
            req.destroy();
        });
        
        req.end();
    });
}

function checkFrontendIntegration() {
    printHeader("Frontend Integration Check");
    
    const frontendFiles = [
        '../src/services/vonageApi.ts',
        '../src/services/smsVerificationService.ts'
    ];
    
    frontendFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, filePath);
        if (fs.existsSync(fullPath)) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('localhost:5000/api/vonage')) {
                    printSuccess(`${filePath}: Properly configured to use backend Vonage API`);
                } else {
                    printError(`${filePath}: May not be properly configured for Vonage API`);
                }
            } catch (error) {
                printError(`${filePath}: Error reading file - ${error.message}`);
            }
        } else {
            printError(`${filePath}: File not found`);
        }
    });
}

function generateSummary() {
    printHeader("Verification Summary");
    
    printInfo("This verification script checks that:");
    printInfo("1. VONAGE_API_KEY is set to '09bf89e3' (from Lovable/Supabase)");
    printInfo("2. Configuration files contain the correct API key");
    printInfo("3. Backend server is running and Vonage integration is connected");
    printInfo("4. Frontend is properly configured to use the backend Vonage API");
    
    printInfo("\nNext steps:");
    printInfo("1. Ensure VONAGE_API_SECRET is set to your actual Vonage API secret");
    printInfo("2. Test the Vonage integration with real phone numbers");
    printInfo("3. Monitor the backend logs for any Vonage API errors");
    printInfo("4. Verify that SMS verification and other Vonage features work correctly");
}

async function main() {
    printHeader("Vonage API Key Configuration Verification");
    printInfo(`Verification started at: ${new Date().toLocaleString()}`);
    
    // Run all verification checks
    checkEnvironmentVariables();
    checkConfigFiles();
    await checkBackendHealth();
    testVonageApiEndpoints();
    checkFrontendIntegration();
    generateSummary();
    
    printHeader("Verification Complete");
    printInfo("Review the results above to ensure proper Vonage API key configuration");
}

// Run the verification
main().catch(console.error);
