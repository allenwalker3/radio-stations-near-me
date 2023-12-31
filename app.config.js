export default {
  "expo": {
    "name": "Radio Stations Near Me",
    "description": "Find nearby AM & FM radio station frequencies",
    "slug": "radio-stations-near-me",
    "privacy": "unlisted",
    "userInterfaceStyle": "light",
    "orientation": "portrait",
    "icon": "./assets/icon-ios.png",
    "version": "1.0.2",
    "splash": {
      "image": "./assets/iphone-splash-preview-dark.png",
      "resizeMode": "cover",
      "backgroundColor": "#D1CBD3"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "icon": "./assets/icon-ios.png",
      "supportsTablet": true,
      "bundleIdentifier": "com.allenwalker.radiostationsnearme",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Your phone's GPS location is required to find radio station frequencies in your geographic area. Without GPS location information, no data will appear."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon-android.png",
        "backgroundColor": "#0770C9"
      },
      "package": "com.allenwalker.radiostationsnearme",
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_SERVICES_API
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
          }
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Your phone's GPS location is required to find radio station frequencies in your geographic area. Without GPS location information, no data will appear."
        }
      ]
    ],
    "owner": "orkowizard",
    "extra": {
      "eas": {
        "projectId": "e0233a7d-4900-481e-acac-8f70c608eec3"
      }
    }
  }
}
