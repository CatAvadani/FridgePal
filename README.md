# FridgePal 

Your smart kitchen companion that helps you reduce food waste and save money! FridgePal uses your phone's camera to scan and identify food products, automatically tracking their expiration dates so you never have to guess what's fresh in your fridge.

## Key Features

- **Smart Scanning**: Use your phone's camera to instantly identify food items
- **Expiry Tracking**: Automatic expiration date detection and reminders
- **Inventory Management**: Keep a real-time overview of everything in your fridge
- **Smart Notifications**: Get alerts before items expire


Say goodbye to forgotten leftovers and expired groceries. With FridgePal, you'll always know what you have, when it expires, and how to use it before it goes bad!

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** (will be installed automatically)

##  Quick Start

### 1. Clone and Install

```bash

git clone https://github.com/mohald-3/FridgePalFE.git

cd FridgePalFE

npm install
```

### 2. Start the Development Server

```bash
npx expo start
```

After running this command, you'll see a QR code and several options to run the app.

## Running on Devices

### Option 1: Expo Go (Easiest for Testing)

1. **Install Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR code** displayed in your terminal with:
   - **iOS**: Camera app or Expo Go app
   - **Android**: Expo Go app

### Option 2: iOS Simulator (macOS only)

#### Setup iOS Simulator:

1. **Install Xcode** from the Mac App Store (this takes a while)

2. **Install Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

3. **Open Xcode** and accept the license agreements

4. **Install iOS Simulator**:
   - Open Xcode → Preferences → Components
   - Download your preferred iOS version

#### Run on iOS Simulator:

```bash
# Start the development server
npx expo start

# Press 'i' in the terminal, or
# Press 'i' in the Expo dev tools web interface
```

### Option 3: Android Emulator

#### Setup Android Emulator:

1. **Install Android Studio** - [Download here](https://developer.android.com/studio)

2. **Open Android Studio** and complete the setup wizard

3. **Install Android SDK**:
   - Open Android Studio
   - Go to Tools → SDK Manager
   - Install the latest Android SDK (API level 33 or higher)

4. **Create Virtual Device**:
   - Go to Tools → Device Manager
   - Click "Create Device"
   - Choose a device 
   - Select a system image (API level 33+ with Google APIs)
   - Finish setup

5. **Set Environment Variables** (add to your `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   # export ANDROID_HOME=$HOME/Android/Sdk        # Linux
   # export ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk  # Windows

   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

6. **Restart your terminal** and verify installation:
   ```bash
   adb --version
   ```

#### Run on Android Emulator:

```bash
# Start your Android emulator first (from Android Studio Device Manager)

# Start the development server
npx expo start

# Press 'a' in the terminal, or
# Press 'a' in the Expo dev tools web interface
```

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **Expo Router** - File-based navigation
- **NativeWind** - Tailwind CSS for React Native
- **TypeScript** - Type safety

## CI/CD Pipeline

This project uses **GitHub Actions** for Continuous Integration to ensure code quality and catch issues early.

### What Gets Checked Automatically:

Every time you push code or create a pull request, our CI pipeline automatically runs:

- ✅ **Code Quality** - ESLint checks for style and best practices
- ✅ **Type Safety** - TypeScript verification to catch type errors
- ✅ **Security** - npm audit to find vulnerable dependencies

### Workflow Triggers:

- **Push to `main`** - Full CI pipeline runs  
- **Pull Requests to `main`** - All checks must pass before merging

### Viewing CI Results:

1. Go to the **Actions** tab in GitHub
2. Click on any workflow run to see detailed logs
3. Green ✅ = All checks passed
4. Red ❌ = Something failed (check the logs for details)

### Test locally:

Before pushing code, you can run the same checks locally:

```bash
# Check code style
npm run lint

# Check TypeScript types
npx tsc --noEmit

# Check for security issues
npm audit
```


## Project Structure

```
fridgepal/
├── app/                    # App screens (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── home.tsx      # Home screen
│   │   ├── inventory.tsx    # Inventory screen
│   │   ├── settings.tsx   # Settings screen
│   │   └── _layout.tsx    # Tab layout
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── components/            # Reusable components
├── constants/             # App constants and themes
├── hooks/                 # Custom React hooks
├── assets/                # Images, fonts, etc.
├── global.css            # Global styles (NativeWind)
└── tailwind.config.js    # Tailwind configuration
```

## Development Commands

```bash
# Start development server
npm start
# or
npx expo start

# Start with cache cleared
npx expo start --clear

# Run on specific platforms
npx expo start --ios        # iOS only
npx expo start --android    # Android only
npx expo start --web        # Web only

# Build for production (requires Expo account)
npx expo build:ios
npx expo build:android
```

## Troubleshooting

### Common Issues:

**"Metro bundler failed to start"**
```bash
npx expo start --clear
```

**"Could not connect to development server"**
- Ensure your phone and computer are on the same WiFi network
- Try using tunnel mode: `npx expo start --tunnel`

**iOS Simulator not opening**
```bash
# Ensure Xcode is properly installed
xcode-select --install

# Reset simulator
npx expo start --clear
```

**Android Emulator issues**
- Make sure virtualization is enabled in BIOS
- Ensure emulator is running before starting Expo
- Check if `adb devices` shows your emulator

**NativeWind styles not working**
```bash
# Clear cache and restart
npx expo start --clear
```

### Getting Help:

- Check the [Expo documentation](https://docs.expo.dev/)
- Search [Expo GitHub discussions](https://github.com/expo/expo/discussions)
- Ask in the [Expo Discord community](https://chat.expo.dev)



