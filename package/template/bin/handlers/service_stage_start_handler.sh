#!/bin/bash
# description: Used to start all service components

source /etc/sysconfig/plugin_info
source $PLUGIN_CFG_DIR/marketplace.cfg
source $MARKETPLACE_DIR/bin/marketplace_base


log "Running component startup scripts"

log "Completed"

exit 1
