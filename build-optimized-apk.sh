#!/bin/bash

# Script to build optimized Android APK with size reduction
echo "🚀 Building optimized Android APK..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean

# Build release APK with optimizations
echo "📦 Building release APK with optimizations..."
./gradlew assembleRelease

# Check APK size
echo "📊 APK size information:"
ls -lh app/build/outputs/apk/release/*.apk

echo "✅ Build completed! APK location:"
echo "   android/app/build/outputs/apk/release/"
