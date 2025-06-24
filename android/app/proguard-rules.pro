# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Regras gerais para o Firebase SDK
-keep class com.google.firebase.** { *; }
-keep class org.apache.** { *; }
-keepnames class com.fasterxml.jackson.** { *; }
-keepnames class javax.servlet.** { *; }
-keepnames class org.ietf.jgss.** { *; }
-dontwarn org.apache.**
-dontwarn org.ietf.jgss.**

# Se você usa Firebase Authentication
-keep class com.google.android.gms.internal.firebase-auth.** { *; }

# Se você usa Firestore (ESSENCIAL PARA SEU CASO)
-keep class com.google.firebase.firestore.** { *; }

# Se você usa Realtime Database (ESSENCIAL PARA SEU CASO)
-keep class com.google.firebase.database.** { *; }