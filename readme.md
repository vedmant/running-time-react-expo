# Running Time App #

## React Native Sample Project ##

**React Native Sample Project** is a tutorial React Native Mobile Application that uses [Running Time](https://github.com/vedmant/running-time) API backend

[Demo on Expo](https://expo.io/@vedmant/running-time)

Demo login: `user@gmail.com` and password: `123456`

### Main features ###

* Simple and clean code - easy to understand for a begginer
* Based on Expo
* Using Nativewind styling
* Zustand store
* Auth flow: login and registration
* Dashboard tab with panels and charts
* Entries list tab
* Add / edit entry
* Infinite scroll
* Pull to refresh
* Profile tab: update profile


### Installation ###

Install Bun if not installed `curl -fsSL https://bun.sh/install | bash`

```bash
git clone https://github.com/vedmant/running-time-react-expo # To clone repo
cd running-time-react-expo
bun i # Install dependencies

bun dev # Start dev server
```

It will open Expo tab in your browser where you can select to run it on Android or iOS emulator or real Android device using barcode.

### TODO ###

- Add Eslinter
- Better login / register screens design
- Reports tab
- Unit tests
- Dark theme
- Background GPS tracking (start / stop, create record after finish)
- Admin panel for admin user
- Continuos integration setup


### How to build and run on iOs device

1. `bunx expo prebuild`
2. `open ios/YourProject.xcworkspace`
3. Go to project settings "Signing & Capabilities" and select your team
4. Go to project settings "Signing & Capabilities" and remove "Push Notifications"
5. Click on top bar your project name, select "Edit Scheme", select "Build Configuration" - Release
6. Build bundle with `bun ios-bundle`
7. In Xcode in Build phases -> Bundle React Native code and images -> Check off "For install builds only" if it's checked
8. Go to Xcode and run the project, select your connected device

### License ###

And of course:

[MIT](LICENSE.md)
