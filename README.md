## Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or higher)
- [JDK 17](https://www.oracle.com/java/technologies/downloads/)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development)
- [Watchman](https://facebook.github.io/watchman/) (macOS only)
- [React Native CLI](https://reactnative.dev/docs/environment-setup):  
  `npm install -g react-native-cli`

### FEATURES OF THE APP:
  - Multi user specific Forms.
  - Based on entered email view you previous form or create new.
  - Each field has its ownn validation on change.
  - Dynamic routing and preventing to navigate on different screen without filling all fields in current scree.
  - Access of the Storage for selecting files like ducuments needed and storing it in blob.
  - Clean folder structure with reuseable components.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mr-khan1100/Fresh-News.git
cd your-repo-name
```
### 2. Steps to run Project in android
** Install Dependencies**
run npm install

make changes in android/gradle.properties to set you java.home path.

run cammand -- cd android && ./gradlew clean && cd ..

npm run android

# Alternative manual build
cd android && ./gradlew assembleDebug


### 3. iOS Setup

Install CocoaPods
cd ios && pod install && cd ..

Open Xcode Project
open ios/YourProjectName.xcworkspace

iOS Release Build

In Xcode:

Select "Generic iOS Device" as target
Product > Archive
Follow distribution workflow



