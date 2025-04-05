#!/bin/bash

# NOTE: SYMLINK C++ TO RE-BUILD BETTER-SQLITE3
# path: /Library/Developer/CommandLineTools/SDKs

if [[ -d /Library/Developer/CommandLineTools ]]; then
  sudo mkdir -p /Library/Developer/CommandLineTools/usr/include/c++/v1
  sudo ln -s /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include/c++/v1/* /Library/Developer/CommandLineTools/usr/include/c++/v1
fi

# export SDK_PATH=$(xcrun --show-sdk-path)
# export CPATH=`xcrun --show-sdk-path`/usr/include
