#!/bin/bash

nvm install 22.17.1
nvm use 22.17.1
nvm alias default 22.17.1

# Append aliases to .bashrc
npm install -g ntl

echo "" >> ~/.bashrc
echo 'alias run="ntl"' >> ~/.bashrc
echo 'alias bar="ls -lAh"' >> ~/.bashrc
