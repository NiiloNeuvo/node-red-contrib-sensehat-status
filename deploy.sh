#!/bin/bash
#
# Deploys the package directly to the (raspberry pi) host running node-red. Takes around 15 seconds to
# get the library to 'production' environment with real hardware.
#
# Getting this to run directly from eclipse (avoids alt-tabbing around):
# Add PATH to Run -> External Tools -> External Tools Configurations .. -> Environmant. On my
# Apple I used the following to get npm and scp/ssh into my path:
#  ${env_var:PATH}:/usr/local/bin:/opt/local/bin
#


set -x -e

# Host running node-red
HOST=192.168.2.162
USER=openhabian
DIR=.node-red

TARGET=${USER}@${HOST}

# Test, can't get it to work on local machine
# npm test

# Package and pick up name
PACKAGE=$(npm pack)

# Copy over
scp $PACKAGE ${TARGET}:${DIR}

# Deploy and restart node-red
ssh ${TARGET} "cd $DIR ; npm install $PACKAGE --only=prod ; rm $PACKAGE ; node-red-restart"
